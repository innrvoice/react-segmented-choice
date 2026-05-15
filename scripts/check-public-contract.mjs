import { existsSync, readFileSync } from 'node:fs';

function fail(message) {
  console.error(`Public contract check failed: ${message}`);
  process.exit(1);
}

function read(path) {
  if (!existsSync(path)) {
    fail(`missing file: ${path}`);
  }

  return readFileSync(path, 'utf8');
}

function extractNamedExports(source) {
  const result = new Set();
  const exportRegex = /export(?:\s+type)?\s*\{([^}]+)\}/gms;

  for (const match of source.matchAll(exportRegex)) {
    const members = match[1]
      .split(',')
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => part.replace(/^type\s+/, '').trim())
      .map(part => part.split(/\s+as\s+/)[0]?.trim())
      .filter(Boolean);

    for (const member of members) {
      result.add(member);
    }
  }

  return result;
}

function extractTokens(source, pattern) {
  return new Set((source.match(pattern) ?? []).map(token => token.trim()));
}

const expectedNamedExports = [
  'SegmentedChoice',
  'SEGMENTED_CHOICE_FONT_FAMILY',
  'SEGMENTED_CHOICE_TYPOGRAPHY_TOKENS',
  'getSegmentedChoiceTypographyTokens',
  'SegmentedChoiceGeometry',
  'SegmentedChoiceIndicatorContentMode',
  'SegmentedChoiceIndicatorStyle',
  'SegmentedChoiceIndicatorTransition',
  'SegmentedChoiceOptionDistribution',
  'SegmentedChoiceOption',
  'SegmentedChoiceOptionSizing',
  'SegmentedChoiceProps',
  'SegmentedChoiceSlotProps',
  'SegmentedChoiceTrackLayout',
  'SegmentedChoiceTrackStyle',
  'SegmentedChoiceTypographyTokens',
  'SegmentedChoiceValue',
];

const stableClassHooks = [
  '.rsc-root',
  '.rsc-list',
  '.rsc-track',
  '.rsc-indicator',
  '.rsc-indicator-content',
  '.rsc-option',
  '.rsc-option-input',
  '.rsc-option-anchor',
  '.rsc-option-content',
  '.rsc-option-label',
  '.rsc-option-description',
];

const stableRootDataAttrs = [
  'data-orientation',
  'data-size',
  'data-disabled',
  'data-unstyled',
  'data-dragging',
  'data-drag-released',
];

const stableOptionDataAttrs = [
  'data-selected',
  'data-disabled',
  'data-focus-visible',
  'data-has-description',
  'data-previewed',
];

const stableCssVars = [
  '--rsc-bg',
  '--rsc-surface',
  '--rsc-border-color',
  '--rsc-border-radius',
  '--rsc-font-family',
  '--rsc-font-weight',
  '--rsc-line-height',
  '--rsc-letter-spacing',
  '--rsc-font-size',
  '--rsc-description-font-size',
  '--rsc-container-offset',
  '--rsc-padding',
  '--rsc-gap',
  '--rsc-label-gap',
  '--rsc-disabled-opacity',
  '--rsc-option-min-size',
  '--rsc-option-padding-block',
  '--rsc-option-padding-inline',
  '--rsc-option-radius',
  '--rsc-track-size',
  '--rsc-text-color',
  '--rsc-active-text-color',
  '--rsc-indicator-bg',
  '--rsc-indicator-color',
  '--rsc-indicator-hover-bg',
  '--rsc-indicator-border-width',
  '--rsc-indicator-shadow',
  '--rsc-focus-ring-color',
];

const requiredContentModeTokens = ['clone-active'];

const sourceIndex = read('src/index.ts');
const sourceComponent = read('src/SegmentedChoice/SegmentedChoice.tsx');
const sourceOptionComponent = read('src/SegmentedChoice/components/SegmentedChoiceOption.tsx');
const sourceCss = read('src/SegmentedChoice/SegmentedChoice.css');
const sourceTypeFile = read('src/SegmentedChoice/SegmentedChoice.types.ts');
const apiDoc = read('API.md');
const readmeDoc = read('README.md');
const builtDts = read('lib/index.d.ts');
const builtJs = read('lib/index.js');
const builtUmdJs = read('lib/index.umd.js');
const builtCss = read('lib/style.css');

for (const requiredToken of requiredContentModeTokens) {
  if (
    !sourceTypeFile.includes(requiredToken) ||
    !sourceCss.includes(requiredToken) ||
    !sourceComponent.includes(requiredToken) ||
    !apiDoc.includes(requiredToken) ||
    !readmeDoc.includes(requiredToken)
  ) {
    fail(`missing required content mode token in public contract: ${requiredToken}`);
  }
}

const sourceExports = extractNamedExports(sourceIndex);
const builtExports = extractNamedExports(builtDts);

for (const expectedExport of expectedNamedExports) {
  if (!sourceExports.has(expectedExport)) {
    fail(`missing export in src/index.ts: ${expectedExport}`);
  }
  if (!builtExports.has(expectedExport)) {
    fail(`missing export in lib/index.d.ts: ${expectedExport}`);
  }
}

const warningRuntimeGate = 'globalThis.process?.env?.NODE_ENV';

if (!builtJs.includes(warningRuntimeGate) || !builtUmdJs.includes(warningRuntimeGate)) {
  fail('warning runtime gate was stripped from the built JavaScript bundles');
}

for (const classHook of stableClassHooks) {
  if (!sourceCss.includes(classHook)) {
    fail(`missing stable class hook in source CSS: ${classHook}`);
  }
}

for (const dataAttr of stableRootDataAttrs) {
  if (!sourceComponent.includes(`${dataAttr}=`)) {
    fail(`missing root data attr in component render: ${dataAttr}`);
  }
}

for (const dataAttr of stableOptionDataAttrs) {
  if (!sourceOptionComponent.includes(`${dataAttr}=`)) {
    fail(`missing option data attr in component render: ${dataAttr}`);
  }
}

for (const cssVar of stableCssVars) {
  if (!sourceCss.includes(cssVar)) {
    fail(`missing stable CSS variable in source stylesheet: ${cssVar}`);
  }
  if (!builtCss.includes(cssVar)) {
    fail(`missing stable CSS variable in built stylesheet: ${cssVar}`);
  }
}

const varsFromComponent = extractTokens(sourceComponent, /--rsc-[a-z0-9-]+/g);
for (const cssVar of varsFromComponent) {
  if (!sourceCss.includes(cssVar)) {
    fail(`dead root style variable (not consumed in CSS): ${cssVar}`);
  }
}

const sourceCssVars = extractTokens(sourceCss, /--rsc-[a-z0-9-]+/g);
const builtCssVars = extractTokens(builtCss, /--rsc-[a-z0-9-]+/g);

if (sourceCssVars.size !== builtCssVars.size) {
  fail('source vs build CSS variable set size mismatch');
}

for (const cssVar of sourceCssVars) {
  if (!builtCssVars.has(cssVar)) {
    fail(`CSS variable missing from build output: ${cssVar}`);
  }
}

const sourceDataAttrs = extractTokens(sourceCss, /data-[a-z0-9-]+/g);
const builtDataAttrs = extractTokens(builtCss, /data-[a-z0-9-]+/g);

if (sourceDataAttrs.size !== builtDataAttrs.size) {
  fail('source vs build data-attribute selector set size mismatch');
}

for (const dataAttr of sourceDataAttrs) {
  if (!builtDataAttrs.has(dataAttr)) {
    fail(`data-attribute selector missing from build output: ${dataAttr}`);
  }
}

const sourceClassHooks = extractTokens(sourceCss, /\.rsc-[a-z0-9-]+/g);
const builtClassHooks = extractTokens(builtCss, /\.rsc-[a-z0-9-]+/g);

if (sourceClassHooks.size !== builtClassHooks.size) {
  fail('source vs build class hook selector set size mismatch');
}

for (const classHook of sourceClassHooks) {
  if (!builtClassHooks.has(classHook)) {
    fail(`class hook selector missing from build output: ${classHook}`);
  }
}

console.log('Public contract check passed.');

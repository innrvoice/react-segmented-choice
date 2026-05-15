const warnedMessages = new Set<string>();

function isDevEnvironment() {
  return process.env.NODE_ENV !== 'production';
}

function warnOnce(key: string, message: string) {
  if (!isDevEnvironment() || warnedMessages.has(key)) {
    return;
  }

  warnedMessages.add(key);
  console.warn(message);
}

export function warnTooFewOptions(count: number) {
  warnOnce(
    'too-few-options',
    `[react-segmented-choice] SegmentedChoice requires at least 2 options. Received ${count}.`
  );
}

export function warnDuplicateValues(values: string[]) {
  warnOnce(
    `duplicate-values:${values.join('|')}`,
    `[react-segmented-choice] SegmentedChoice option values must be unique. Duplicate values: ${values.join(', ')}.`
  );
}

export function warnNonStringOptionValues(indexes: number[]) {
  warnOnce(
    `non-string-option-values:${indexes.join('|')}`,
    `[react-segmented-choice] SegmentedChoice option values must be strings. Invalid values at indexes: ${indexes.join(', ')}.`
  );
}

export function warnInvalidControlledValue(value: string) {
  warnOnce(
    `invalid-controlled:${value}`,
    `[react-segmented-choice] The controlled value "${value}" does not match an enabled option. No option will be selected until the parent supplies a valid value.`
  );
}

export function warnInvalidDefaultValue(value: string) {
  warnOnce(
    `invalid-default:${value}`,
    `[react-segmented-choice] The defaultValue "${value}" does not match an enabled option. Falling back to the first enabled option.`
  );
}

export function warnMissingAriaLabel(value: string) {
  warnOnce(
    `missing-aria-label:${value}`,
    `[react-segmented-choice] Option "${value}" appears to use non-text visible content without ariaLabel. Provide ariaLabel for icon-only or thumbnail-only options.`
  );
}

export function warnMissingGroupLabel() {
  warnOnce(
    'missing-group-label',
    '[react-segmented-choice] SegmentedChoice requires either ariaLabel or ariaLabelledby for the radiogroup.'
  );
}

export function warnControlledModeSwitch(mode: 'controlled' | 'uncontrolled') {
  warnOnce(
    `controlled-mode-switch:${mode}`,
    `[react-segmented-choice] SegmentedChoice changed to ${mode} mode after mount. Avoid switching between controlled and uncontrolled usage.`
  );
}

export function warnInvalidAccentColor(value: string) {
  warnOnce(
    `invalid-accent-color:${value}`,
    `[react-segmented-choice] SegmentedChoice received an unsupported accentColor "${value}". Supported formats are hex, named colors, rgb(a), hsl(a) and var(--token). Ignoring accentColor.`
  );
}

export function __resetSegmentedChoiceWarnings() {
  warnedMessages.clear();
}

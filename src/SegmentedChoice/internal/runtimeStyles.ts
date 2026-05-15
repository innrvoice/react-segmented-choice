import { useLayoutEffect } from 'react';

type RuntimeStyleManager = {
  nonce: string | null;
  rules: Map<string, string>;
  styleElement: HTMLStyleElement;
};

const runtimeStyleManagers = new WeakMap<Document, Map<string, RuntimeStyleManager>>();
const NO_NONCE_KEY = '__rsc-no-nonce__';
const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{3,8}$/;
const NAMED_COLOR_PATTERN = /^[a-zA-Z]+$/;
const RGB_COLOR_PATTERN = /^rgba?\(\s*[-+0-9.%\s,/]+\)$/;
const HSL_COLOR_PATTERN = /^hsla?\(\s*[-+0-9.%\s,/]*(?:deg|grad|rad|turn)?[-+0-9.%\s,/]*\)$/;
const CSS_VAR_COLOR_PATTERN = /^var\(\s*--[a-zA-Z0-9_-]+\s*\)$/;

export function toCssLength(value: number | string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : value;
}

export function toInstanceId(id: string) {
  return `rsc-${id.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

export function sanitizeAccentColor(value: string | undefined) {
  const normalizedValue = value?.trim();
  if (!normalizedValue) {
    return undefined;
  }

  if (
    HEX_COLOR_PATTERN.test(normalizedValue) ||
    NAMED_COLOR_PATTERN.test(normalizedValue) ||
    RGB_COLOR_PATTERN.test(normalizedValue) ||
    HSL_COLOR_PATTERN.test(normalizedValue) ||
    CSS_VAR_COLOR_PATTERN.test(normalizedValue)
  ) {
    return normalizedValue;
  }

  return undefined;
}

export function buildScopedRule({
  declarations,
  instanceId,
}: {
  declarations: Array<readonly [property: string, value: string | undefined]>;
  instanceId: string;
}) {
  const body = declarations
    .filter(([, value]) => value !== undefined)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n');

  if (!body) {
    return '';
  }

  return `[data-rsc-instance="${instanceId}"] {\n${body}\n}`;
}

function updateRuntimeStyleText(manager: RuntimeStyleManager) {
  manager.styleElement.textContent = Array.from(manager.rules.values()).filter(Boolean).join('\n');
}

function createRuntimeStyleElement(doc: Document, nonce: string | null) {
  const styleElement = doc.createElement('style');
  styleElement.dataset.rscRuntime = 'true';

  if (nonce) {
    styleElement.nonce = nonce;
  }

  doc.head.appendChild(styleElement);
  return styleElement;
}

function getRuntimeStyleManagersForDocument(doc: Document) {
  const existingManagers = runtimeStyleManagers.get(doc);

  if (existingManagers) {
    return existingManagers;
  }

  const managers = new Map<string, RuntimeStyleManager>();
  runtimeStyleManagers.set(doc, managers);
  return managers;
}

function getRuntimeStyleManager(doc: Document, requestedNonce: string | undefined) {
  const normalizedNonce = requestedNonce ?? null;
  const managerKey = normalizedNonce ?? NO_NONCE_KEY;
  const managers = getRuntimeStyleManagersForDocument(doc);
  const existingManager = managers.get(managerKey);

  if (existingManager) {
    return existingManager;
  }

  const manager = {
    nonce: normalizedNonce,
    rules: new Map<string, string>(),
    styleElement: createRuntimeStyleElement(doc, normalizedNonce),
  } satisfies RuntimeStyleManager;
  managers.set(managerKey, manager);
  return manager;
}

export function useRuntimeStyleRule({
  instanceId,
  ownerDocument,
  ruleText,
  styleNonce,
}: {
  instanceId: string;
  ownerDocument: Document | null;
  ruleText: string;
  styleNonce: string | undefined;
}) {
  useLayoutEffect(() => {
    if (!ownerDocument) {
      return;
    }

    const managerKey = styleNonce ?? NO_NONCE_KEY;
    const manager = getRuntimeStyleManager(ownerDocument, styleNonce);
    manager.rules.set(instanceId, ruleText);
    updateRuntimeStyleText(manager);

    return () => {
      const activeManagers = runtimeStyleManagers.get(ownerDocument);
      const activeManager = activeManagers?.get(managerKey);
      if (!activeManagers || !activeManager) {
        return;
      }

      activeManager.rules.delete(instanceId);

      if (activeManager.rules.size === 0) {
        activeManager.styleElement.remove();
        activeManagers.delete(managerKey);

        if (activeManagers.size === 0) {
          runtimeStyleManagers.delete(ownerDocument);
        }

        return;
      }

      updateRuntimeStyleText(activeManager);
    };
  }, [instanceId, ownerDocument, ruleText, styleNonce]);
}

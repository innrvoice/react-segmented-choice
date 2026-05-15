import { screen } from '@testing-library/react';

export const baseOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
] as const;

export function getRadio(name: string) {
  return screen.getByRole('radio', { name });
}

export function getCssVar(element: Element, name: string) {
  return getComputedStyle(element as HTMLElement)
    .getPropertyValue(name)
    .trim();
}

export function getRuntimeStyleElement() {
  return document.head.querySelector('style[data-rsc-runtime="true"]') as HTMLStyleElement | null;
}

export function getRuntimeStyleElements() {
  return Array.from(
    document.head.querySelectorAll('style[data-rsc-runtime="true"]')
  ) as HTMLStyleElement[];
}

export function getRuntimeStyleRuleFor(element: HTMLElement) {
  const instanceId = element.dataset.rscInstance;
  if (!instanceId) {
    return '';
  }

  const escapedInstanceId = instanceId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const runtimeStyle = getRuntimeStyleElements().find(styleElement =>
    new RegExp(`\\[data-rsc-instance="${escapedInstanceId}"\\] \\{([\\s\\S]*?)\\}`).test(
      styleElement.textContent ?? ''
    )
  );
  if (!runtimeStyle?.textContent) {
    return '';
  }

  const match = runtimeStyle.textContent.match(
    new RegExp(`\\[data-rsc-instance="${escapedInstanceId}"\\] \\{([\\s\\S]*?)\\}`)
  );

  return match?.[0] ?? '';
}

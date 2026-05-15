import type React from 'react';

export function measureOptionRect<
  MeasureElement extends HTMLElement,
  OptionElement extends HTMLElement,
>({
  index,
  measureRefs,
  optionRefs,
}: {
  index: number;
  measureRefs: React.RefObject<Array<MeasureElement | null>>;
  optionRefs: React.RefObject<Array<OptionElement | null>>;
}) {
  const measuredElement = measureRefs.current[index];
  if (measuredElement) {
    const rect = measuredElement.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      return rect;
    }
  }

  const optionElement = optionRefs.current[index];
  if (!optionElement) {
    return null;
  }

  return optionElement.getBoundingClientRect();
}

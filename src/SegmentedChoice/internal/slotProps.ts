import type * as React from 'react';

import type { SegmentedChoiceSlotProps } from '../SegmentedChoice.types';

type NormalizedSlot<Props> = {
  className: string | undefined;
  props: Omit<Props, 'className' | 'style'>;
};

export type NormalizedSlotProps = {
  root: NormalizedSlot<
    React.HTMLAttributes<HTMLDivElement> & { className?: string; style?: unknown }
  >;
  list: NormalizedSlot<
    React.HTMLAttributes<HTMLDivElement> & { className?: string; style?: unknown }
  >;
  track: NormalizedSlot<
    React.HTMLAttributes<HTMLSpanElement> & { className?: string; style?: unknown }
  >;
  indicator: NormalizedSlot<
    React.HTMLAttributes<HTMLSpanElement> & { className?: string; style?: unknown }
  >;
  indicatorContent: NormalizedSlot<
    React.HTMLAttributes<HTMLSpanElement> & { className?: string; style?: unknown }
  >;
  option: NormalizedSlot<
    React.LabelHTMLAttributes<HTMLLabelElement> & { className?: string; style?: unknown }
  >;
  optionAnchor: NormalizedSlot<
    React.HTMLAttributes<HTMLSpanElement> & { className?: string; style?: unknown }
  >;
  optionContent: NormalizedSlot<
    React.HTMLAttributes<HTMLSpanElement> & { className?: string; style?: unknown }
  >;
  optionLabel: NormalizedSlot<
    React.HTMLAttributes<HTMLSpanElement> & { className?: string; style?: unknown }
  >;
  optionDescription: NormalizedSlot<
    React.HTMLAttributes<HTMLSpanElement> & { className?: string; style?: unknown }
  >;
};

function normalizeSlot<Props extends { className?: string; style?: unknown }>(
  slot: Props | undefined
): NormalizedSlot<Props> {
  const { className, style: _ignoredStyle, ...props } = (slot ?? {}) as Props;

  return {
    className,
    props,
  };
}

export function normalizeSlotProps(slotProps: SegmentedChoiceSlotProps | undefined) {
  return {
    root: normalizeSlot(slotProps?.root),
    list: normalizeSlot(slotProps?.list),
    track: normalizeSlot(slotProps?.track),
    indicator: normalizeSlot(slotProps?.indicator),
    indicatorContent: normalizeSlot(slotProps?.indicatorContent),
    option: normalizeSlot(slotProps?.option),
    optionAnchor: normalizeSlot(slotProps?.optionAnchor),
    optionContent: normalizeSlot(slotProps?.optionContent),
    optionLabel: normalizeSlot(slotProps?.optionLabel),
    optionDescription: normalizeSlot(slotProps?.optionDescription),
  } satisfies NormalizedSlotProps;
}

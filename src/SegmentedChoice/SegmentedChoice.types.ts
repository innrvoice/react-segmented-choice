import type * as React from 'react';

export type SegmentedChoiceValue = string;

export type SegmentedChoiceSize = 'sm' | 'md' | 'lg';

export type SegmentedChoiceTrackLayout = 'container' | 'center-span';

export type SegmentedChoiceTrackStyle = 'surface' | 'none';

export type SegmentedChoiceIndicatorStyle = 'fill' | 'ring' | 'none';

export type SegmentedChoiceIndicatorContentMode = 'none' | 'clone-active';

export type SegmentedChoiceIndicatorTransition = 'smooth' | 'instant';

export type SegmentedChoiceOptionSizing = 'equal' | 'content';

export type SegmentedChoiceOptionDistribution = 'space-between' | 'space-around';

export type SegmentedChoiceOption<T extends SegmentedChoiceValue = string> = {
  value: T;
  label: React.ReactNode;
  ariaLabel?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  accentColor?: string;
};

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

type SlotDivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> & DataAttributes;
type SlotSpanProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> & DataAttributes;
type SlotLabelProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'style'> & DataAttributes;
type RootSlotDivProps = Omit<
  SlotDivProps,
  'aria-describedby' | 'aria-label' | 'aria-labelledby' | 'aria-orientation' | 'role'
>;

export type SegmentedChoiceSlotProps = {
  root?: RootSlotDivProps;
  list?: SlotDivProps;
  track?: SlotSpanProps;
  indicator?: SlotSpanProps;
  indicatorContent?: SlotSpanProps;
  option?: SlotLabelProps;
  optionAnchor?: SlotSpanProps;
  optionContent?: SlotSpanProps;
  optionLabel?: SlotSpanProps;
  optionDescription?: SlotSpanProps;
};

export type SegmentedChoiceGeometrySize = {
  size?: number;
  width?: number;
  height?: number;
};

export type SegmentedChoiceGeometry = {
  mode?: 'underlay' | 'overlay';
  dragScale?: boolean | number;
  optionSize?: number;
  anchor?: SegmentedChoiceGeometrySize;
  track?: {
    layout?: SegmentedChoiceTrackLayout;
    style?: SegmentedChoiceTrackStyle;
  };
  indicator?: SegmentedChoiceGeometrySize & {
    style?: SegmentedChoiceIndicatorStyle;
    content?: SegmentedChoiceIndicatorContentMode;
    transition?: SegmentedChoiceIndicatorTransition;
    inset?: number;
    borderWidth?: number;
  };
};

export interface SegmentedChoiceProps<T extends SegmentedChoiceValue = string> {
  options: readonly SegmentedChoiceOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  optionSizing?: SegmentedChoiceOptionSizing;
  optionDistribution?: SegmentedChoiceOptionDistribution;
  size?: SegmentedChoiceSize;
  draggable?: boolean;
  loop?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  className?: string;
  styleNonce?: string;
  unstyled?: boolean;
  slotProps?: SegmentedChoiceSlotProps;
  geometry?: SegmentedChoiceGeometry;
}

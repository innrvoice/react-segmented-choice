import type { Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import type { SegmentedChoiceProps } from '../../index';

export const segmentedChoiceOnValueChangeAction = action('onValueChange');

export const segmentedChoiceStoryArgs = {
  disabled: false,
  draggable: true,
  loop: true,
  onValueChange: segmentedChoiceOnValueChangeAction,
  optionDistribution: 'space-between',
  optionSizing: 'equal',
  orientation: 'horizontal',
  required: false,
  size: 'md',
  unstyled: false,
} satisfies Pick<
  SegmentedChoiceProps,
  | 'disabled'
  | 'draggable'
  | 'loop'
  | 'onValueChange'
  | 'optionDistribution'
  | 'optionSizing'
  | 'orientation'
  | 'required'
  | 'size'
  | 'unstyled'
>;

export const segmentedChoiceStoryArgTypes = {
  disabled: {
    control: 'boolean',
  },
  optionDistribution: {
    control: { type: 'inline-radio' },
    options: ['space-between', 'space-around'],
  },
  optionSizing: {
    control: { type: 'inline-radio' },
    options: ['equal', 'content'],
  },
  draggable: {
    control: 'boolean',
  },
  loop: {
    control: 'boolean',
  },
  orientation: {
    control: { type: 'inline-radio' },
    options: ['horizontal', 'vertical'],
  },
  required: {
    control: 'boolean',
  },
  size: {
    control: { type: 'inline-radio' },
    options: ['sm', 'md', 'lg'],
  },
  unstyled: {
    control: 'boolean',
  },
} satisfies NonNullable<Meta<SegmentedChoiceProps>['argTypes']>;

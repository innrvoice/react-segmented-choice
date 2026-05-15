import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { SegmentedChoice } from '../../index';
import {
  segmentedChoiceStoryArgTypes,
  segmentedChoiceStoryArgs,
  segmentedChoiceOnValueChangeAction,
} from '../shared/SegmentedChoiceStoryControls';
import { StoryShell } from '../shared/StoryStyles';

const meta = {
  title: 'Basics/Getting Started',
  component: SegmentedChoice,
  args: {
    ...segmentedChoiceStoryArgs,
    ariaLabel: 'Project view',
    defaultValue: 'board',
    options: [
      { value: 'board', label: 'Board' },
      { value: 'list', label: 'List' },
      { value: 'timeline', label: 'Timeline' },
    ],
    size: 'sm',
  },
  argTypes: segmentedChoiceStoryArgTypes,
  decorators: [
    Story => (
      <StoryShell compact>
        <Story />
      </StoryShell>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'A minimal reference example with the default styling, equal emphasis labels and no custom wrappers.',
      },
    },
  },
} satisfies Meta<typeof SegmentedChoice>;

export default meta;

type Story = Omit<StoryObj<typeof meta>, 'args'> & {
  args?: Partial<NonNullable<StoryObj<typeof meta>['args']>>;
};

export const GettingStarted: Story = {
  name: 'Getting Started',
  args: {
    onValueChange: segmentedChoiceOnValueChangeAction,
  },
};

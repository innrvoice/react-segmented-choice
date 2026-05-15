import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { SegmentedChoice } from '../../../index';
import {
  segmentedChoiceStoryArgTypes,
  segmentedChoiceStoryArgs,
} from '../../shared/SegmentedChoiceStoryControls';
import { StoryShell } from '../../shared/StoryStyles';
import {
  ArrowKeySelectionHorizontal as arrowKeySelectionHorizontalBaseStory,
  ArrowKeySelectionVertical as arrowKeySelectionVerticalBaseStory,
} from '../SegmentedChoiceInteractionExamples';

const meta = {
  title: 'Internal Tests/Interactions/Keyboard',
  component: SegmentedChoice,
  args: segmentedChoiceStoryArgs,
  argTypes: segmentedChoiceStoryArgTypes,
  tags: ['!dev', '!autodocs'],
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
        component:
          'Keyboard interaction tests covering horizontal and vertical arrow-key navigation.',
      },
    },
  },
} satisfies Meta<typeof SegmentedChoice>;

export default meta;

type Story = Omit<StoryObj<typeof meta>, 'args'> & {
  args?: Partial<NonNullable<StoryObj<typeof meta>['args']>>;
};

export const ArrowKeySelectionHorizontal: Story = {
  ...arrowKeySelectionHorizontalBaseStory,
  name: 'Arrow Key Selection Horizontal',
  parameters: {
    ...arrowKeySelectionHorizontalBaseStory.parameters,
    docs: {
      description: {
        story: 'Verifies horizontal keyboard navigation via arrow keys.',
      },
    },
  },
};

export const ArrowKeySelectionVertical: Story = {
  ...arrowKeySelectionVerticalBaseStory,
  name: 'Arrow Key Selection Vertical',
  parameters: {
    ...arrowKeySelectionVerticalBaseStory.parameters,
    docs: {
      description: {
        story: 'Verifies vertical keyboard navigation via arrow keys.',
      },
    },
  },
};

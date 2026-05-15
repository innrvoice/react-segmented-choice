import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { SegmentedChoice } from '../../../index';
import {
  segmentedChoiceStoryArgTypes,
  segmentedChoiceStoryArgs,
} from '../../shared/SegmentedChoiceStoryControls';
import { StoryShell } from '../../shared/StoryStyles';
import {
  ControlledParentCorrectness as controlledParentCorrectnessBaseStory,
  DisabledOptionRejection as disabledOptionRejectionBaseStory,
  IconOnlyA11yLabeling as iconOnlyA11yLabelingBaseStory,
  ThumbnailSelection as thumbnailSelectionBaseStory,
} from '../SegmentedChoiceInteractionExamples';

const meta = {
  title: 'Internal Tests/Interactions/State & A11y',
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
          'State and accessibility tests covering disabled handling, controlled sync, icon-only labels and thumbnail selection.',
      },
    },
  },
} satisfies Meta<typeof SegmentedChoice>;

export default meta;

type Story = Omit<StoryObj<typeof meta>, 'args'> & {
  args?: Partial<NonNullable<StoryObj<typeof meta>['args']>>;
};

export const DisabledOptionRejection: Story = {
  ...disabledOptionRejectionBaseStory,
  name: 'Disabled Option Rejection',
  parameters: {
    ...disabledOptionRejectionBaseStory.parameters,
    docs: {
      description: {
        story: 'Checks that disabled options cannot be selected through pointer interaction.',
      },
    },
  },
};

export const ControlledParentCorrectness: Story = {
  ...controlledParentCorrectnessBaseStory,
  name: 'Controlled Parent Correctness',
  parameters: {
    ...controlledParentCorrectnessBaseStory.parameters,
    docs: {
      description: {
        story: 'Ensures parent-controlled state stays in sync with user interaction.',
      },
    },
  },
};

export const IconOnlyA11yLabeling: Story = {
  ...iconOnlyA11yLabelingBaseStory,
  name: 'Icon Only A11y Labeling',
  parameters: {
    ...iconOnlyA11yLabelingBaseStory.parameters,
    docs: {
      description: {
        story: 'Validates accessible labeling for icon-only options.',
      },
    },
  },
};

export const ThumbnailSelection: Story = {
  ...thumbnailSelectionBaseStory,
  name: 'Thumbnail Selection',
  parameters: {
    ...thumbnailSelectionBaseStory.parameters,
    docs: {
      description: {
        story: 'Verifies thumbnail-based options remain selectable and report the expected value.',
      },
    },
  },
};

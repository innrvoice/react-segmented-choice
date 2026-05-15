import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { SegmentedChoice } from '../../../index';
import {
  segmentedChoiceStoryArgTypes,
  segmentedChoiceStoryArgs,
} from '../../shared/SegmentedChoiceStoryControls';
import { StoryShell } from '../../shared/StoryStyles';
import {
  ClickToSelectHorizontal as clickToSelectHorizontalBaseStory,
  ClickToSelectVertical as clickToSelectVerticalBaseStory,
  DragCommitHorizontal as dragCommitHorizontalBaseStory,
  DragCommitVertical as dragCommitVerticalBaseStory,
  MidpointDragResolvesBackward as midpointDragResolvesBackwardBaseStory,
  MidpointDragResolvesForward as midpointDragResolvesForwardBaseStory,
  MidpointDragWithoutDirectionKeepsCurrent as midpointDragWithoutDirectionKeepsCurrentBaseStory,
  NoPersistentFocusRingAfterPointerClick as noPersistentFocusRingAfterPointerClickBaseStory,
} from '../SegmentedChoiceInteractionExamples';

const meta = {
  title: 'Internal Tests/Interactions/Pointer',
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
          'Pointer interaction tests covering click selection, drag commits, midpoint resolution and focus-ring behavior.',
      },
    },
  },
} satisfies Meta<typeof SegmentedChoice>;

export default meta;

type Story = Omit<StoryObj<typeof meta>, 'args'> & {
  args?: Partial<NonNullable<StoryObj<typeof meta>['args']>>;
};

export const ClickToSelectHorizontal: Story = {
  ...clickToSelectHorizontalBaseStory,
  name: 'Click To Select Horizontal',
  parameters: {
    ...clickToSelectHorizontalBaseStory.parameters,
    docs: {
      description: {
        story: 'Verifies that pointer clicks update the selected horizontal option.',
      },
    },
  },
};

export const ClickToSelectVertical: Story = {
  ...clickToSelectVerticalBaseStory,
  name: 'Click To Select Vertical',
  parameters: {
    ...clickToSelectVerticalBaseStory.parameters,
    docs: {
      description: {
        story: 'Verifies click selection for the vertical layout.',
      },
    },
  },
};

export const DragCommitHorizontal: Story = {
  ...dragCommitHorizontalBaseStory,
  name: 'Drag Commit Horizontal',
  parameters: {
    ...dragCommitHorizontalBaseStory.parameters,
    docs: {
      description: {
        story: 'Ensures drag gestures commit the expected target in the horizontal layout.',
      },
    },
  },
};

export const DragCommitVertical: Story = {
  ...dragCommitVerticalBaseStory,
  name: 'Drag Commit Vertical',
  parameters: {
    ...dragCommitVerticalBaseStory.parameters,
    docs: {
      description: {
        story: 'Ensures drag gestures commit the expected target in the vertical layout.',
      },
    },
  },
};

export const MidpointDragResolvesForward: Story = {
  ...midpointDragResolvesForwardBaseStory,
  name: 'Midpoint Drag Resolves Forward',
  parameters: {
    ...midpointDragResolvesForwardBaseStory.parameters,
    docs: {
      description: {
        story: 'Checks midpoint resolution when the drag intent points forward.',
      },
    },
  },
};

export const MidpointDragResolvesBackward: Story = {
  ...midpointDragResolvesBackwardBaseStory,
  name: 'Midpoint Drag Resolves Backward',
  parameters: {
    ...midpointDragResolvesBackwardBaseStory.parameters,
    docs: {
      description: {
        story: 'Checks midpoint resolution when the drag intent points backward.',
      },
    },
  },
};

export const MidpointDragWithoutDirectionKeepsCurrent: Story = {
  ...midpointDragWithoutDirectionKeepsCurrentBaseStory,
  name: 'Midpoint Drag Without Direction Keeps Current',
  parameters: {
    ...midpointDragWithoutDirectionKeepsCurrentBaseStory.parameters,
    docs: {
      description: {
        story: 'Ensures midpoint drops without directional movement preserve the current option.',
      },
    },
  },
};

export const NoPersistentFocusRingAfterPointerClick: Story = {
  ...noPersistentFocusRingAfterPointerClickBaseStory,
  name: 'No Persistent Focus Ring After Pointer Click',
  parameters: {
    ...noPersistentFocusRingAfterPointerClickBaseStory.parameters,
    docs: {
      description: {
        story: 'Checks that pointer interaction does not leave a keyboard-only focus ring behind.',
      },
    },
  },
};

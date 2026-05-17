import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { within } from 'storybook/test';

import { SegmentedChoice } from '../../index';
import {
  segmentedChoiceStoryArgTypes,
  segmentedChoiceStoryArgs,
  segmentedChoiceOnValueChangeAction,
} from '../shared/SegmentedChoiceStoryControls';
import { StoryShell } from '../shared/StoryStyles';

const meta = {
  title: 'Basics/States',
  component: SegmentedChoice,
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
        component:
          'State references for the cases most apps hit first: controlled value, default value and disabled choices.',
      },
    },
  },
} satisfies Meta<typeof SegmentedChoice>;

export default meta;

type Story = Omit<StoryObj<typeof meta>, 'args'> & {
  args?: Partial<NonNullable<StoryObj<typeof meta>['args']>>;
};
type StoryProps = Partial<React.ComponentProps<typeof SegmentedChoice>>;

function KeyboardFocusVisibleExample({ ...storyProps }: StoryProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (!rootRef.current) {
        return;
      }

      within(rootRef.current).getByRole('radio', { name: 'Week' }).focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <SegmentedChoice
      {...storyProps}
      ref={rootRef}
      ariaLabel="Keyboard focus"
      defaultValue="week"
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]}
    />
  );
}

function ControlledExample({
  onValueChange = segmentedChoiceOnValueChangeAction,
  ...storyProps
}: StoryProps) {
  const [value, setValue] = React.useState<'standard' | 'express' | 'pickup'>('express');

  return (
    <div className="demo-choice-stack">
      <div className="demo-selection-readout">
        Selected: <code>{value}</code>
      </div>
      <SegmentedChoice
        {...storyProps}
        ariaLabel="Shipping method"
        optionSizing="content"
        onValueChange={nextValue => {
          setValue(nextValue as typeof value);
          onValueChange?.(nextValue);
        }}
        options={[
          { value: 'standard', label: 'Standard', description: '3 to 5 business days' },
          { value: 'express', label: 'Express', description: 'Next business day' },
          { value: 'pickup', label: 'Store pickup', description: 'Ready in two hours' },
        ]}
        value={value}
      />
    </div>
  );
}

export const Controlled: Story = {
  name: 'Controlled',
  args: {
    ...segmentedChoiceStoryArgs,
    size: 'sm',
  },
  render: args => <ControlledExample {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'A controlled example with a live readout, matching the shape used when selection belongs to app state.',
      },
    },
  },
};

export const Uncontrolled: Story = {
  name: 'Uncontrolled',
  args: {
    ...segmentedChoiceStoryArgs,
    size: 'sm',
    ariaLabel: 'Theme',
    defaultValue: 'system',
    options: [
      { value: 'system', label: 'System' },
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'An uncontrolled baseline: pass `defaultValue`, then let the control own the selected value.',
      },
    },
  },
};

export const Disabled: Story = {
  name: 'Disabled',
  tags: ['visual'],
  args: {
    ...segmentedChoiceStoryArgs,
    size: 'sm',
    ariaLabel: 'View mode',
    defaultValue: 'list',
    disabled: true,
    options: [
      { value: 'board', label: 'Board' },
      { value: 'list', label: 'List' },
      { value: 'timeline', label: 'Timeline' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'The whole control disabled, including pointer, keyboard and form interaction.',
      },
    },
  },
};

export const PartiallyDisabled: Story = {
  name: 'Partially Disabled',
  tags: ['visual'],
  args: {
    ...segmentedChoiceStoryArgs,
    size: 'sm',
    ariaLabel: 'Export quality',
    defaultValue: 'balanced',
    options: [
      { value: 'draft', label: 'Draft', disabled: true },
      { value: 'balanced', label: 'Balanced' },
      { value: 'pro', label: 'Pro', disabled: true },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Enabled and disabled options in the same group, for choices that are temporarily unavailable.',
      },
    },
  },
};

export const KeyboardFocusVisible: Story = {
  name: 'Keyboard Focus Visible',
  tags: ['visual'],
  args: {
    ...segmentedChoiceStoryArgs,
    size: 'sm',
  },
  render: args => <KeyboardFocusVisibleExample {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Shows the keyboard-visible focus treatment on a selected option, where regressions are easiest to miss.',
      },
    },
  },
};

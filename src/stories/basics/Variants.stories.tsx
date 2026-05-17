import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { SegmentedChoice } from '../../index';
import {
  segmentedChoiceStoryArgTypes,
  segmentedChoiceStoryArgs,
} from '../shared/SegmentedChoiceStoryControls';
import { StoryShell } from '../shared/StoryStyles';

const iconStoryStyles = `
  .demo-icon-chip {
    width: 2.5rem;
    height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
  }

  .demo-icon-chip svg {
    display: block;
  }

  .demo-story-shell--reference .demo-icon-chip {
    width: 2.05rem;
    height: 2.05rem;
  }
`;

function IconStoryStyles() {
  return <style>{iconStoryStyles}</style>;
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#F7B43B"
    >
      <path d="M444-828v-48q0-15 10.5-25.5T480-912q15 0 25.5 10.5T516-876v48q0 15-10.5 25.5T480-792q-15 0-25.5-10.5T444-828Zm0 744v-48q0 15 10.5 25.5T480-168q15 0 25.5 10.5T516-132v48q0 15-10.5 25.5T480-48q-15 0-25.5-10.5T444-84Zm432-360h-48q-15 0-25.5-10.5T792-480q0-15 10.5-25.5T828-516h48q15 0 25.5 10.5T912-480q0 15-10.5 25.5T876-444Zm-744 0H84q-15 0-25.5-10.5T48-480q0-15 10.5-25.5T84-516h48q15 0 25.5 10.5T168-480q0 15-10.5 25.5T132-444Zm653-288-34 32q-11 11-25.5 10.5T700-701q-11-11-11-25t11-25l33-35q11-11 26.5-11t26.5 11q11 11 10.5 27T785-732ZM260-209l-32 34q-11 11-26.5 11T175-175q-11-11-10.5-27t11.5-27l33-31q11-11 25.5-10.5T260-259q11 11 11 25t-11 25Zm472 33-32-33q-11-11-10.5-25.5T701-260q11-11 25-11.5t25 10.5l35 33q11 11 11 26.5T786-175q-11 11-27 10.5T732-176ZM209-700l-34-33q-11-11-11.5-26t10.5-26q11-11 27.5-11.5T229-785l32 34q10 11 9.5 25.5T259-700q-11 11-25 11t-25-11Zm101 390q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#8A4FFF"
    >
      <path d="M345.5-489.5Q315-531 291-577q-11 22-16.5 46t-5.5 49q0 88.84 62.08 150.92Q393.16-269 482-269q25 0 48.27-5.5Q553.53-280 576-291q-46-24-87-54.5T412-412q-36-36-66.5-77.5ZM480-192q-57 0-110-21.5T276-276q-41-41-62.5-94T192-480q0-55.2 19.79-105.54Q231.58-635.87 270-677q14-14 33-11.5t26 20.5q23 58 56.5 109.5T463-463q44 44 95.56 78.12Q610.12-350.75 668-328q17 7 19 26.5t-12.81 33.91Q634-231 584-211.5T480-192Zm234.06-197q-14.06-5-20.56-18.89Q687-421.77 690-437q11-53-2.5-104T633-633q-38-38-90.5-53.5T438-691q-15.4 3-28.98-3.39Q395.43-700.78 390-715q-5-14 2.02-27.68Q399.03-756.35 414-760q73-17 144 2t126.03 74.03Q738-630 757.5-557.5T760-413q-3.65 14.94-17.32 21.97Q729-384 714.06-389ZM480.21-840q-15.21 0-25.71-10.35T444-876v-48q0-15.3 10.29-25.65Q464.58-960 479.79-960t25.71 10.35Q516-939.3 516-924v48q0 15.3-10.29 25.65Q495.42-840 480.21-840Zm0 840Q465 0 454.5-10.35T444-36v-48q0-15.3 10.29-25.65Q464.58-120 479.79-120t25.71 10.35Q516-99.3 516-84v48q0 15.3-10.29 25.65Q495.42 0 480.21 0ZM735-735q-11-11-11-25.67 0-14.66 11-25.33l34-34q11-11 25-10.5t25 11.02q11 11.48 11 26.15 0 14.66-11 25.33l-34 34q-11 11-25 10.5T735-735ZM141-140.52q-11-11.48-11-26.15 0-14.66 11-25.33l34-34q11-11 25-10.5t25 11.5q11 11 11 25.67 0 14.66-11 25.33l-34 34q-11 11-25 10.5t-25-11.02ZM876-444q-15.3 0-25.65-10.29Q840-464.58 840-479.79t10.35-25.71Q860.7-516 876-516h48q15.3 0 25.65 10.29Q960-495.42 960-480.21t-10.35 25.71Q939.3-444 924-444h-48Zm-840 0q-15.3 0-25.65-10.29Q0-464.58 0-479.79t10.35-25.71Q20.7-516 36-516h48q15.3 0 25.65 10.29Q120-495.42 120-480.21t-10.35 25.71Q99.3-444 84-444H36Zm784.48 303q-11.48 11-26.15 11-14.66 0-25.33-11l-35-34q-11-11-10.5-25t11.5-25q11-11 25.67-11 14.66 0 25.33 11l34 34q11 11 11 25t-10.52 25ZM226-735q-11 11-25.67 11-14.66 0-25.33-11l-35-34q-11-11-10.5-25t11.02-25q11.48-11 26.15-11 14.66 0 25.33 11l34 34q11 10.64 11 24.82T226-735Zm186 323Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#2C3B67"
    >
      <path d="M384-96q-34.74 0-69.49-7-34.74-7-66.51-21-10-5-16-13.75T226-157q0-8.13 3.5-15.35Q233-179.58 240-185q68-54 106-131t38-164q0-87-39-163.5T239-775q-6.07-5.44-9.53-12.7-3.47-7.25-3.47-15.42 0-10.88 6-19.38 6-8.5 16.5-13.5 31.5-14 66.17-21 34.66-7 69.33-7 80 0 149.5 30t122 82.5Q708-699 738-629.28q30 69.73 30 149Q768-401 738-331t-82.5 122.5Q603-156 533.5-126T384-96Z" />
    </svg>
  );
}

const meta = {
  title: 'Basics/Variants',
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
          'Plain SegmentedChoice variants for checking orientation and content shape before adding a custom skin.',
      },
    },
  },
} satisfies Meta<typeof SegmentedChoice>;

export default meta;

type Story = Omit<StoryObj<typeof meta>, 'args'> & {
  args?: Partial<NonNullable<StoryObj<typeof meta>['args']>>;
};

const iconDecorators = [
  (Story: () => React.JSX.Element) => (
    <>
      <IconStoryStyles />
      <Story />
    </>
  ),
];

const iconOptions = [
  {
    value: 'sun',
    label: (
      <span className="demo-icon-chip">
        <SunIcon />
      </span>
    ),
    ariaLabel: 'Sunny',
  },
  {
    value: 'spark',
    label: (
      <span className="demo-icon-chip">
        <SystemIcon />
      </span>
    ),
    ariaLabel: 'Spark',
  },
  {
    value: 'moon',
    label: (
      <span className="demo-icon-chip">
        <MoonIcon />
      </span>
    ),
    ariaLabel: 'Moonlight',
  },
];

export const TextOnlyHorizontal: Story = {
  name: 'Text Only Horizontal',
  args: {
    ...segmentedChoiceStoryArgs,
    size: 'sm',
    ariaLabel: 'View mode',
    defaultValue: 'board',
    options: [
      { value: 'board', label: 'Board' },
      { value: 'list', label: 'List' },
      { value: 'timeline', label: 'Timeline' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'The plain horizontal control: text labels, default skin and no product-specific styling.',
      },
    },
  },
};

export const IconOnlyHorizontal: Story = {
  name: 'Icon Only Horizontal',
  args: {
    ...segmentedChoiceStoryArgs,
    size: 'sm',
    ariaLabel: 'Theme mood',
    defaultValue: 'sun',
    options: iconOptions,
  },
  decorators: iconDecorators,
  parameters: {
    docs: {
      description: {
        story: 'An icon-only control with readable option aria labels and small visual chips.',
      },
    },
  },
};

export const TextOnlyVertical: Story = {
  name: 'Text Only Vertical',
  tags: ['visual'],
  args: {
    ...segmentedChoiceStoryArgs,
    size: 'sm',
    ariaLabel: 'Density',
    defaultValue: 'compact',
    orientation: 'vertical',
    options: [
      { value: 'comfortable', label: 'Comfortable' },
      { value: 'compact', label: 'Compact' },
      { value: 'dense', label: 'Dense' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'The same text-only control arranged vertically, useful when a sidebar or tool rail needs real radio semantics.',
      },
    },
  },
};

export const IconOnlyVertical: Story = {
  name: 'Icon Only Vertical',
  args: {
    ...segmentedChoiceStoryArgs,
    size: 'sm',
    ariaLabel: 'Theme mood',
    defaultValue: 'sun',
    orientation: 'vertical',
    options: iconOptions,
  },
  decorators: iconDecorators,
  parameters: {
    docs: {
      description: {
        story:
          'The icon-only variant turned vertical, with the same accessible labels and a different axis.',
      },
    },
  },
};

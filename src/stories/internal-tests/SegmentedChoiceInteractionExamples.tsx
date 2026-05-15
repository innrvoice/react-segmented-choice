import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, fireEvent, waitFor, within } from 'storybook/test';

import { SegmentedChoice } from '../../index';
import image1 from '../assets/1.jpg';
import thumb1 from '../assets/1s.jpg';
import image2 from '../assets/2.jpg';
import thumb2 from '../assets/2s.jpg';
import image3 from '../assets/3.jpg';
import thumb3 from '../assets/3s.jpg';
import image4 from '../assets/4.jpg';
import thumb4 from '../assets/4s.jpg';
import image5 from '../assets/5.jpg';
import thumb5 from '../assets/5s.jpg';
import {
  segmentedChoiceStoryArgTypes,
  segmentedChoiceStoryArgs,
  segmentedChoiceOnValueChangeAction,
} from '../shared/SegmentedChoiceStoryControls';
import { StoryShell } from '../shared/StoryStyles';

export const internalTestsIconStoryStyles = `
  .demo-icon-chip {
    width: 2.5rem;
    height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.06);
  }

  .demo-icon-chip svg {
    display: block;
  }

  .demo-story-shell--reference .demo-icon-chip {
    width: 2.05rem;
    height: 2.05rem;
  }
`;

export function InternalTestsIconStyles() {
  return <style>{internalTestsIconStoryStyles}</style>;
}

export const internalTestsThumbnailStoryStyles = `
  .demo-thumbnail-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
  }

  .demo-thumbnail {
    width: 72px;
    height: 72px;
    object-fit: cover;
    display: block;
  }

  .demo-story-shell--reference .demo-thumbnail {
    width: 58px;
    height: 58px;
  }

  .demo-showcase-chooser {
    position: relative;
    z-index: 2;
    width: 350px;
    --rsc-bg: transparent;
    --rsc-border-color: transparent;
    --rsc-gap: 0;
    --rsc-padding: 0;
    --rsc-indicator-shadow: none;
  }

  .demo-showcase-chooser .rsc-list {
    width: 350px;
    justify-content: space-between;
    align-items: center;
    overflow: visible;
    background: transparent;
    box-shadow: none;
    padding: 0;
  }

  .demo-showcase-chooser .rsc-option {
    width: 63px;
    height: 63px;
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .demo-showcase-chooser .rsc-option-content {
    width: 60px;
    height: 60px;
    min-inline-size: 60px;
    min-block-size: 60px;
    padding: 0;
    background: transparent;
    border-radius: 999px;
  }

  .demo-showcase-chooser .rsc-indicator {
    box-sizing: border-box;
    border-radius: 999px;
    box-shadow: none;
    background: transparent;
    border: 6px solid var(--rsc-indicator-color);
    transition:
      transform 180ms cubic-bezier(0.24, 1, 0.32, 1),
      width 180ms cubic-bezier(0.24, 1, 0.32, 1),
      height 180ms cubic-bezier(0.24, 1, 0.32, 1),
      opacity 120ms ease,
      border-color 160ms ease;
  }

  .demo-showcase-chooser .rsc-indicator-content {
    display: none;
  }
`;

export function InternalTestsThumbnailStyles() {
  return <style>{internalTestsThumbnailStoryStyles}</style>;
}

export const internalTestsThumbnailSlides = [
  {
    value: 'aurora',
    title: 'Aurora Study',
    description: 'Luminous gradients and calm motion for long-focus sessions.',
    image: image1,
    thumbnail: thumb1,
    accentColor: '#ff2f9a',
  },
  {
    value: 'atelier',
    title: 'Atelier Desk',
    description: 'Warm highlights, tactile surfaces and a more editorial rhythm.',
    image: image2,
    thumbnail: thumb2,
    accentColor: '#ffb33f',
  },
  {
    value: 'shoreline',
    title: 'Shoreline Draft',
    description: 'Open space, soft contrast and plenty of visual breathing room.',
    image: image3,
    thumbnail: thumb3,
    accentColor: '#ff7ac8',
  },
  {
    value: 'studio',
    title: 'Studio Cut',
    description: 'Higher energy, tighter pacing and bolder contrast for reviews.',
    image: image4,
    thumbnail: thumb4,
    accentColor: '#19f6ff',
  },
  {
    value: 'nightshift',
    title: 'Nightshift Mix',
    description: 'Dark, saturated and cinematic without losing legibility.',
    image: image5,
    thumbnail: thumb5,
    accentColor: '#35ff9a',
  },
] as const;

export function ThumbnailLabel({ alt: _alt, src }: { alt: string; src: string }) {
  return (
    <span className="demo-thumbnail-label">
      <img alt="" className="demo-thumbnail" src={src} />
    </span>
  );
}

export function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#F7B43B"
    >
      <path d="M444-828v-48q0-15 10.5-25.5T480-912q15 0 25.5 10.5T516-876v48q0 15-10.5 25.5T480-792q-15 0-25.5-10.5T444-828Zm0 744v-48q0-15 10.5-25.5T480-168q15 0 25.5 10.5T516-132v48q0 15-10.5 25.5T480-48q-15 0-25.5-10.5T444-84Zm432-360h-48q-15 0-25.5-10.5T792-480q0-15 10.5-25.5T828-516h48q15 0 25.5 10.5T912-480q0 15-10.5 25.5T876-444Zm-744 0H84q-15 0-25.5-10.5T48-480q0-15 10.5-25.5T84-516h48q15 0 25.5 10.5T168-480q0 15-10.5 25.5T132-444Zm653-288-34 32q-11 11-25.5 10.5T700-701q-11-11-11-25t11-25l33-35q11-11 26.5-11t26.5 11q11 11 10.5 27T785-732ZM260-209l-32 34q-11 11-26.5 11T175-175q-11-11-10.5-27t11.5-27l33-31q11-11 25.5-10.5T260-259q11 11 11 25t-11 25Zm472 33-32-33q-11-11-10.5-25.5T701-260q11-11 25-11.5t25 10.5l35 33q11 11 11 26.5T786-175q-11 11-27 10.5T732-176ZM209-700l-34-33q-11-11-11.5-26t10.5-26q11-11 27.5-11.5T229-785l32 34q10 11 9.5 25.5T259-700q-11 11-25 11t-25-11Zm101 390q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Z" />
    </svg>
  );
}

export function SystemIcon() {
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

export function MoonIcon() {
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
  title: 'Internal Tests/SegmentedChoice Interactions',
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
} satisfies Meta<typeof SegmentedChoice>;

export default meta;

type LooseStory = Omit<StoryObj<typeof meta>, 'args'> & {
  args?: Partial<NonNullable<StoryObj<typeof meta>['args']>>;
};

type SegmentedChoiceProps = React.ComponentProps<typeof SegmentedChoice>;

type InteractionHarnessProps = Partial<SegmentedChoiceProps> & {
  className?: string;
  controlled?: boolean;
  defaultValue?: SegmentedChoiceProps['defaultValue'];
  optionSizing?: SegmentedChoiceProps['optionSizing'];
  draggable?: SegmentedChoiceProps['draggable'];
  options: SegmentedChoiceProps['options'];
  orientation?: SegmentedChoiceProps['orientation'];
  slotProps?: SegmentedChoiceProps['slotProps'];
  value?: SegmentedChoiceProps['value'];
  geometry?: SegmentedChoiceProps['geometry'];
  onValueChange?: SegmentedChoiceProps['onValueChange'];
};

function InteractionHarness({
  className,
  controlled = false,
  defaultValue,
  draggable = true,
  optionSizing,
  options,
  orientation = 'horizontal',
  slotProps,
  value,
  geometry,
  onValueChange = segmentedChoiceOnValueChangeAction,
  ...storyProps
}: InteractionHarnessProps) {
  const initialValue =
    value ?? defaultValue ?? options.find(option => !option.disabled)?.value ?? '';
  const [controlledValue, setControlledValue] = React.useState(initialValue);
  const [reportedValue, setReportedValue] = React.useState(initialValue);

  return (
    <div className="demo-choice-stack">
      <SegmentedChoice
        {...storyProps}
        ariaLabel="Interaction harness"
        className={className}
        defaultValue={controlled ? undefined : defaultValue}
        optionSizing={optionSizing}
        draggable={draggable}
        onValueChange={nextValue => {
          setReportedValue(nextValue as typeof reportedValue);
          if (controlled) {
            setControlledValue(nextValue as typeof controlledValue);
          }
          onValueChange?.(nextValue);
        }}
        options={options}
        orientation={orientation}
        slotProps={slotProps}
        value={controlled ? controlledValue : undefined}
        geometry={geometry}
      />
      <div className="demo-selection-readout" data-testid="selected-value">
        <code>{controlled ? controlledValue : reportedValue}</code>
      </div>
    </div>
  );
}

function renderInteractionHarness(
  args: StoryObj<typeof meta>['args'],
  props: Partial<InteractionHarnessProps> & Pick<InteractionHarnessProps, 'options'>
) {
  return <InteractionHarness {...props} {...args} />;
}

function getOptionElement(radio: HTMLElement, context: string) {
  const option = radio.closest<HTMLElement>('.rsc-option');

  if (!option) {
    throw new Error(`Missing option element for ${context}`);
  }

  return option;
}

async function dragToOption(canvasElement: HTMLElement, startLabel: string, endLabel: string) {
  const scope = within(canvasElement);
  const list = canvasElement.querySelector('.rsc-list') as HTMLDivElement;
  const start = scope.getByRole('radio', { name: startLabel });
  const end = scope.getByRole('radio', { name: endLabel });
  const startOption = getOptionElement(start, startLabel);
  const endOption = getOptionElement(end, endLabel);
  const startRect = startOption.getBoundingClientRect();
  const endRect = endOption.getBoundingClientRect();

  fireEvent.pointerDown(startOption, {
    bubbles: true,
    button: 0,
    clientX: startRect.left + startRect.width / 2,
    clientY: startRect.top + startRect.height / 2,
    pointerId: 19,
  });
  fireEvent.pointerMove(list, {
    bubbles: true,
    clientX: endRect.left + endRect.width / 2,
    clientY: endRect.top + endRect.height / 2,
    pointerId: 19,
  });
  fireEvent.pointerUp(list, {
    bubbles: true,
    clientX: endRect.left + endRect.width / 2,
    clientY: endRect.top + endRect.height / 2,
    pointerId: 19,
  });
}

async function dragToCoordinate(
  canvasElement: HTMLElement,
  startLabel: string,
  {
    clientX,
    clientY,
    intermediateClientX,
    intermediateClientY,
    pointerId = 29,
  }: {
    clientX: number;
    clientY: number;
    intermediateClientX?: number;
    intermediateClientY?: number;
    pointerId?: number;
  }
) {
  const scope = within(canvasElement);
  const list = canvasElement.querySelector('.rsc-list') as HTMLDivElement;
  const start = scope.getByRole('radio', { name: startLabel });
  const startOption = getOptionElement(start, startLabel);
  const startRect = startOption.getBoundingClientRect();

  fireEvent.pointerDown(startOption, {
    bubbles: true,
    button: 0,
    clientX: startRect.left + startRect.width / 2,
    clientY: startRect.top + startRect.height / 2,
    pointerId,
  });
  fireEvent.pointerMove(list, {
    bubbles: true,
    clientX: intermediateClientX ?? clientX,
    clientY: intermediateClientY ?? clientY,
    pointerId,
  });
  fireEvent.pointerMove(list, {
    bubbles: true,
    clientX,
    clientY,
    pointerId,
  });
  fireEvent.pointerUp(list, {
    bubbles: true,
    clientX,
    clientY,
    pointerId,
  });
}

const baseTextOptions: Array<{ value: string; label: string }> = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export const ClickToSelectHorizontal: LooseStory = {
  render: args => renderInteractionHarness(args, { defaultValue: 'day', options: baseTextOptions }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    fireEvent.click(canvas.getByRole('radio', { name: 'Week' }));

    await waitFor(() => {
      expect(canvas.getByTestId('selected-value')).toHaveTextContent('week');
    });
  },
};

export const NoPersistentFocusRingAfterPointerClick: LooseStory = {
  render: args => renderInteractionHarness(args, { defaultValue: 'day', options: baseTextOptions }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    fireEvent.click(canvas.getByRole('radio', { name: 'Week' }));

    await waitFor(() => {
      expect(canvas.getByTestId('selected-value')).toHaveTextContent('week');
    });

    const focusedOptions = Array.from(
      canvasElement.querySelectorAll('.rsc-option[data-focus-visible="true"]')
    );
    expect(focusedOptions).toHaveLength(0);
  },
};

export const ClickToSelectVertical: LooseStory = {
  args: {
    orientation: 'vertical',
  },
  render: args =>
    renderInteractionHarness(args, {
      defaultValue: 'comfortable',
      options: [
        { value: 'comfortable', label: 'Comfortable' },
        { value: 'compact', label: 'Compact' },
        { value: 'dense', label: 'Dense' },
      ],
    }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    fireEvent.click(canvas.getByRole('radio', { name: 'Dense' }));

    await waitFor(() => {
      expect(canvas.getByTestId('selected-value')).toHaveTextContent('dense');
    });
  },
};

export const ArrowKeySelectionHorizontal: LooseStory = {
  render: args => renderInteractionHarness(args, { defaultValue: 'day', options: baseTextOptions }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const day = canvas.getByRole('radio', { name: 'Day' });
    day.focus();
    fireEvent.keyDown(day, { key: 'ArrowRight' });

    await waitFor(() => {
      expect(canvas.getByTestId('selected-value')).toHaveTextContent('week');
    });
  },
};

export const ArrowKeySelectionVertical: LooseStory = {
  args: {
    orientation: 'vertical',
  },
  render: args =>
    renderInteractionHarness(args, {
      defaultValue: 'comfortable',
      options: [
        { value: 'comfortable', label: 'Comfortable' },
        { value: 'compact', label: 'Compact' },
        { value: 'dense', label: 'Dense' },
      ],
    }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const comfortable = canvas.getByRole('radio', { name: 'Comfortable' });
    comfortable.focus();
    fireEvent.keyDown(comfortable, { key: 'ArrowDown' });

    await waitFor(() => {
      expect(canvas.getByTestId('selected-value')).toHaveTextContent('compact');
    });
  },
};

export const DragCommitHorizontal: LooseStory = {
  render: args =>
    renderInteractionHarness(args, { defaultValue: 'day', options: baseTextOptions as never }),
  play: async ({ canvasElement }) => {
    await dragToOption(canvasElement, 'Day', 'Month');
    await waitFor(() => {
      expect(within(canvasElement).getByTestId('selected-value')).toHaveTextContent('month');
    });
  },
};

export const DragCommitVertical: LooseStory = {
  args: {
    orientation: 'vertical',
  },
  render: args =>
    renderInteractionHarness(args, {
      defaultValue: 'comfortable',
      options: [
        { value: 'comfortable', label: 'Comfortable' },
        { value: 'compact', label: 'Compact' },
        { value: 'dense', label: 'Dense' },
      ],
    }),
  play: async ({ canvasElement }) => {
    await dragToOption(canvasElement, 'Comfortable', 'Dense');
    await waitFor(() => {
      expect(within(canvasElement).getByTestId('selected-value')).toHaveTextContent('dense');
    });
  },
};

export const DisabledOptionRejection: LooseStory = {
  render: args =>
    renderInteractionHarness(args, {
      defaultValue: 'balanced',
      options: [
        { value: 'draft', label: 'Draft', disabled: true },
        { value: 'balanced', label: 'Balanced' },
        { value: 'pro', label: 'Pro', disabled: true },
      ],
    }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    fireEvent.click(canvas.getByRole('radio', { name: 'Draft' }));

    await waitFor(() => {
      expect(canvas.getByTestId('selected-value')).toHaveTextContent('balanced');
    });
  },
};

export const ControlledParentCorrectness: LooseStory = {
  args: {
    optionSizing: 'content',
  },
  render: args =>
    renderInteractionHarness(args, {
      controlled: true,
      defaultValue: 'standard',
      options: [
        { value: 'standard', label: 'Standard' },
        { value: 'express', label: 'Express' },
        { value: 'pickup', label: 'Store pickup' },
      ],
    }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    fireEvent.click(canvas.getByRole('radio', { name: 'Store pickup' }));

    await waitFor(() => {
      expect(canvas.getByTestId('selected-value')).toHaveTextContent('pickup');
    });
  },
};

export const IconOnlyA11yLabeling: LooseStory = {
  decorators: [
    Story => (
      <>
        <InternalTestsIconStyles />
        <Story />
      </>
    ),
  ],
  render: args =>
    renderInteractionHarness(args, {
      defaultValue: 'sun',
      options: [
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
      ],
    }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    fireEvent.click(canvas.getByRole('radio', { name: 'Spark' }));

    await waitFor(() => {
      expect(canvas.getByTestId('selected-value')).toHaveTextContent('spark');
    });
  },
};

export const ThumbnailSelection: LooseStory = {
  decorators: [
    Story => (
      <>
        <InternalTestsThumbnailStyles />
        <Story />
      </>
    ),
  ],
  args: {
    optionSizing: 'content',
  },
  render: args =>
    renderInteractionHarness(args, {
      className: 'demo-showcase-chooser',
      defaultValue: 'shoreline',
      options: internalTestsThumbnailSlides.map(slide => ({
        value: slide.value,
        label: <ThumbnailLabel alt={slide.title} src={slide.thumbnail} />,
        ariaLabel: slide.title,
        accentColor: slide.accentColor,
      })),
      geometry: {
        anchor: { size: 56 },
        dragScale: false,
        indicator: {
          borderWidth: 6,
          content: 'none',
          size: 59,
          style: 'ring',
        },
        mode: 'overlay',
        track: {
          style: 'none',
        },
      },
    }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    fireEvent.click(canvas.getByRole('radio', { name: 'Nightshift Mix' }));

    await waitFor(() => {
      expect(canvas.getByTestId('selected-value')).toHaveTextContent('nightshift');
    });
  },
};

export const MidpointDragResolvesForward: LooseStory = {
  render: args =>
    renderInteractionHarness(args, {
      defaultValue: 'one',
      options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
        { value: 'three', label: 'Three' },
      ],
    }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const one = canvas.getByRole('radio', { name: 'One' });
    const two = canvas.getByRole('radio', { name: 'Two' });
    const oneRect = getOptionElement(one, 'One').getBoundingClientRect();
    const twoRect = getOptionElement(two, 'Two').getBoundingClientRect();

    const midpointX = (oneRect.right + twoRect.left) / 2;
    const midpointY = oneRect.top + oneRect.height / 2;

    await dragToCoordinate(canvasElement, 'One', {
      clientX: midpointX,
      clientY: midpointY,
    });

    await waitFor(() => {
      expect(canvas.getByTestId('selected-value')).toHaveTextContent('two');
    });
  },
};

export const MidpointDragResolvesBackward: LooseStory = {
  render: args =>
    renderInteractionHarness(args, {
      defaultValue: 'two',
      options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
        { value: 'three', label: 'Three' },
      ],
    }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const one = canvas.getByRole('radio', { name: 'One' });
    const two = canvas.getByRole('radio', { name: 'Two' });
    const oneRect = getOptionElement(one, 'One').getBoundingClientRect();
    const twoRect = getOptionElement(two, 'Two').getBoundingClientRect();

    const midpointX = (oneRect.right + twoRect.left) / 2;
    const midpointY = twoRect.top + twoRect.height / 2;

    await dragToCoordinate(canvasElement, 'Two', {
      clientX: midpointX,
      clientY: midpointY,
    });

    await waitFor(() => {
      expect(canvas.getByTestId('selected-value')).toHaveTextContent('one');
    });
  },
};

export const MidpointDragWithoutDirectionKeepsCurrent: LooseStory = {
  render: args =>
    renderInteractionHarness(args, {
      defaultValue: 'two',
      options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
        { value: 'three', label: 'Three' },
      ],
    }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const one = canvas.getByRole('radio', { name: 'One' });
    const two = canvas.getByRole('radio', { name: 'Two' });
    const twoOption = getOptionElement(two, 'Two');
    const oneRect = getOptionElement(one, 'One').getBoundingClientRect();
    const twoRect = twoOption.getBoundingClientRect();

    const midpointX = (oneRect.right + twoRect.left) / 2;
    const midpointY = twoRect.top + twoRect.height / 2;

    fireEvent.pointerDown(twoOption, {
      bubbles: true,
      button: 0,
      clientX: midpointX,
      clientY: midpointY,
      pointerId: 31,
    });
    fireEvent.pointerUp(canvasElement.querySelector('.rsc-list') as Element, {
      bubbles: true,
      clientX: midpointX,
      clientY: midpointY,
      pointerId: 31,
    });

    await waitFor(() => {
      expect(canvas.getByTestId('selected-value')).toHaveTextContent('two');
    });
  },
};

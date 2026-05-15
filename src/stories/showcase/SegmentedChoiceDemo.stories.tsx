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
import { ModernThumbnail } from '../shared/ModernThumbnail';
import {
  segmentedChoiceStoryArgTypes,
  segmentedChoiceStoryArgs,
  segmentedChoiceOnValueChangeAction,
} from '../shared/SegmentedChoiceStoryControls';

const showcaseStoryStyles = `
  .demo-showcase {
    position: relative;
    width: min(100%, 1040px);
    aspect-ratio: 16 / 9;
    min-height: 420px;
    margin: 0 auto;
    background: #111;
    overflow: hidden;
  }

  .demo-showcase-slide {
    position: absolute;
    inset: 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    transition: opacity 1s;
  }

  .demo-showcase-controls {
    position: absolute;
    left: 50%;
    bottom: 53px;
    transform: translateX(-50%);
    width: 370px;
    min-height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
  }

  .demo-showcase-play {
    position: absolute;
    left: -60px;
    width: 50px;
    height: 50px;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 999px;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.1)),
      rgba(255, 255, 255, 0.2);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.54),
      inset 0 -10px 18px rgba(255, 255, 255, 0.12),
      inset 0 10px 18px rgba(10, 14, 24, 0.1),
      0 10px 24px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(9px) saturate(150%);
    -webkit-backdrop-filter: blur(9px) saturate(150%);
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(8, 10, 14, 0.88);
    cursor: pointer;
    transform-origin: center;
    transition:
      box-shadow 180ms ease,
      background-color 160ms ease;
    will-change: transform;
    z-index: 3;
  }

  .demo-showcase-play[data-bouncing="true"] {
    animation: demo-showcase-play-bounce 440ms cubic-bezier(0.2, 1.35, 0.34, 1) both;
  }

  .demo-showcase-play:active {
    transform: scale(0.8);
    transition: transform 80ms ease-out;
  }

  .demo-showcase-play svg {
    width: 48px;
    height: 48px;
  }

  @keyframes demo-showcase-play-bounce {
    0% {
      transform: scale(0.8);
    }

    48% {
      transform: scale(1.1);
    }

    70% {
      transform: scale(0.96);
    }

    86% {
      transform: scale(1.04);
    }

    100% {
      transform: scale(1);
    }
  }

  .demo-showcase-author {
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translateX(-50%);
    z-index: 2;
    padding: 4px;
    border-radius: 4px;
    background: rgba(17, 17, 17, 0.85);
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    max-width: calc(100% - 24px);
  }

  .demo-showcase-author a {
    color: #fff;
  }
`;

const segmentedChoiceDemoSlides = [
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

function ShowcaseStyles() {
  return <style>{showcaseStoryStyles}</style>;
}

const credits = [
  <>
    Photo by{' '}
    <a
      href="https://unsplash.com/@agk42?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
      rel="noreferrer"
      target="_blank"
    >
      Alex Knight
    </a>{' '}
    on{' '}
    <a
      href="https://unsplash.com/photos/5-GNa303REg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
      rel="noreferrer"
      target="_blank"
    >
      Unsplash
    </a>
  </>,
  <>
    Photo by{' '}
    <a
      href="https://unsplash.com/@miyatankun?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
      rel="noreferrer"
      target="_blank"
    >
      Takashi Miyazaki
    </a>{' '}
    on{' '}
    <a
      href="https://unsplash.com/photos/64ajtpEzlYc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
      rel="noreferrer"
      target="_blank"
    >
      Unsplash
    </a>
  </>,
  <>
    Photo by{' '}
    <a
      href="https://unsplash.com/@sorasagano?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
      rel="noreferrer"
      target="_blank"
    >
      Sora Sagano
    </a>{' '}
    on{' '}
    <a
      href="https://unsplash.com/photos/8sOZJ8JF0S8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
      rel="noreferrer"
      target="_blank"
    >
      Unsplash
    </a>
  </>,
  <>
    Photo by{' '}
    <a
      href="https://unsplash.com/@jezar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
      rel="noreferrer"
      target="_blank"
    >
      Jezael Melgoza
    </a>{' '}
    on{' '}
    <a
      href="https://unsplash.com/photos/To5wAJDt1IM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
      rel="noreferrer"
      target="_blank"
    >
      Unsplash
    </a>
  </>,
  <>
    Photo by{' '}
    <a
      href="https://unsplash.com/@agk42?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
      rel="noreferrer"
      target="_blank"
    >
      Alex Knight
    </a>{' '}
    on{' '}
    <a
      href="https://unsplash.com/photos/DpPutJwgyW8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
      rel="noreferrer"
      target="_blank"
    >
      Unsplash
    </a>
  </>,
] as const;

function PlayIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 6.5v11l9-5.5-9-5.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 6h4v12H7zM13 6h4v12h-4z" />
    </svg>
  );
}

const meta = {
  title: 'Showcase/SegmentedChoice Demo',
  component: SegmentedChoice,
  args: segmentedChoiceStoryArgs,
  argTypes: segmentedChoiceStoryArgTypes,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'A cinematic hero demo that cycles through image-backed scene presets with thumbnail navigation.',
      },
    },
  },
  decorators: [
    Story => (
      <>
        <ShowcaseStyles />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof SegmentedChoice>;

export default meta;

type LooseStory = Omit<StoryObj<typeof meta>, 'args'> & {
  args?: StoryObj<typeof meta>['args'];
};

type StoryProps = Partial<React.ComponentProps<typeof SegmentedChoice>>;

function DemoExperience({
  draggable,
  onValueChange = segmentedChoiceOnValueChangeAction,
  ...storyProps
}: StoryProps) {
  const [value, setValue] =
    React.useState<(typeof segmentedChoiceDemoSlides)[number]['value']>('aurora');
  const [autoplay, setAutoplay] = React.useState(false);
  const [playButtonBouncing, setPlayButtonBouncing] = React.useState(false);

  const activeIndex = segmentedChoiceDemoSlides.findIndex(slide => slide.value === value);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;
  const currentSlide = segmentedChoiceDemoSlides[safeIndex] ?? segmentedChoiceDemoSlides[0];

  React.useEffect(() => {
    if (!autoplay) {
      return;
    }

    const interval = window.setInterval(() => {
      setValue(current => {
        const index = segmentedChoiceDemoSlides.findIndex(slide => slide.value === current);
        const nextIndex = index >= 0 ? (index + 1) % segmentedChoiceDemoSlides.length : 0;
        return segmentedChoiceDemoSlides[nextIndex]?.value ?? segmentedChoiceDemoSlides[0].value;
      });
    }, 2200);

    return () => {
      window.clearInterval(interval);
    };
  }, [autoplay]);

  return (
    <div className="demo-showcase">
      {segmentedChoiceDemoSlides.map(slide => (
        <div
          key={slide.value}
          className="demo-showcase-slide"
          style={{
            backgroundImage: `url(${slide.image})`,
            opacity: slide.value === currentSlide.value ? 1 : 0,
          }}
        />
      ))}

      <div className="demo-showcase-veil" />

      <div className="demo-showcase-controls">
        <button
          aria-label={autoplay ? 'Pause scene playback' : 'Play scene playback'}
          className="demo-showcase-play"
          data-bouncing={playButtonBouncing ? 'true' : 'false'}
          onAnimationEnd={event => {
            if (event.animationName === 'demo-showcase-play-bounce') {
              setPlayButtonBouncing(false);
            }
          }}
          onClick={() => {
            setPlayButtonBouncing(false);
            window.requestAnimationFrame(() => {
              setPlayButtonBouncing(true);
            });
            setAutoplay(current => !current);
          }}
          type="button"
        >
          {autoplay ? <PauseIcon /> : <PlayIcon />}
        </button>

        <ModernThumbnail
          {...storyProps}
          ariaLabel="Workspace scene"
          draggable={draggable ?? true}
          optionSizing={storyProps.optionSizing ?? 'content'}
          slides={segmentedChoiceDemoSlides}
          slotProps={{
            ...storyProps.slotProps,
            list: {
              ...storyProps.slotProps?.list,
              onPointerDown: event => {
                setAutoplay(false);
                storyProps.slotProps?.list?.onPointerDown?.(event);
              },
            },
          }}
          onValueChange={nextValue => {
            setAutoplay(false);
            setValue(nextValue as typeof value);
            onValueChange?.(nextValue);
          }}
          value={value}
        />
      </div>

      <div className="demo-showcase-author">{credits[safeIndex]}</div>
    </div>
  );
}

export const Demo: LooseStory = {
  name: 'SegmentedChoice Demo',
  tags: ['visual'],
  render: args => <DemoExperience {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    fireEvent.click(canvas.getByRole('radio', { name: 'Shoreline Draft' }));

    await waitFor(() => {
      expect(canvas.getByRole('radio', { name: 'Shoreline Draft' })).toBeChecked();
    });
  },
};

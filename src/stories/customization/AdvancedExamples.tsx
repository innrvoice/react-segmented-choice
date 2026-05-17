import React from 'react';

import { SegmentedChoice, SEGMENTED_CHOICE_FONT_FAMILY } from '../../index';
import { segmentedChoiceOnValueChangeAction } from '../shared/SegmentedChoiceStoryControls';

type StoryProps = Partial<React.ComponentProps<typeof SegmentedChoice>>;
type LooseStory = {
  args?: StoryProps;
  render: (args: StoryProps) => React.JSX.Element;
};

function useStoryValue(initialValue: string, onValueChange = segmentedChoiceOnValueChangeAction) {
  const [value, setValue] = React.useState(initialValue);

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      setValue(nextValue);
      onValueChange?.(nextValue);
    },
    [onValueChange]
  );

  return [value, handleValueChange] as const;
}

function AntdDashboardIcon() {
  return (
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M924.8 385.6a446.7 446.7 0 00-96-142.4 446.7 446.7 0 00-142.4-96C631.1 123.8 572.5 112 512 112s-119.1 11.8-174.4 35.2a446.7 446.7 0 00-142.4 96 446.7 446.7 0 00-96 142.4C75.8 440.9 64 499.5 64 560c0 132.7 58.3 257.7 159.9 343.1l1.7 1.4c5.8 4.8 13.1 7.5 20.6 7.5h531.7c7.5 0 14.8-2.7 20.6-7.5l1.7-1.4C901.7 817.7 960 692.7 960 560c0-60.5-11.9-119.1-35.2-174.4zM761.4 836H262.6A371.12 371.12 0 01140 560c0-99.4 38.7-192.8 109-263 70.3-70.3 163.7-109 263-109 99.4 0 192.8 38.7 263 109 70.3 70.3 109 163.7 109 263 0 105.6-44.5 205.5-122.6 276zM623.5 421.5a8.03 8.03 0 00-11.3 0L527.7 506c-18.7-5-39.4-.2-54.1 14.5a55.95 55.95 0 000 79.2 55.95 55.95 0 0079.2 0 55.87 55.87 0 0014.5-54.1l84.5-84.5c3.1-3.1 3.1-8.2 0-11.3l-28.3-28.3zM490 320h44c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8h-44c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8zm260 218v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8zm12.7-197.2l-31.1-31.1a8.03 8.03 0 00-11.3 0l-56.6 56.6a8.03 8.03 0 000 11.3l31.1 31.1c3.1 3.1 8.2 3.1 11.3 0l56.6-56.6c3.1-3.1 3.1-8.2 0-11.3zm-458.6-31.1a8.03 8.03 0 00-11.3 0l-31.1 31.1a8.03 8.03 0 000 11.3l56.6 56.6c3.1 3.1 8.2 3.1 11.3 0l31.1-31.1c3.1-3.1 3.1-8.2 0-11.3l-56.6-56.6zM262 530h-80c-4.4 0-8 3.6-8 8v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8z"></path>
    </svg>
  );
}

function AntdChartIcon() {
  return (
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-600-80h56c4.4 0 8-3.6 8-8V560c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v144c0 4.4 3.6 8 8 8zm152 0h56c4.4 0 8-3.6 8-8V384c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v320c0 4.4 3.6 8 8 8zm152 0h56c4.4 0 8-3.6 8-8V462c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v242c0 4.4 3.6 8 8 8zm152 0h56c4.4 0 8-3.6 8-8V304c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v400c0 4.4 3.6 8 8 8z"></path>
    </svg>
  );
}

function AntdWalletIcon() {
  return (
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 464H528V448h312v128zm0 264H184V184h656v200H496c-17.7 0-32 14.3-32 32v192c0 17.7 14.3 32 32 32h344v200zM580 512a40 40 0 1080 0 40 40 0 10-80 0z"></path>
    </svg>
  );
}

function AntdTeamIcon() {
  return (
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M824.2 699.9a301.55 301.55 0 00-86.4-60.4C783.1 602.8 812 546.8 812 484c0-110.8-92.4-201.7-203.2-200-109.1 1.7-197 90.6-197 200 0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 00-86.4 60.4C345 754.6 314 826.8 312 903.8a8 8 0 008 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5A226.62 226.62 0 01612 684c60.9 0 118.2 23.7 161.3 66.8C814.5 792 838 846.3 840 904.3c.1 4.3 3.7 7.7 8 7.7h56a8 8 0 008-8.2c-2-77-33-149.2-87.8-203.9zM612 612c-34.2 0-66.4-13.3-90.5-37.5a126.86 126.86 0 01-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4 0 34.2-13.3 66.3-37.5 90.5A127.3 127.3 0 01612 612zM361.5 510.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 01-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.9-1.7-203.3 89.2-203.3 199.9 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 008 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.9-1 6.5-4.7 6-8.7z"></path>
    </svg>
  );
}

function AntdFilterLabel({
  icon,
  subtitle,
  title,
}: {
  icon: React.ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <span className="ant-filter-label">
      {icon}
      <span className="ant-filter-label__body">
        <span className="ant-filter-label__title">{title}</span>
        <span className="ant-filter-label__subtitle">{subtitle}</span>
      </span>
    </span>
  );
}

function AntdFilterBarStyles() {
  return (
    <style>{`
      .ant-filter-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background: #ffffff;
        color: #1f1f1f;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .ant-filter {
        --rsc-surface: #e6f4ff;
        --rsc-border-color: #bae0ff;
        --rsc-text-color: rgba(0, 0, 0, 0.65);
        --rsc-active-text-color: #1677ff;
        --rsc-indicator-bg: #ffffff;
        --rsc-indicator-hover-bg: #ffffff;
        --rsc-indicator-shadow:
          0 8px 24px rgba(22, 119, 255, 0.12),
          0 2px 8px rgba(22, 119, 255, 0.08);
        --rsc-focus-ring-color: rgba(22, 119, 255, 0.16);
        --rsc-border-radius: 22px;
        --rsc-option-radius: 16px;
        --rsc-padding: 6px;
        --rsc-option-padding-inline: 18px;
        --rsc-option-padding-block: 12px;
      }

      .ant-filter.rsc-root .rsc-track {
        background: #e6f4ff;
        box-shadow: inset 0 0 0 1px #bae0ff;
      }

      .ant-filter-label {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        box-sizing: border-box;
      }

      .ant-filter-label__body {
        display: grid;
        gap: 3px;
        min-width: 0;
      }

      .ant-filter-label__title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: rgba(0, 0, 0, 0.65);
        font-weight: 700;
      }

      .ant-filter-label__subtitle {
        color: rgba(0, 0, 0, 0.45);
        font-size: 0.76em;
      }

      .ant-filter .rsc-option[data-selected="true"] .ant-filter-label__title {
        color: #1677ff;
      }

      .ant-filter .rsc-option[data-selected="true"] .ant-filter-label__subtitle {
        color: #4096ff;
      }

      .ant-filter-icon {
        width: 1.35rem;
        height: 1.35rem;
        display: block;
      }
    `}</style>
  );
}

export const AntdFilterBar: LooseStory = {
  args: { optionSizing: 'content' },
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('overview', args.onValueChange);

    return (
      <div className="ant-filter-page">
        <AntdFilterBarStyles />
        <SegmentedChoice
          {...args}
          ariaLabel="Workspace section"
          className="ant-filter"
          optionSizing={args.optionSizing ?? 'content'}
          onValueChange={onValueChange}
          options={[
            {
              value: 'overview',
              label: (
                <AntdFilterLabel
                  icon={<AntdDashboardIcon />}
                  subtitle="Overview hub"
                  title="Overview"
                />
              ),
            },
            {
              value: 'analytics',
              label: (
                <AntdFilterLabel
                  icon={<AntdChartIcon />}
                  subtitle="Live metrics"
                  title="Analytics"
                />
              ),
            },
            {
              value: 'billing',
              label: (
                <AntdFilterLabel
                  icon={<AntdWalletIcon />}
                  subtitle="Invoices & usage"
                  title="Billing"
                />
              ),
            },
            {
              value: 'team',
              label: (
                <AntdFilterLabel icon={<AntdTeamIcon />} subtitle="Members & roles" title="Team" />
              ),
            },
          ]}
          value={value}
        />
      </div>
    );
  },
};

function SpotifyMoodLabel({
  subtitle,
  title,
  tone,
}: {
  subtitle: string;
  title: string;
  tone: string;
}) {
  return (
    <span className={`spotify-mood-label spotify-mood-label--${tone}`}>
      <span className="spotify-mood-label__title">{title}</span>
      <span className="spotify-mood-label__subtitle">{subtitle}</span>
    </span>
  );
}

function SpotifyMoodMixerStyles() {
  return (
    <style>{`
      .spotify-mixer-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background:
          radial-gradient(circle at 26% 18%, rgba(109, 124, 255, 0.12), transparent 30%),
          radial-gradient(circle at 76% 20%, rgba(30, 215, 96, 0.08), transparent 31%),
          radial-gradient(circle at 62% 82%, rgba(255, 111, 216, 0.07), transparent 34%),
          linear-gradient(180deg, #070911 0%, #05060b 58%, #030408 100%);
        color: #f2f4f8;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .spotify-mixer {
        --rsc-surface: rgba(255, 255, 255, 0.075);
        --rsc-border-color: rgba(255, 255, 255, 0.1);
        --rsc-text-color: rgba(245, 247, 255, 0.68);
        --rsc-active-text-color: #ffffff;
        --spotify-mixer-accent: #1ed760;
        --rsc-indicator-color: var(--spotify-mixer-accent);
        --rsc-indicator-bg: color-mix(
          in srgb,
          var(--rsc-indicator-color) 24%,
          rgba(255, 255, 255, 0.11)
        );
        --rsc-indicator-hover-bg: color-mix(
          in srgb,
          var(--rsc-indicator-color) 32%,
          rgba(255, 255, 255, 0.14)
        );
        --rsc-indicator-shadow:
          0 18px 38px rgba(0, 0, 0, 0.38),
          0 0 38px color-mix(in srgb, var(--rsc-indicator-color) 44%, transparent),
          0 0 14px color-mix(in srgb, var(--rsc-indicator-color) 28%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -16px 24px rgba(0, 0, 0, 0.16);
        --rsc-border-radius: 999px;
        --rsc-option-radius: 999px;
        --rsc-option-padding-inline: 22px;
        --rsc-option-padding-block: 16px;
        --rsc-padding: 12px;
      }

      .spotify-mixer:has(.rsc-option[data-selected="true"] .spotify-mood-label--deep),
      .spotify-mixer:has(.rsc-option[data-previewed="true"] .spotify-mood-label--deep) {
        --spotify-mixer-accent: #6d7cff;
      }

      .spotify-mixer:has(.rsc-option[data-selected="true"] .spotify-mood-label--discover),
      .spotify-mixer:has(.rsc-option[data-previewed="true"] .spotify-mood-label--discover) {
        --spotify-mixer-accent: #1ed760;
      }

      .spotify-mixer:has(.rsc-option[data-selected="true"] .spotify-mood-label--party),
      .spotify-mixer:has(.rsc-option[data-previewed="true"] .spotify-mood-label--party) {
        --spotify-mixer-accent: #ff6fd8;
      }

      .spotify-mixer:has(.rsc-option[data-selected="true"] .spotify-mood-label--sunrise),
      .spotify-mixer:has(.rsc-option[data-previewed="true"] .spotify-mood-label--sunrise) {
        --spotify-mixer-accent: #ffb649;
      }

      .spotify-mixer.rsc-root .rsc-track {
        background:
          radial-gradient(circle at 12% 0%, rgba(255, 255, 255, 0.16), transparent 34%),
          radial-gradient(circle at 88% 100%, rgba(30, 215, 96, 0.045), transparent 42%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.035)),
          var(--rsc-surface);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.13),
          inset 0 -1px 0 rgba(255, 255, 255, 0.04),
          0 24px 60px rgba(0, 0, 0, 0.24);
        backdrop-filter: blur(18px) saturate(150%);
        -webkit-backdrop-filter: blur(18px) saturate(150%);
      }

      .spotify-mixer.rsc-root .rsc-indicator {
        background:
          radial-gradient(
            circle at 24% 14%,
            color-mix(in srgb, var(--rsc-indicator-color) 64%, transparent),
            transparent 46%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--rsc-indicator-color) 36%, rgba(255, 255, 255, 0.11)),
            rgba(255, 255, 255, 0.08) 58%,
            color-mix(in srgb, var(--rsc-indicator-color) 22%, rgba(255, 255, 255, 0.05))
          ),
          radial-gradient(circle at 86% 100%, rgba(255, 255, 255, 0.14), transparent 46%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.055)),
          var(--rsc-indicator-bg);
        border: 1px solid color-mix(
          in srgb,
          var(--rsc-indicator-color) 34%,
          rgba(255, 255, 255, 0.2)
        );
        box-shadow: var(--rsc-indicator-shadow);
        backdrop-filter: blur(16px) saturate(165%);
        -webkit-backdrop-filter: blur(16px) saturate(165%);
      }

      .spotify-mixer .rsc-option-label {
        text-align: left;
      }

      .spotify-mood-label {
        display: grid;
        gap: 4px;
        min-width: 0;
        box-sizing: border-box;
      }

      .spotify-mood-label__title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        transition: color 180ms ease;
      }

      .spotify-mood-label__subtitle {
        font-size: 0.76em;
        color: rgba(255, 255, 255, 0.5);
        transition: color 180ms ease;
      }

      .spotify-mixer .rsc-option[data-selected='true'] .spotify-mood-label__title {
        color: color-mix(in srgb, var(--rsc-indicator-color) 12%, #ffffff);
        text-shadow: 0 1px 8px rgba(0, 0, 0, 0.34);
      }

      .spotify-mixer .rsc-option[data-selected='true'] .spotify-mood-label__subtitle {
        color: color-mix(
          in srgb,
          var(--rsc-indicator-color) 8%,
          rgba(255, 255, 255, 0.78)
        );
        text-shadow: 0 1px 7px rgba(0, 0, 0, 0.3);
      }
    `}</style>
  );
}

export const SpotifyMoodMixer: LooseStory = {
  args: { optionSizing: 'content' },
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('discover', args.onValueChange);

    return (
      <div className="spotify-mixer-page">
        <SpotifyMoodMixerStyles />
        <SegmentedChoice
          {...args}
          ariaLabel="Playlist mood"
          className="spotify-mixer"
          optionSizing={args.optionSizing ?? 'content'}
          geometry={{
            dragScale: false,
            indicator: { style: 'fill' },
            mode: 'underlay',
            track: { style: 'surface' },
          }}
          onValueChange={onValueChange}
          options={[
            {
              value: 'deep',
              label: (
                <SpotifyMoodLabel subtitle="Late night textures" title="Deep Focus" tone="deep" />
              ),
              accentColor: '#6d7cff',
            },
            {
              value: 'discover',
              label: (
                <SpotifyMoodLabel subtitle="Fresh this week" title="Discover" tone="discover" />
              ),
              accentColor: '#1ed760',
            },
            {
              value: 'party',
              label: <SpotifyMoodLabel subtitle="Fast and bright" title="Party" tone="party" />,
              accentColor: '#ff6fd8',
            },
            {
              value: 'sunrise',
              label: (
                <SpotifyMoodLabel subtitle="Warm and acoustic" title="Sunrise" tone="sunrise" />
              ),
              accentColor: '#ffb649',
            },
          ]}
          value={value}
        />
      </div>
    );
  },
};

function GlassDockLabel({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <span className="glass-dock-label">
      <span className="glass-dock-label__title">{title}</span>
      <span className="glass-dock-label__subtitle">{subtitle}</span>
    </span>
  );
}

function GlassDockStyles() {
  return (
    <style>{`
      .glass-dock-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background: #07090f;
        color: #f2f4f8;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .glass-dock {
        --rsc-surface: rgba(255, 255, 255, 0.08);
        --rsc-border-color: rgba(255, 255, 255, 0.12);
        --rsc-text-color: rgba(235, 243, 255, 0.74);
        --rsc-active-text-color: #f7fbff;
        --rsc-indicator-color: rgba(255, 255, 255, 0.2);
        --rsc-indicator-hover-bg: rgba(255, 255, 255, 0.28);
        --rsc-indicator-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.5),
          inset 0 -12px 18px rgba(255, 255, 255, 0.08),
          inset 0 12px 22px rgba(6, 11, 22, 0.2),
          0 18px 42px rgba(0, 0, 0, 0.34);
        --glass-dock-indicator-blur: 18px;
        --rsc-border-radius: 999px;
        --rsc-option-radius: 999px;
        --rsc-padding: 8px;
        --rsc-option-padding-inline: 20px;
        --rsc-option-padding-block: 14px;
      }

      .glass-dock.rsc-root .rsc-indicator {
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.24);
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.08)),
          var(--rsc-indicator-color);
        backdrop-filter: blur(var(--glass-dock-indicator-blur)) saturate(160%);
        -webkit-backdrop-filter: blur(var(--glass-dock-indicator-blur)) saturate(160%);
        transition:
          transform 180ms cubic-bezier(0.24, 1, 0.32, 1),
          width 180ms cubic-bezier(0.24, 1, 0.32, 1),
          height 180ms cubic-bezier(0.24, 1, 0.32, 1),
          border-color 180ms ease,
          opacity 120ms ease;
      }

      .glass-dock.rsc-root .rsc-list {
        cursor: default;
        pointer-events: none;
      }

      .glass-dock.rsc-root .rsc-option,
      .glass-dock.rsc-root .rsc-option-content,
      .glass-dock.rsc-root .rsc-indicator {
        clip-path: circle(50% at 50% 50%);
      }

      .glass-dock.rsc-root .rsc-option,
      .glass-dock.rsc-root .rsc-indicator {
        pointer-events: auto;
      }

      .glass-dock.rsc-root .rsc-indicator::after {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        content: "";
        pointer-events: none;
        transition: opacity 180ms ease;
      }

      .glass-dock.rsc-root .rsc-indicator::after {
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04)),
          rgba(255, 255, 255, 0.08);
        opacity: 0;
      }

      .glass-dock.rsc-root[data-dragging="true"] {
        --glass-dock-indicator-blur: 2px;
      }

      .glass-dock.rsc-root .rsc-indicator.rsc-indicator:hover {
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.08)),
          var(--rsc-indicator-color);
      }

      .glass-dock.rsc-root .rsc-indicator:hover::after {
        opacity: 1;
      }

      .glass-dock-label {
        display: grid;
        gap: 3px;
        min-width: 0;
        justify-items: center;
        line-height: 1.2;
        box-sizing: border-box;
      }

      .glass-dock-label__title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
      }

      .glass-dock-label__subtitle {
        font-size: 0.76em;
        opacity: 0.7;
      }
    `}</style>
  );
}

export const GlassDock: LooseStory = {
  args: { optionSizing: 'content' },
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('music', args.onValueChange);

    return (
      <div className="glass-dock-page">
        <GlassDockStyles />
        <SegmentedChoice
          {...args}
          ariaLabel="Dock app"
          className="glass-dock"
          optionSizing={args.optionSizing ?? 'content'}
          geometry={{
            dragScale: 1.3,
            indicator: { content: 'clone-active', style: 'fill' },
            mode: 'overlay',
            optionSize: 88,
            track: { style: 'surface' },
          }}
          onValueChange={onValueChange}
          options={[
            {
              value: 'focus',
              label: <GlassDockLabel subtitle="Breathe" title="Focus" />,
              ariaLabel: 'Focus',
            },
            {
              value: 'music',
              label: <GlassDockLabel subtitle="Spatial mix" title="Music" />,
              ariaLabel: 'Music',
            },
            {
              value: 'camera',
              label: <GlassDockLabel subtitle="Portraits" title="Camera" />,
              ariaLabel: 'Camera',
            },
            {
              value: 'maps',
              label: <GlassDockLabel subtitle="Live route" title="Maps" />,
              ariaLabel: 'Maps',
            },
          ]}
          value={value}
        />
      </div>
    );
  },
};

function ArcadeDifficultyLabel({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <span className="arcade-difficulty-label">
      <span className="arcade-difficulty-label__title">{title}</span>
      <span className="arcade-difficulty-label__subtitle">{subtitle}</span>
    </span>
  );
}

function ArcadeDifficultyStyles() {
  return (
    <style>{`
      .arcade-difficulty-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background:
          linear-gradient(rgba(9, 245, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 88, 229, 0.05) 1px, transparent 1px),
          repeating-linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.035) 0,
            rgba(255, 255, 255, 0.035) 1px,
            transparent 1px,
            transparent 5px
          ),
          radial-gradient(circle at 50% 0%, rgba(142, 86, 255, 0.28), transparent 38%),
          #060814;
        background-size:
          42px 42px,
          42px 42px,
          auto,
          auto,
          auto;
        color: #f2f4f8;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
        overflow-x: auto;
      }

      .arcade-difficulty {
        display: inline-block;
        width: max-content;
        max-width: calc(100vw - 48px);
        --rsc-surface: rgba(9, 12, 32, 0.92);
        --rsc-border-color: rgba(18, 247, 255, 0.36);
        --rsc-text-color: rgba(231, 243, 255, 0.9);
        --rsc-active-text-color: #0a0118;
        --rsc-gap: 42px;
        --rsc-indicator-bg: #12f7ff;
        --rsc-indicator-hover-bg: #4ffbff;
        --rsc-indicator-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.45) inset,
          0 0 28px rgba(18, 247, 255, 0.58),
          0 0 48px rgba(255, 94, 229, 0.24);
        --rsc-border-radius: 4px;
        --rsc-option-radius: 3px;
        --rsc-option-padding-inline: 34px;
        --rsc-option-padding-block: 12px;
        --rsc-padding: 10px 34px 10px 20px;
        --rsc-font-family: "Arial Black", Impact, ${SEGMENTED_CHOICE_FONT_FAMILY};
        --rsc-font-weight: 900;
        --rsc-label-gap: 4px;
        filter: drop-shadow(0 18px 36px rgba(0, 0, 0, 0.38));
      }

      .arcade-difficulty .rsc-list {
        transform: skewX(-14deg);
        transform-origin: center;
      }

      .arcade-difficulty .rsc-track {
        background:
          linear-gradient(90deg, rgba(18, 247, 255, 0.14), rgba(255, 94, 229, 0.16)),
          rgba(9, 12, 32, 0.92);
        box-shadow:
          inset 0 0 0 2px rgba(18, 247, 255, 0.24),
          inset 0 -12px 18px rgba(0, 0, 0, 0.24);
      }

      .arcade-difficulty .rsc-indicator {
        border: 1px solid rgba(255, 255, 255, 0.48);
      }

      .arcade-difficulty .rsc-option-content {
        overflow: visible;
      }

      .arcade-difficulty .rsc-option-label {
        inline-size: calc(100% + (2 * var(--rsc-option-padding-inline)));
        max-inline-size: none;
        margin-inline: calc(-1 * var(--rsc-option-padding-inline));
        overflow: visible;
      }

      .arcade-difficulty-label {
        display: grid;
        gap: 2px;
        min-width: 0;
        justify-items: center;
        line-height: 1.2;
        box-sizing: border-box;
        padding-inline: 3px;
        text-transform: uppercase;
        transform: translateX(9px);
      }

      .arcade-difficulty-label__title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #f8fbff;
        font-weight: 900;
        text-shadow:
          2px 2px 0 rgba(255, 94, 229, 0.72),
          -1px -1px 0 rgba(18, 247, 255, 0.64),
          0 0 14px rgba(255, 255, 255, 0.18);
      }

      .arcade-difficulty-label__subtitle {
        color: rgba(178, 244, 255, 0.82);
        font-size: 0.72em;
        font-weight: 800;
        opacity: 0.86;
      }
    `}</style>
  );
}

export const ArcadeDifficulty: LooseStory = {
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('vortex', args.onValueChange);

    return (
      <div className="arcade-difficulty-page">
        <ArcadeDifficultyStyles />
        <SegmentedChoice
          {...args}
          ariaLabel="Arcade difficulty"
          className="arcade-difficulty"
          optionSizing="content"
          geometry={{
            dragScale: 1.08,
            indicator: { content: 'none', style: 'fill' },
            mode: 'underlay',
            track: { style: 'surface' },
          }}
          onValueChange={onValueChange}
          options={[
            {
              value: 'pixel',
              label: <ArcadeDifficultyLabel subtitle="Warm-up" title="Pixel" />,
              ariaLabel: 'Pixel, Warm-up',
              accentColor: '#12f7ff',
            },
            {
              value: 'combo',
              label: <ArcadeDifficultyLabel subtitle="Fast loops" title="Combo" />,
              ariaLabel: 'Combo, Fast loops',
              accentColor: '#8a6cff',
            },
            {
              value: 'vortex',
              label: <ArcadeDifficultyLabel subtitle="No mercy" title="Vortex" />,
              ariaLabel: 'Vortex, No mercy',
              accentColor: '#ff5ee5',
            },
            {
              value: 'nightmare',
              label: <ArcadeDifficultyLabel subtitle="Elite run" title="Nightmare" />,
              ariaLabel: 'Nightmare, Elite run',
              accentColor: '#ff9b5e',
            },
          ]}
          value={value}
        />
      </div>
    );
  },
};

function CommandScopeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  );
}

function CommandCodeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </svg>
  );
}

function CommandDocsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function CommandIssuesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" />
      <line x1="6" x2="6" y1="9" y2="21" />
    </svg>
  );
}

function CommandScopeLabel({
  icon,
  subtitle,
  title,
}: {
  icon: React.ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <span className="command-scope-label">
      <span className="command-scope-label__title">
        {icon}
        {title}
      </span>
      <span className="command-scope-label__subtitle">{subtitle}</span>
    </span>
  );
}

function CommandScopePickerStyles() {
  return (
    <style>{`
      .command-scope-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background: #ffffff;
        color: #111827;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .command-picker {
        --rsc-surface: rgba(16, 24, 40, 0.06);
        --rsc-border-color: rgba(16, 24, 40, 0.06);
        --rsc-text-color: #536179;
        --rsc-active-text-color: #111827;
        --rsc-indicator-bg: #ffffff;
        --rsc-indicator-hover-bg: #ffffff;
        --rsc-indicator-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
        --rsc-border-radius: 24px;
        --rsc-option-radius: 18px;
        --rsc-padding: 8px;
        --rsc-option-padding-inline: 16px;
        --rsc-option-padding-block: 14px;
      }

      .command-picker .rsc-option-label,
      .command-picker .rsc-option-description {
        text-align: left;
      }

      .command-scope-label {
        display: grid;
        gap: 3px;
        min-width: 0;
        justify-items: start;
        text-align: left;
        line-height: 1.2;
        box-sizing: border-box;
      }

      .command-scope-label__title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
      }

      .command-scope-label__subtitle {
        font-size: 0.76em;
        opacity: 0.7;
      }

      .command-scope-kbd {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 1.7rem;
        height: 1.45rem;
        padding: 0 0.42rem;
        border-radius: 0.5rem;
        background: rgba(15, 23, 42, 0.08);
        color: color-mix(in srgb, currentColor 84%, transparent);
        font-size: 0.72rem;
        font-weight: 700;
      }

      .command-scope-icon {
        width: 1.35rem;
        height: 1.35rem;
        display: block;
      }
    `}</style>
  );
}

export const CommandScopePicker: LooseStory = {
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('all', args.onValueChange);

    return (
      <div className="command-scope-page">
        <CommandScopePickerStyles />
        <SegmentedChoice
          {...args}
          ariaLabel="Command scope"
          className="command-picker"
          optionSizing={args.optionSizing ?? 'content'}
          onValueChange={onValueChange}
          options={[
            {
              value: 'all',
              label: (
                <CommandScopeLabel
                  icon={<CommandScopeIcon />}
                  subtitle="Everything, ranked"
                  title="All"
                />
              ),
              description: 'Search files, docs, issues',
            },
            {
              value: 'code',
              label: (
                <CommandScopeLabel
                  icon={<CommandCodeIcon />}
                  subtitle="Symbols and files"
                  title="Code"
                />
              ),
              description: 'Functions, routes, exports',
            },
            {
              value: 'docs',
              label: (
                <CommandScopeLabel
                  icon={<CommandDocsIcon />}
                  subtitle="Specs and notes"
                  title="Docs"
                />
              ),
              description: 'Readmes, ADRs, copy',
            },
            {
              value: 'team',
              label: (
                <CommandScopeLabel
                  icon={<CommandIssuesIcon />}
                  subtitle="PRs and people"
                  title="Issues"
                />
              ),
              description: 'Tasks, threads, reviewers',
            },
          ]}
          value={value}
        />
      </div>
    );
  },
};
function FigmaMouseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
    </svg>
  );
}

function FigmaPenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
      <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
      <path d="m2.3 2.3 7.286 7.286" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}

function FigmaTypeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4v16" />
      <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" />
      <path d="M9 20h6" />
    </svg>
  );
}

function FigmaFrameIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" x2="2" y1="6" y2="6" />
      <line x1="22" x2="2" y1="18" y2="18" />
      <line x1="6" x2="6" y1="2" y2="22" />
      <line x1="18" x2="18" y1="2" y2="22" />
    </svg>
  );
}

function FigmaToolRailStyles() {
  return (
    <style>{`
      .figma-rail-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background: #07090f;
        color: #f2f4f8;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .figma-rail {
        --rsc-surface: rgba(255, 255, 255, 0.08);
        --rsc-border-color: rgba(255, 255, 255, 0.06);
        --rsc-text-color: rgba(236, 240, 245, 0.64);
        --rsc-active-text-color: #ffffff;
        --rsc-indicator-color: #ffffff;
        --rsc-indicator-border-width: 3px;
        --rsc-border-radius: 26px;
        --rsc-option-radius: 20px;
        --rsc-padding: 8px;
      }

      .figma-rail .rsc-option-content {
        min-inline-size: 54px;
        min-block-size: 54px;
      }

      .figma-tool {
        width: 54px;
        height: 54px;
        display: grid;
        place-items: center;
        border-radius: 18px;
        box-sizing: border-box;
      }

      .figma-tool-icon {
        width: 1.35rem;
        height: 1.35rem;
        display: block;
      }
    `}</style>
  );
}

export const FigmaToolRail: LooseStory = {
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('frame', args.onValueChange);

    return (
      <div className="figma-rail-page">
        <FigmaToolRailStyles />
        <SegmentedChoice
          {...args}
          ariaLabel="Design tool"
          className="figma-rail"
          optionSizing={args.optionSizing ?? 'content'}
          geometry={{
            dragScale: false,
            indicator: { borderWidth: 3, style: 'ring' },
            mode: 'overlay',
            optionSize: 64,
            track: { style: 'none' },
          }}
          onValueChange={onValueChange}
          options={[
            {
              value: 'move',
              label: (
                <span className="figma-tool">
                  {' '}
                  <FigmaMouseIcon />
                </span>
              ),
              ariaLabel: 'Move',
            },
            {
              value: 'pen',
              label: (
                <span className="figma-tool">
                  <FigmaPenIcon />
                </span>
              ),
              ariaLabel: 'Pen',
            },
            {
              value: 'text',
              label: (
                <span className="figma-tool">
                  <FigmaTypeIcon />
                </span>
              ),
              ariaLabel: 'Text',
            },
            {
              value: 'frame',
              label: (
                <span className="figma-tool">
                  <FigmaFrameIcon />
                </span>
              ),
              ariaLabel: 'Frame',
            },
          ]}
          orientation={args.orientation ?? 'vertical'}
          value={value}
        />
      </div>
    );
  },
};

function EditorialToneLabel({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <span className="editorial-tone-label">
      <span className="editorial-tone-label__title">{title}</span>
      <span className="editorial-tone-label__subtitle">{subtitle}</span>
    </span>
  );
}

function EditorialToneStyles() {
  return (
    <style>{`
      .editorial-tone-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background: #faf8f4;
        color: #111827;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .editorial-tone {
        --rsc-font-family: Georgia, serif;
        --rsc-text-color: #473f35;
        --rsc-active-text-color: #17110a;
        --rsc-option-padding-inline: 18px;
        --rsc-option-padding-block: 14px;
        --rsc-label-gap: 2px;
      }

      .editorial-tone .rsc-option[data-selected="true"] .rsc-option-content {
        background: rgba(0, 0, 0, 0.035);
      }

      .editorial-tone .rsc-option[data-selected="true"] .rsc-option-label {
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 0.25em;
      }

      .editorial-tone-label {
        display: grid;
        gap: 3px;
        min-width: 0;
        justify-items: center;
        line-height: 1.2;
        box-sizing: border-box;
      }

      .editorial-tone-label__title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
      }

      .editorial-tone-label__subtitle {
        font-size: 0.76em;
        opacity: 0.7;
      }
    `}</style>
  );
}

export const EditorialTone: LooseStory = {
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('essay', args.onValueChange);

    return (
      <div className="editorial-tone-page">
        <EditorialToneStyles />
        <SegmentedChoice
          {...args}
          ariaLabel="Editorial tone"
          className="editorial-tone"
          optionSizing={args.optionSizing ?? 'content'}
          geometry={{ indicator: { style: 'none' }, track: { style: 'none' } }}
          onValueChange={onValueChange}
          options={[
            {
              value: 'essay',
              label: <EditorialToneLabel subtitle="Slow, atmospheric" title="Essay" />,
            },
            {
              value: 'brief',
              label: <EditorialToneLabel subtitle="Sharper and lighter" title="Brief" />,
            },
            {
              value: 'dispatch',
              label: <EditorialToneLabel subtitle="Field notes" title="Dispatch" />,
            },
            {
              value: 'critique',
              label: <EditorialToneLabel subtitle="Opinion forward" title="Critique" />,
            },
          ]}
          unstyled={args.unstyled ?? true}
          value={value}
        />
      </div>
    );
  },
};

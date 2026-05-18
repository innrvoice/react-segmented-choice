import React from 'react';

import { SegmentedChoice, SEGMENTED_CHOICE_FONT_FAMILY } from '../../index';
import thumb1 from '../assets/1s.jpg';
import thumb2 from '../assets/2s.jpg';
import thumb3 from '../assets/3s.jpg';
import thumb4 from '../assets/4s.jpg';
import thumb5 from '../assets/5s.jpg';
import { ModernThumbnail as ModernThumbnailControl } from '../shared/ModernThumbnail';
import { segmentedChoiceOnValueChangeAction } from '../shared/SegmentedChoiceStoryControls';

type StoryProps = Partial<React.ComponentProps<typeof SegmentedChoice>>;
type LooseStory = {
  args?: StoryProps;
  name?: string;
  parameters?: Record<string, unknown>;
  render: (args: StoryProps) => React.JSX.Element;
  tags?: string[];
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

function PrimaryScaleStyles() {
  return (
    <style>{`
      .primary-scale-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background:
          radial-gradient(circle at top, rgba(59, 130, 246, 0.08), transparent 34%),
          linear-gradient(180deg, #fcfdff 0%, #f2f6fb 100%);
        color: #4b5563;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .primary-scale {
        width: 300px;
        padding-bottom: 38px;
        --rsc-focus-ring-color: rgba(37, 99, 235, 0.26);
      }

      .primary-scale .rsc-list {
        width: 300px;
        justify-content: space-between;
        align-items: center;
      }

      .rsc-root.primary-scale .rsc-track {
        height: 4px;
        border-radius: 2px;
        background: linear-gradient(90deg, #dbe2ea 0%, #cdd6e1 100%);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.9),
          inset 0 -1px 0 rgba(148, 163, 184, 0.22);
      }

      .primary-scale .rsc-option {
        width: 36px;
        height: 36px;
        flex: 0 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .primary-scale .rsc-option-content {
        padding: 0;
        min-inline-size: 36px;
        min-block-size: 36px;
        overflow: visible;
      }

      .primary-scale:has(.rsc-option[data-selected="true"] .primary-scale-label--bad),
      .primary-scale:has(.rsc-option[data-previewed="true"] .primary-scale-label--bad) {
        --rsc-indicator-color: #eb4900;
      }

      .primary-scale:has(.rsc-option[data-selected="true"] .primary-scale-label--average),
      .primary-scale:has(.rsc-option[data-previewed="true"] .primary-scale-label--average) {
        --rsc-indicator-color: #ebc041;
      }

      .primary-scale:has(.rsc-option[data-selected="true"] .primary-scale-label--ok),
      .primary-scale:has(.rsc-option[data-previewed="true"] .primary-scale-label--ok) {
        --rsc-indicator-color: #0098eb;
      }

      .primary-scale:has(.rsc-option[data-selected="true"] .primary-scale-label--nice),
      .primary-scale:has(.rsc-option[data-previewed="true"] .primary-scale-label--nice) {
        --rsc-indicator-color: #00db79;
      }

      .primary-scale:has(.rsc-option[data-selected="true"] .primary-scale-label--excellent),
      .primary-scale:has(.rsc-option[data-previewed="true"] .primary-scale-label--excellent) {
        --rsc-indicator-color: #98e000;
      }

      .primary-scale .rsc-indicator {
        border-radius: 999px;
        background:
          linear-gradient(180deg, color-mix(in srgb, var(--rsc-indicator-color) 84%, white) 0%, var(--rsc-indicator-color) 100%);
        box-shadow:
          0 10px 18px color-mix(in srgb, var(--rsc-indicator-color) 24%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.5);
      }

      .primary-scale .rsc-option-anchor {
        width: 20px;
        height: 20px;
        border-radius: 999px;
        background: linear-gradient(180deg, #ffffff 0%, #edf2f7 100%);
        box-shadow:
          inset 0 0 0 3px rgba(148, 163, 184, 0.3),
          0 3px 10px rgba(15, 23, 42, 0.08);
      }

      .primary-scale .rsc-option-label {
        position: absolute;
        top: 46px;
        left: 50%;
        width: max-content;
        max-inline-size: none;
        transform: translateX(-50%);
        font-size: 13px;
        font-weight: 550;
        line-height: 1.45;
        white-space: nowrap;
        overflow: visible;
        text-overflow: clip;
        color: #5f6b7b;
      }
    `}</style>
  );
}

export const PrimaryScale: LooseStory = {
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('ok', args.onValueChange);

    return (
      <div className="primary-scale-page">
        <PrimaryScaleStyles />
        <SegmentedChoice
          {...args}
          ariaLabel="Satisfaction"
          className="primary-scale"
          optionSizing={args.optionSizing ?? 'content'}
          geometry={{
            anchor: { size: 20 },
            dragScale: true,
            indicator: { content: 'none', size: 36, style: 'fill' },
            mode: 'overlay',
            track: { layout: 'center-span', style: 'none' },
          }}
          onValueChange={onValueChange}
          options={[
            {
              value: 'bad',
              label: <span className="primary-scale-label--bad">Bad</span>,
              accentColor: '#eb4900',
            },
            {
              value: 'average',
              label: <span className="primary-scale-label--average">Average</span>,
              accentColor: '#ebc041',
            },
            {
              value: 'ok',
              label: <span className="primary-scale-label--ok">OK</span>,
              accentColor: '#0098eb',
            },
            {
              value: 'nice',
              label: <span className="primary-scale-label--nice">Good</span>,
              accentColor: '#00db79',
            },
            {
              value: 'excellent',
              label: <span className="primary-scale-label--excellent">Excellent!</span>,
              accentColor: '#98e000',
            },
          ]}
          value={value}
        />
      </div>
    );
  },
};

function EmojiRingStyles() {
  return (
    <style>{`
      .emoji-ring-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background:
          radial-gradient(circle at top, rgba(14, 165, 233, 0.08), transparent 36%),
          linear-gradient(180deg, #fdfefe 0%, #eef4f7 100%);
        color: #4b5563;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .emoji-ring {
        width: 286px;
        --rsc-surface: rgba(255, 255, 255, 0.68);
        --rsc-border-color: rgba(203, 213, 225, 0.52);
        --rsc-border-radius: 999px;
        --rsc-padding: 18px;
        --rsc-focus-ring-color: rgba(56, 189, 248, 0.2);
      }

      .emoji-ring .rsc-list {
        width: 100%;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
      }

      .emoji-ring .rsc-option {
        width: 46px;
        height: 46px;
        flex: 0 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .emoji-ring:has(.rsc-option[data-selected="true"] .emoji-ring-mark--bad),
      .emoji-ring:has(.rsc-option[data-previewed="true"] .emoji-ring-mark--bad) {
        --rsc-indicator-color: #7700ca;
      }

      .emoji-ring:has(.rsc-option[data-selected="true"] .emoji-ring-mark--rude),
      .emoji-ring:has(.rsc-option[data-previewed="true"] .emoji-ring-mark--rude) {
        --rsc-indicator-color: #eb4900;
      }

      .emoji-ring:has(.rsc-option[data-selected="true"] .emoji-ring-mark--hm),
      .emoji-ring:has(.rsc-option[data-previewed="true"] .emoji-ring-mark--hm) {
        --rsc-indicator-color: #0098eb;
      }

      .emoji-ring:has(.rsc-option[data-selected="true"] .emoji-ring-mark--nice),
      .emoji-ring:has(.rsc-option[data-previewed="true"] .emoji-ring-mark--nice) {
        --rsc-indicator-color: #ebc041;
      }

      .emoji-ring:has(.rsc-option[data-selected="true"] .emoji-ring-mark--fire),
      .emoji-ring:has(.rsc-option[data-previewed="true"] .emoji-ring-mark--fire) {
        --rsc-indicator-color: #ff8a00;
      }

      .emoji-ring .rsc-indicator {
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.78);
        box-shadow:
          0 10px 22px color-mix(in srgb, var(--rsc-indicator-color) 16%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.9);
        box-sizing: border-box;
        border: 5px solid var(--rsc-indicator-color);
      }

      .emoji-ring .rsc-option-content {
        width: 46px;
        height: 46px;
        min-inline-size: 46px;
        min-block-size: 46px;
        padding: 0;
        background: transparent;
      }

      .emoji-ring .rsc-track {
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(240, 245, 250, 0.82)),
          var(--rsc-surface);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.92),
          inset 0 -10px 18px rgba(148, 163, 184, 0.14),
          0 16px 32px rgba(15, 23, 42, 0.08);
        backdrop-filter: blur(10px) saturate(140%);
        -webkit-backdrop-filter: blur(10px) saturate(140%);
      }

      .emoji-ring .rsc-option-anchor {
        display: none;
      }

      .emoji-ring .rsc-option-label,
      .emoji-ring-mark {
        font-size: 26px;
        line-height: 1;
      }

      .emoji-ring-mark {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        filter: saturate(1.08);
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.65);
      }

      .emoji-ring-mark--lowered {
        margin-top: 3px;
      }
    `}</style>
  );
}

export const EmojiRing: LooseStory = {
  args: {
    optionSizing: 'content',
  },
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('hm', args.onValueChange);

    return (
      <div className="emoji-ring-page">
        <EmojiRingStyles />
        <SegmentedChoice
          {...args}
          ariaLabel="Reaction"
          className="emoji-ring"
          optionSizing={args.optionSizing ?? 'content'}
          geometry={{
            anchor: { size: 36 },
            dragScale: 1.3,
            indicator: { borderWidth: 5, content: 'none', size: 46, style: 'ring' },
            mode: 'overlay',
            track: { layout: 'container', style: 'surface' },
          }}
          onValueChange={onValueChange}
          options={[
            {
              value: 'bad',
              label: (
                <span className="emoji-ring-mark emoji-ring-mark--bad emoji-ring-mark--lowered">
                  🤢
                </span>
              ),
              ariaLabel: 'Nauseated',
              accentColor: '#7700ca',
            },
            {
              value: 'rude',
              label: (
                <span className="emoji-ring-mark emoji-ring-mark--rude emoji-ring-mark--lowered">
                  🤬
                </span>
              ),
              ariaLabel: 'Angry',
              accentColor: '#eb4900',
            },
            {
              value: 'hm',
              label: (
                <span className="emoji-ring-mark emoji-ring-mark--hm emoji-ring-mark--lowered">
                  😕
                </span>
              ),
              ariaLabel: 'Unsure',
              accentColor: '#0098eb',
            },
            {
              value: 'nice',
              label: (
                <span className="emoji-ring-mark emoji-ring-mark--nice emoji-ring-mark--lowered">
                  🤩
                </span>
              ),
              ariaLabel: 'Excited',
              accentColor: '#ebc041',
            },
            {
              value: 'fire',
              label: <span className="emoji-ring-mark emoji-ring-mark--fire">🔥</span>,
              ariaLabel: 'Fire',
              accentColor: '#ff8a00',
            },
          ]}
          value={value}
        />
      </div>
    );
  },
};

function TipSelectorStyles() {
  return (
    <style>{`
      .tip-selector-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background:
          radial-gradient(circle at top, rgba(34, 197, 94, 0.08), transparent 36%),
          linear-gradient(180deg, #fcfffd 0%, #eff7f1 100%);
        color: #4b5563;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .tip-selector {
        width: 300px;
        padding-top: 24px;
        --rsc-focus-ring-color: rgba(22, 163, 74, 0.2);
      }

      .tip-selector .rsc-list {
        width: 300px;
        justify-content: space-between;
        align-items: center;
      }

      .rsc-root.tip-selector .rsc-track {
        height: 3px;
        border-radius: 999px;
        background: linear-gradient(90deg, #d7e0da 0%, #c7d6cc 100%);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.9),
          inset 0 -1px 0 rgba(148, 163, 184, 0.18);
      }

      .tip-selector .rsc-option {
        width: 40px;
        height: 25px;
        flex: 0 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .tip-selector:has(.rsc-option[data-selected="true"] .tip-selector-label--none),
      .tip-selector:has(.rsc-option[data-previewed="true"] .tip-selector-label--none) {
        --rsc-indicator-color: #7c8698;
      }

      .tip-selector:has(.rsc-option[data-selected="true"] .tip-selector-label--five),
      .tip-selector:has(.rsc-option[data-previewed="true"] .tip-selector-label--five) {
        --rsc-indicator-color: #16c2a3;
      }

      .tip-selector:has(.rsc-option[data-selected="true"] .tip-selector-label--ten),
      .tip-selector:has(.rsc-option[data-previewed="true"] .tip-selector-label--ten) {
        --rsc-indicator-color: #06b6d4;
      }

      .tip-selector:has(.rsc-option[data-selected="true"] .tip-selector-label--fifteen),
      .tip-selector:has(.rsc-option[data-previewed="true"] .tip-selector-label--fifteen) {
        --rsc-indicator-color: #3b82f6;
      }

      .tip-selector:has(.rsc-option[data-selected="true"] .tip-selector-label--thirty),
      .tip-selector:has(.rsc-option[data-previewed="true"] .tip-selector-label--thirty) {
        --rsc-indicator-color: #7c3aed;
      }

      .tip-selector .rsc-indicator {
        border-radius: 15px;
        background:
          linear-gradient(180deg, color-mix(in srgb, var(--rsc-indicator-color) 72%, white) 0%, var(--rsc-indicator-color) 100%);
        box-shadow:
          0 10px 16px color-mix(in srgb, var(--rsc-indicator-color) 22%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.45),
          inset 0 0 0 1px color-mix(in srgb, var(--rsc-indicator-color) 30%, rgba(255, 255, 255, 0.32));
      }

      .tip-selector .rsc-option-content {
        padding: 0;
        min-inline-size: 40px;
        min-block-size: 25px;
        overflow: visible;
      }

      .tip-selector .rsc-option-anchor {
        width: 20px;
        height: 13px;
        border-radius: 10px;
        background: linear-gradient(180deg, #ffffff 0%, #edf3ee 100%);
        box-shadow:
          inset 0 0 0 2px rgba(148, 163, 184, 0.36),
          0 2px 8px rgba(15, 23, 42, 0.06);
      }

      .tip-selector .rsc-option-label {
        position: absolute;
        bottom: calc(100% + 18px);
        left: 50%;
        width: max-content;
        max-inline-size: none;
        transform: translateX(-50%);
        font-size: 15px;
        font-weight: 550;
        line-height: 1.45;
        white-space: nowrap;
        overflow: visible;
        text-overflow: clip;
        color: #5b6573;
      }

      .tip-selector .rsc-option-label sup {
        font-size: 12px;
        color: #7b8794;
      }

      .tip-selector .rsc-option[data-selected='true'] .rsc-option-label {
        color: color-mix(in srgb, var(--rsc-indicator-color) 74%, #334155);
      }

      .tip-selector .rsc-option[data-selected='true'] .rsc-option-label sup {
        color: color-mix(in srgb, var(--rsc-indicator-color) 54%, #64748b);
      }

      .rsc-root.tip-selector[data-dragging="true"] .rsc-option[data-selected='true'] .rsc-option-label {
        color: #5b6573;
      }

      .rsc-root.tip-selector[data-dragging="true"] .rsc-option[data-selected='true'] .rsc-option-label sup {
        color: #7b8794;
      }

      .tip-selector .rsc-option[data-previewed='true'] .rsc-option-label {
        color: color-mix(in srgb, var(--rsc-indicator-color) 78%, #334155);
      }

      .tip-selector .rsc-option[data-previewed='true'] .rsc-option-label sup {
        color: color-mix(in srgb, var(--rsc-indicator-color) 58%, #64748b);
      }
    `}</style>
  );
}

export const TipSelector: LooseStory = {
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('0', args.onValueChange);

    return (
      <div className="tip-selector-page">
        <TipSelectorStyles />
        <SegmentedChoice
          {...args}
          ariaLabel="Tip amount"
          className="tip-selector"
          optionSizing={args.optionSizing ?? 'content'}
          geometry={{
            anchor: { height: 13, width: 20 },
            dragScale: false,
            indicator: { content: 'none', height: 25, style: 'fill', width: 40 },
            mode: 'overlay',
            track: { layout: 'center-span', style: 'none' },
          }}
          onValueChange={onValueChange}
          options={[
            {
              value: '0',
              label: <span className="tip-selector-label--none">No tip</span>,
              accentColor: '#7c8698',
            },
            {
              value: '5',
              label: (
                <span className="tip-selector-label--five">
                  5<sup>%</sup>
                </span>
              ),
              accentColor: '#16c2a3',
            },
            {
              value: '10',
              label: (
                <span className="tip-selector-label--ten">
                  10<sup>%</sup>
                </span>
              ),
              accentColor: '#06b6d4',
            },
            {
              value: '15',
              label: (
                <span className="tip-selector-label--fifteen">
                  15<sup>%</sup>
                </span>
              ),
              accentColor: '#3b82f6',
            },
            {
              value: '30',
              label: (
                <span className="tip-selector-label--thirty">
                  30<sup>%</sup>
                </span>
              ),
              accentColor: '#7c3aed',
            },
          ]}
          value={value}
        />
      </div>
    );
  },
};

function ImpressionsStyles() {
  return (
    <style>{`
      .impressions-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background:
          radial-gradient(circle at top, rgba(59, 130, 246, 0.07), transparent 40%),
          linear-gradient(180deg, #fcfdff 0%, #f1f5f9 100%);
        color: #4b5563;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .impressions {
        width: 350px;
        --rsc-focus-ring-color: rgba(59, 130, 246, 0.22);
      }

      .impressions .rsc-list {
        width: 350px;
        justify-content: space-between;
        align-items: center;
      }

      .rsc-root.impressions .rsc-track {
        height: 1px;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(148, 163, 184, 0.55), rgba(203, 213, 225, 0.85), rgba(148, 163, 184, 0.55));
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.85);
      }

      .impressions .rsc-option {
        width: 50px;
        height: 50px;
        flex: 0 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .impressions:has(.rsc-option[data-selected="true"] .impressions-label--100),
      .impressions:has(.rsc-option[data-previewed="true"] .impressions-label--100) {
        --rsc-indicator-color: #003568;
      }

      .impressions:has(.rsc-option[data-selected="true"] .impressions-label--1000),
      .impressions:has(.rsc-option[data-previewed="true"] .impressions-label--1000) {
        --rsc-indicator-color: #003970;
      }

      .impressions:has(.rsc-option[data-selected="true"] .impressions-label--5000),
      .impressions:has(.rsc-option[data-previewed="true"] .impressions-label--5000) {
        --rsc-indicator-color: #004689;
      }

      .impressions:has(.rsc-option[data-selected="true"] .impressions-label--10000),
      .impressions:has(.rsc-option[data-previewed="true"] .impressions-label--10000) {
        --rsc-indicator-color: #014f9d;
      }

      .impressions:has(.rsc-option[data-selected="true"] .impressions-label--100000),
      .impressions:has(.rsc-option[data-previewed="true"] .impressions-label--100000) {
        --rsc-indicator-color: #005cb7;
      }

      .impressions:has(.rsc-option[data-selected="true"] .impressions-label--1000000),
      .impressions:has(.rsc-option[data-previewed="true"] .impressions-label--1000000) {
        --rsc-indicator-color: #0163c4;
      }

      .impressions:has(.rsc-option[data-selected="true"] .impressions-label--infinity),
      .impressions:has(.rsc-option[data-previewed="true"] .impressions-label--infinity) {
        --rsc-indicator-color: #ff5500;
      }

      .impressions .rsc-indicator {
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.78);
        box-shadow:
          0 12px 22px color-mix(in srgb, var(--rsc-indicator-color) 18%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.82);
        box-sizing: border-box;
        border: 4px solid var(--rsc-indicator-color);
        transition:
          transform 180ms cubic-bezier(0.24, 1, 0.32, 1),
          opacity 120ms ease,
          background-color 160ms ease,
          border-color 160ms ease,
          box-shadow 160ms ease;
      }

      .impressions .rsc-option-content {
        padding: 0;
        min-inline-size: 50px;
        min-block-size: 50px;
      }

      .impressions .rsc-option-anchor {
        width: 42px;
        height: 42px;
        border-radius: 999px;
        background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
        box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.26);
      }

      .impressions .rsc-option-label {
        font-size: 18px;
        font-weight: 550;
        line-height: 1.45;
        color: #71717a;
        font-size: 8pt;
      }
    `}</style>
  );
}

export const Impressions: LooseStory = {
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('infinity', args.onValueChange);

    return (
      <div className="impressions-page">
        <ImpressionsStyles />
        <SegmentedChoice
          {...args}
          ariaLabel="Impressions target"
          className="impressions"
          optionSizing={args.optionSizing ?? 'content'}
          geometry={{
            anchor: { size: 42 },
            dragScale: false,
            indicator: { borderWidth: 4, content: 'none', style: 'ring' },
            mode: 'overlay',
            track: { layout: 'center-span', style: 'none' },
          }}
          onValueChange={onValueChange}
          options={[
            {
              value: '100',
              label: <span className="impressions-label--100">100</span>,
              accentColor: '#003568',
            },
            {
              value: '1000',
              label: <span className="impressions-label--1000">1K</span>,
              accentColor: '#003970',
            },
            {
              value: '5000',
              label: <span className="impressions-label--5000">5K</span>,
              accentColor: '#004689',
            },
            {
              value: '10000',
              label: <span className="impressions-label--10000">10K</span>,
              accentColor: '#014f9d',
            },
            {
              value: '100000',
              label: <span className="impressions-label--100000">100K</span>,
              accentColor: '#005cb7',
            },
            {
              value: '1000000',
              label: <span className="impressions-label--1000000">1M</span>,
              accentColor: '#0163c4',
            },
            {
              value: 'infinity',
              label: <span className="impressions-label--infinity">∞</span>,
              accentColor: '#ff5500',
            },
          ]}
          value={value}
        />
      </div>
    );
  },
  tags: ['visual'],
};

function RangeLikeStyles() {
  return (
    <style>{`
      .range-like-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background:
          radial-gradient(circle at top, rgba(179, 54, 255, 0.08), transparent 34%),
          linear-gradient(180deg, #fdfcff 0%, #f4effd 100%);
        color: #4b5563;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .range-like {
        width: 600px;
        padding-bottom: 34px;
        --rsc-focus-ring-color: rgba(179, 54, 255, 0.22);
      }

      .range-like-shell {
        position: relative;
        width: 600px;
      }

      .range-like .rsc-list {
        width: 600px;
        justify-content: space-between;
        align-items: center;
      }

      .rsc-root.range-like .rsc-track {
        height: 5px;
        border-radius: 2.5px;
        background: linear-gradient(90deg, #ddd1ef 0%, #d3c5e9 100%);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.88),
          inset 0 -1px 0 rgba(124, 58, 237, 0.08);
      }

      .range-like .rsc-option {
        width: 15px;
        height: 15px;
        flex: 0 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .range-like .rsc-option-content {
        width: 15px;
        height: 15px;
        min-inline-size: 15px;
        min-block-size: 15px;
        padding: 0;
        background: transparent;
        border-radius: 6px;
        overflow: visible;
      }

      .range-like .rsc-option-anchor {
        display: none;
      }

      .range-like .rsc-indicator {
        border-radius: 6px;
        background:
          linear-gradient(180deg, color-mix(in srgb, var(--rsc-indicator-color) 76%, white) 0%, var(--rsc-indicator-color) 100%);
        box-shadow:
          0 10px 18px color-mix(in srgb, var(--rsc-indicator-color) 24%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.42);
      }

      .range-like .rsc-option-label {
        position: absolute;
        top: 22px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 13px;
        font-weight: 550;
        line-height: 1.45;
        white-space: nowrap;
        color: #73608d;
      }

      .range-like-edge-label {
        position: absolute;
        top: 22px;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.45;
        color: #7a6398;
        pointer-events: none;
        user-select: none;
      }

      .range-like-edge-label--min {
        left: 0;
      }

      .range-like-edge-label--max {
        right: 0;
      }

      .range-mark {
        display: inline-block;
        background: linear-gradient(180deg, #c5aedf 0%, #9f74da 100%);
        border-radius: 999px;
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.65);
      }

      .range-mark--sm {
        width: 1px;
        height: 10px;
      }

      .range-mark--md {
        width: 3px;
        height: 10px;
      }

      .range-mark--lg {
        width: 5px;
        height: 10px;
      }
    `}</style>
  );
}

export const RangeLike: LooseStory = {
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('0', args.onValueChange);

    return (
      <div className="range-like-page">
        <RangeLikeStyles />
        <div className="range-like-shell">
          <SegmentedChoice
            {...args}
            ariaLabel="Range-like preview"
            className="range-like"
            optionSizing={args.optionSizing ?? 'content'}
            geometry={{
              dragScale: 1.8,
              indicator: { content: 'none', size: 15, style: 'fill' },
              mode: 'overlay',
              track: { layout: 'center-span', style: 'none' },
            }}
            onValueChange={onValueChange}
            options={Array.from({ length: 40 }, (_, index) => ({
              value: `${index}`,
              label:
                index === 9 ? (
                  <span className="range-mark range-mark--sm" />
                ) : index === 19 ? (
                  <span className="range-mark range-mark--md" />
                ) : index === 29 ? (
                  <span className="range-mark range-mark--lg" />
                ) : (
                  <span />
                ),
              ariaLabel: index === 0 ? 'Minimum' : index === 39 ? 'Maximum' : `Range stop ${index}`,
              accentColor: '#b336ff',
            }))}
            value={value}
          />
          <span className="range-like-edge-label range-like-edge-label--min" aria-hidden="true">
            MIN
          </span>
          <span className="range-like-edge-label range-like-edge-label--max" aria-hidden="true">
            MAX
          </span>
        </div>
      </div>
    );
  },
};

const slides = [
  { value: 'aurora', title: 'Aurora Study', thumbnail: thumb1, accentColor: '#ff2f9a' },
  { value: 'atelier', title: 'Atelier Desk', thumbnail: thumb2, accentColor: '#ffb33f' },
  { value: 'shoreline', title: 'Shoreline Draft', thumbnail: thumb3, accentColor: '#ff7ac8' },
  { value: 'studio', title: 'Studio Cut', thumbnail: thumb4, accentColor: '#19f6ff' },
  { value: 'nightshift', title: 'Nightshift Mix', thumbnail: thumb5, accentColor: '#35ff9a' },
] as const;

function ModernThumbnailStyles() {
  return (
    <style>{`
      .modern-thumbnail-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0) 42%),
          linear-gradient(180deg, #202633 0%, #10151d 58%, #090d13 100%);
        color: #c8d0db;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }
    `}</style>
  );
}

export const ModernThumbnail: LooseStory = {
  render: function Render(args) {
    return (
      <div className="modern-thumbnail-page">
        <ModernThumbnailStyles />
        <ModernThumbnailControl
          {...args}
          ariaLabel="Scene selection"
          defaultValue="shoreline"
          optionSizing={args.optionSizing ?? 'content'}
          onValueChange={segmentedChoiceOnValueChangeAction}
          slides={slides}
        />
      </div>
    );
  },
  args: {
    defaultValue: 'shoreline',
    optionSizing: 'content',
  },
  tags: ['visual'],
};

function CameraAutoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="currentColor"
    >
      <path d="M480-576h296q-22-66-70.5-116.5T592-769L480-576Zm-83 48 148-256q-17-2-33-5t-32-3q-54 0-103.5 18.5T285-723l112 195Zm-225 96h225L249-689q-40 43-60.5 97T168-480q0 13 1 25t3 23Zm196 241 112-193H184q23 66 70 117t114 76Zm112 23q53 0 102.5-18t92.5-51L563-432 415-176q16 2 32 5t33 3Zm231-103q38-43 59.5-96.5T792-480q0-12-1-24t-3-24H563l148 257ZM480-480Zm0 384q-80 0-150-30t-122-82q-52-52-82-122T96-480q0-80 30-149.5t82-122Q260-804 330-834t150-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 80-30 150t-82.5 122q-52.5 52-122 82T480-96Z" />
    </svg>
  );
}

function CameraPortraitIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="currentColor"
    >
      <path d="M237-285q54-38 115.5-56.5T480-360q66 0 127.5 18.5T723-285q35-41 52-91t17-104q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 54 17 104t52 91Zm141-165q-42-42-42-102t42-102q42-42 102-42t102 42q42 42 42 102t-42 102q-42 42-102 42t-102-42ZM480-96q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Zm100-88.5q48-16.5 90-48.5-43-27-91-41t-99-14q-51 0-99.5 13.5T290-233q42 32 90 48.5T480-168q52 0 100-16.5ZM531-501q21-21 21-51t-21-51q-21-21-51-21t-51 21q-21 21-21 51t21 51q21 21 51 21t51-21Zm-51-51Zm0 319Z" />
    </svg>
  );
}

function CameraNightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="currentColor"
    >
      <path d="M479.96-144Q340-144 242-242t-98-238q0-140 97.93-238t237.83-98q13.06 0 25.65 1 12.59 1 25.59 3-39 29-62 72t-23 92q0 85 58.5 143.5T648-446q49 0 92-23t72-62q2 13 3 25.59t1 25.65q0 139.9-98.04 237.83t-238 97.93Zm.04-72q82 0 148.78-47.07Q695.55-310.15 727-386q-20 5-39.67 8.5Q667.67-374 648-374q-113.86 0-193.93-80.07Q374-534.14 374-648q0-19.67 3.5-39.33Q381-707 386-727q-75.85 31.45-122.93 98.22Q216-562 216-480q0 110 77 187t187 77Zm-14-250Z" />
    </svg>
  );
}

function CameraModePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="camera-mode-pill">
      {icon}
      <span className="camera-mode-text">{text}</span>
    </span>
  );
}

function CameraModesCloneActiveStyles() {
  return (
    <style>{`
      .camera-modes-page {
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

      .camera-modes {
        --rsc-bg: #0f1422;
        --rsc-surface: #0f1422;
        --rsc-border-color: #1f2a42;
        --rsc-border-radius: 999px;
        --rsc-option-radius: 999px;
        --rsc-option-padding-inline: 14px;
        --rsc-option-padding-block: 10px;
        --rsc-option-min-size: 44px;
        --rsc-text-color: #9ca9c2;
        --rsc-active-text-color: #ffffff;
        --rsc-indicator-color: #3d86ff;
        --rsc-indicator-hover-bg: #5c9bff;
        --rsc-indicator-shadow: 0 8px 18px rgba(27, 76, 167, 0.38);
        --rsc-focus-ring-color: rgba(110, 165, 255, 0.6);
      }

      .camera-modes .rsc-option,
      .camera-modes .rsc-option-content {
        min-width: 0;
      }

      .camera-modes .rsc-option-label {
        overflow: visible;
        text-overflow: clip;
      }

      .camera-mode-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        min-width: 0;
      }

      .camera-mode-icon {
        width: 16px;
        height: 16px;
        display: block;
        flex: 0 0 auto;
      }

      .camera-mode-text {
        font-size: 13px;
        line-height: 1.2;
        letter-spacing: 0.01em;
        white-space: nowrap;
      }
    `}</style>
  );
}

export const CameraModesCloneActive: LooseStory = {
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('portrait', args.onValueChange);

    return (
      <div className="camera-modes-page">
        <CameraModesCloneActiveStyles />
        <SegmentedChoice
          {...args}
          ariaLabel="Camera mode"
          className="camera-modes"
          optionSizing={args.optionSizing ?? 'content'}
          geometry={{
            dragScale: false,
            indicator: { content: 'clone-active', style: 'fill' },
            mode: 'overlay',
            track: { style: 'surface' },
          }}
          onValueChange={onValueChange}
          options={[
            {
              value: 'auto',
              label: <CameraModePill icon={<CameraAutoIcon />} text="Auto" />,
              ariaLabel: 'Auto',
            },
            {
              value: 'portrait',
              label: <CameraModePill icon={<CameraPortraitIcon />} text="Portrait" />,
              ariaLabel: 'Portrait',
            },
            {
              value: 'night',
              label: <CameraModePill icon={<CameraNightIcon />} text="Night" />,
              ariaLabel: 'Night',
            },
          ]}
          value={value}
        />
      </div>
    );
  },
  args: {
    optionSizing: 'content',
  },
  tags: ['visual'],
};

function MaterialToggleStyles() {
  return (
    <style>{`
      .material-toggle-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background: #f8fbfc;
        color: #132f38;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .material-toggle {
        --rsc-surface: #166d88;
        --rsc-border-color: #166d88;
        --rsc-border-radius: 999px;
        --rsc-option-radius: 999px;
        --rsc-padding: 4px;
        --rsc-gap: 0;
        --rsc-option-min-size: 26px;
        --rsc-option-padding-block: 0;
        --rsc-option-padding-inline: 0;
        --rsc-text-color: transparent;
        --rsc-active-text-color: #166d88;
        --rsc-indicator-color: #f4fbf8;
        --rsc-indicator-bg: #f4fbf8;
        --rsc-indicator-hover-bg: var(--rsc-indicator-color);
        --rsc-indicator-shadow: none;
      }

      .material-toggle:has(.rsc-option[data-selected="true"] .material-toggle-mark--off) {
        --rsc-surface: #d9e4e7;
        --rsc-border-color: #748189;
        --rsc-active-text-color: transparent;
        --rsc-indicator-color: #83919a;
        --rsc-indicator-bg: #83919a;
        --rsc-indicator-shadow: none;
      }

      .material-toggle .rsc-track {
        border: 2px solid var(--rsc-border-color);
        background-color: var(--rsc-surface);
        box-shadow: none;
        transition:
          background-color 180ms ease,
          border-color 180ms ease;
      }

      .material-toggle .rsc-option {
        width: 26px;
        height: 26px;
        flex: 1 1 0;
      }

      .material-toggle .rsc-option-content {
        width: 26px;
        min-inline-size: 26px;
        min-block-size: 26px;
        padding: 0;
        background: transparent;
        box-shadow: none;
      }

      .material-toggle .rsc-option-anchor {
        display: none;
      }

      .material-toggle .rsc-indicator {
        border-radius: 999px;
        border: 0;
        transition:
          transform 180ms cubic-bezier(0.24, 1, 0.32, 1),
          width 180ms cubic-bezier(0.24, 1, 0.32, 1),
          height 180ms cubic-bezier(0.24, 1, 0.32, 1),
          background-color 180ms ease,
          opacity 120ms ease;
      }

      .material-toggle .rsc-indicator-content {
        overflow: visible;
        padding: 0;
      }

      .material-toggle-mark {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        opacity: 0;
      }

      .material-toggle .rsc-indicator-content .material-toggle-mark--on {
        opacity: 1;
      }

      .material-toggle-mark--on::before {
        width: 9px;
        height: 6px;
        margin-top: -1px;
        border-left: 2px solid currentColor;
        border-bottom: 2px solid currentColor;
        border-radius: 1.5px;
        transform: rotate(-45deg);
        content: "";
      }

    `}</style>
  );
}

export const MaterialToggle: LooseStory = {
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('on', args.onValueChange);

    return (
      <div className="material-toggle-page">
        <MaterialToggleStyles />
        <SegmentedChoice
          {...args}
          ariaLabel="Android-like toggle"
          className="material-toggle"
          optionSizing={args.optionSizing ?? 'content'}
          geometry={{
            dragScale: false,
            indicator: { content: 'clone-active', size: 26, style: 'fill' },
            mode: 'overlay',
            track: { layout: 'container', style: 'surface' },
          }}
          onValueChange={onValueChange}
          options={[
            {
              value: 'off',
              label: <span className="material-toggle-mark material-toggle-mark--off" />,
              ariaLabel: 'Disabled',
            },
            {
              value: 'on',
              label: <span className="material-toggle-mark material-toggle-mark--on" />,
              ariaLabel: 'Enabled',
              accentColor: '#f4fbf8',
            },
          ]}
          value={value}
        />
      </div>
    );
  },
};

function IOSToggleStyles() {
  return (
    <style>{`
      .ios-toggle-page {
        min-height: 100vh;
        width: 100%;
        display: grid;
        place-items: center;
        padding: 32px 24px;
        box-sizing: border-box;
        background:
          radial-gradient(circle at 34% 20%, rgba(255, 255, 255, 0.92), transparent 24%),
          radial-gradient(circle at 66% 84%, rgba(67, 211, 118, 0.2), transparent 32%),
          linear-gradient(180deg, #f7fbff 0%, #e9eff7 100%);
        color: #1d1d1f;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .ios-toggle-wrap {
        position: relative;
        padding: 5px;
        border-radius: 999px;
        background: rgba(222, 229, 238, 0.72);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.86),
          inset 0 -1px 0 rgba(120, 132, 150, 0.18),
          0 18px 44px rgba(31, 45, 61, 0.16);
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        isolation: isolate;
        transition:
          background-color 180ms ease,
          box-shadow 180ms ease;
      }

      .ios-toggle-wrap::before,
      .ios-toggle-wrap::after {
        position: absolute;
        inset: 0;
        z-index: -1;
        border-radius: inherit;
        content: "";
        transition: opacity 180ms ease;
      }

      .ios-toggle-wrap::before {
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.38)),
          rgba(222, 229, 238, 0.72);
      }

      .ios-toggle-wrap::after {
        background:
          radial-gradient(circle at 22% 10%, rgba(255, 255, 255, 0.4), transparent 15%),
          linear-gradient(135deg, rgba(104, 231, 147, 0.92), rgba(41, 197, 92, 0.82));
        opacity: 0;
      }

      .ios-toggle-wrap:has(.rsc-option[data-selected="true"] .ios-toggle-option--on) {
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.7),
          inset 0 -1px 0 rgba(13, 101, 44, 0.2),
          0 18px 44px rgba(41, 197, 92, 0.24);
      }

      .ios-toggle-wrap:has(.rsc-option[data-selected="true"] .ios-toggle-option--on)::after {
        opacity: 1;
      }

      .ios-toggle-wrap:has(.rsc-option[data-selected="true"] .ios-toggle-option--on)::before {
        opacity: 0;
      }

      .ios-toggle {
        position: relative;
        z-index: 1;
        width: 132px;
        --rsc-surface: rgba(255, 255, 255, 0.22);
        --rsc-border-color: rgba(255, 255, 255, 0.22);
        --rsc-border-radius: 999px;
        --rsc-option-radius: 999px;
        --rsc-padding: 0;
        --rsc-gap: 0;
        --rsc-option-padding-block: 0;
        --rsc-option-padding-inline: 0;
        --rsc-option-min-size: 42px;
        --rsc-text-color: rgba(29, 29, 31, 0.56);
        --rsc-active-text-color: #111318;
        --rsc-indicator-color: rgba(255, 255, 255, 0.82);
        --rsc-indicator-bg: rgba(255, 255, 255, 0.82);
        --rsc-indicator-shadow:
          0 8px 18px rgba(18, 25, 36, 0.16),
          inset 0 1px 0 rgba(255, 255, 255, 0.92),
          inset 0 -10px 18px rgba(210, 219, 232, 0.18);
      }

      .ios-toggle .rsc-list {
        width: 132px;
        height: 42px;
      }

      .ios-toggle .rsc-track {
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.22),
          inset 0 10px 18px rgba(255, 255, 255, 0.12);
      }

      .ios-toggle .rsc-option {
        flex: 1 1 0;
      }

      .ios-toggle .rsc-option-content {
        width: 66px;
        min-inline-size: 66px;
        min-block-size: 42px;
        padding: 0;
        background: transparent;
        box-shadow: none;
      }

      .ios-toggle .rsc-option-anchor {
        display: none;
      }

      .ios-toggle .rsc-indicator {
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.72);
        backdrop-filter: blur(16px) saturate(180%);
        -webkit-backdrop-filter: blur(16px) saturate(180%);
      }

      .ios-toggle-option {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: 13px;
        font-weight: 760;
        letter-spacing: 0;
        line-height: 1;
        transition:
          color 160ms ease,
          opacity 160ms ease;
      }

      .ios-toggle .rsc-option[data-selected="true"] .ios-toggle-option {
        color: #111318;
      }
    `}</style>
  );
}

export const IOSToggle: LooseStory = {
  render: function Render(args) {
    const [value, onValueChange] = useStoryValue('on', args.onValueChange);

    return (
      <div className="ios-toggle-page">
        <IOSToggleStyles />
        <div className="ios-toggle-wrap">
          <SegmentedChoice
            {...args}
            ariaLabel="iOS-like toggle"
            className="ios-toggle"
            optionSizing={args.optionSizing ?? 'equal'}
            geometry={{
              dragScale: 1.02,
              indicator: { content: 'none', style: 'fill' },
              mode: 'underlay',
              track: { style: 'surface' },
            }}
            onValueChange={onValueChange}
            options={[
              {
                value: 'off',
                label: <span className="ios-toggle-option ios-toggle-option--off">Off</span>,
                ariaLabel: 'Disabled',
              },
              {
                value: 'on',
                label: <span className="ios-toggle-option ios-toggle-option--on">On</span>,
                ariaLabel: 'Enabled',
              },
            ]}
            value={value}
          />
        </div>
      </div>
    );
  },
};

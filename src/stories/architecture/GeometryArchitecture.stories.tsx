import type { Meta } from '@storybook/react-vite';
import React from 'react';

import { SegmentedChoice, SEGMENTED_CHOICE_FONT_FAMILY } from '../../index';

const meta = {
  title: 'Architecture/Geometry And Styling',
  component: SegmentedChoice,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Curated visual stories for the geometry, runtime data attributes and CSS-first customization model.',
      },
    },
    controls: {
      disable: true,
    },
  },
} satisfies Meta<typeof SegmentedChoice>;

export default meta;

type ArchitectureStory = {
  name?: string;
  render: () => React.JSX.Element;
  tags?: string[];
};

const modeOptions = [
  { value: 'layout', label: 'Layout' },
  { value: 'runtime', label: 'Runtime' },
  { value: 'css', label: 'CSS' },
];

const rangeOptions = [
  { value: 'low', label: 'Low', accentColor: '#0ea5e9' },
  { value: 'mid', label: 'Mid', accentColor: '#6366f1' },
  { value: 'high', label: 'High', accentColor: '#f97316' },
];

const surfaceContentOptions = [
  { value: 'board', label: 'Board', accentColor: '#0ea5e9' },
  { value: 'list', label: 'List', accentColor: '#6366f1' },
  { value: 'timeline', label: 'Timeline', accentColor: '#f97316' },
];

const formatOptions = [
  { value: 'text', label: 'Text' },
  { value: 'visual', label: 'Visual' },
  { value: 'code', label: 'Code' },
];

const transitionOptions = [
  { value: 'from', label: 'From' },
  { value: 'to', label: 'To' },
];

function useStoryValue(initialValue: string) {
  const [value, setValue] = React.useState(initialValue);

  return [value, setValue] as const;
}

function ArchitectureStyles() {
  return (
    <style>{`
      .architecture-page {
        min-height: 100vh;
        width: 100%;
        box-sizing: border-box;
        padding: 36px 28px;
        background:
          linear-gradient(180deg, #fbfcfd 0%, #eef3f7 100%);
        color: #263241;
        font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
      }

      .architecture-board {
        width: min(1120px, 100%);
        margin: 0 auto;
        display: grid;
        gap: 24px;
      }

      .architecture-board--compact {
        max-width: 980px;
      }

      .architecture-header {
        display: grid;
        gap: 8px;
      }

      .architecture-kicker {
        color: #64748b;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .architecture-title {
        margin: 0;
        color: #111827;
        font-size: 28px;
        font-weight: 760;
        line-height: 1.12;
        letter-spacing: 0;
      }

      .architecture-copy {
        max-width: 760px;
        margin: 0;
        color: #526173;
        font-size: 14px;
        line-height: 1.65;
      }

      .architecture-grid {
        display: grid;
        gap: 18px;
      }

      .architecture-grid--two {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .architecture-grid--three {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .architecture-card,
      .architecture-panel {
        box-sizing: border-box;
        min-width: 0;
        border: 1px solid #dce3ea;
        
        background: rgba(255, 255, 255, 0.82);
        box-shadow: 0 14px 32px rgba(15, 23, 42, 0.06);
      }

      .architecture-card {
        padding: 18px;
      }

      .architecture-panel {
        padding: 22px;
      }

      .architecture-card-title {
        margin: 0 0 10px;
        color: #172033;
        font-size: 14px;
        font-weight: 760;
        letter-spacing: 0;
      }

      .architecture-card-copy {
        margin: 0;
        color: #5d6b7c;
        font-size: 13px;
        line-height: 1.55;
      }

      .architecture-chip-row {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }

      .architecture-chip,
      .architecture-code-chip {
        display: inline-flex;
        align-items: center;
        min-height: 26px;
        box-sizing: border-box;
        
        font-size: 12px;
        line-height: 1.2;
        letter-spacing: 0;
        white-space: nowrap;
      }

      .architecture-chip {
        border: 1px solid #cbd5e1;
        padding: 5px 9px;
        background: #f8fafc;
        color: #334155;
        font-weight: 650;
      }

      .architecture-code-chip {
        border: 1px solid #cfd8e3;
        padding: 5px 8px;
        max-width: 100%;
        background: #f4f7fa;
        color: #1e293b;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        overflow-wrap: anywhere;
      }

      .architecture-code-block {
        box-sizing: border-box;
        max-width: 100%;
        margin: 0;
        padding: 13px 14px;
        overflow-x: auto;
        border: 1px solid #d8e0ea;        
        background: #f7f9fb;
        color: #253244;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 12px;
        line-height: 1.58;
        white-space: pre-wrap;
      }

      .architecture-choice-wrap {
        box-sizing: border-box;
        display: grid;
        place-items: center;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        min-height: 132px;
        padding: 20px;
        overflow-x: auto;
        overflow-y: hidden;
        border: 1px dashed #c7d2de;
        background:
          linear-gradient(90deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
          linear-gradient(180deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
          #ffffff;
        background-size: 22px 22px;
      }

      .architecture-measure-line {
        position: absolute;
        pointer-events: none;
        border-color: #64748b;
        color: #475569;
        font-size: 11px;
        font-weight: 700;
        line-height: 1.2;
      }

      .architecture-note {
        display: grid;
        gap: 6px;
        padding: 12px;
        border: 1px solid #d7e0e9;
        
        background: #fbfdff;
        color: #526173;
        font-size: 12px;
        line-height: 1.5;
      }

      .architecture-note strong {
        color: #1f2937;
      }

      .architecture-note--prose {
        display: block;
      }

      .architecture-note--prose strong {
        display: block;
        margin-bottom: 6px;
      }

      .architecture-note--prose p {
        margin: 0;
      }

      .architecture-inline-code {
        display: inline-block;
        padding: 1px 4px;
        border: 1px solid #cfd8e3;
        
        background: #f4f7fa;
        color: #1e293b;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 0.95em;
        line-height: 1.25;
        white-space: nowrap;
      }

      .pipeline-flow {
        display: grid;
        grid-template-columns: 1.05fr 0.95fr;
        gap: 20px;
        align-items: stretch;
      }

      .pipeline-demo {
        position: relative;
        min-height: 350px;
        display: grid;
        grid-template-rows: 1fr auto;
        gap: 16px;
      }

      .pipeline-choice-wrap {
        position: relative;
        min-height: 220px;
        display: grid;
        align-content: center;
        justify-items: center;
        gap: 28px;
      }

      .pipeline-choice {
        width: min(100%, 330px);
        --rsc-surface: #eef2f7;
        --rsc-border-color: #cbd5e1;
        --rsc-track-size: 3px;
        --rsc-indicator-color: #2563eb;
        --rsc-indicator-border-width: 3px;
        --rsc-focus-ring-color: rgba(37, 99, 235, 0.22);
      }

      .pipeline-choice .rsc-list {
        justify-content: space-between;
        width: min(100%, 330px);
      }

      .pipeline-choice .rsc-option {
        width: 88px;
        height: 84px;
      }

      .pipeline-choice .rsc-option-content {
        width: 100%;
        height: 100%;
        min-block-size: 0;
        padding: 0;
        overflow: visible;
      }

      .pipeline-choice .rsc-option-label {
        position: absolute;
        top: 58px;
        left: 50%;
        width: max-content;
        max-inline-size: none;
        transform: translateX(-50%);
        color: #64748b;
        font-size: 13px;
      }

      .pipeline-choice .rsc-option-anchor {
        background: #ffffff;
        box-shadow: inset 0 0 0 2px #b9c7d8;
      }

      .pipeline-choice.rsc-root .rsc-indicator {
        background: rgba(255, 255, 255, 0.7);
      }

      .pipeline-summary {
        width: min(100%, 560px);
        display: grid;
        gap: 8px;
      }

      .pipeline-summary-step {
        min-width: 0;
        padding: 10px 12px;
        border: 1px solid #d8e1eb;
        background: #ffffff;
      }

      .pipeline-summary-step strong {
        display: block;
        margin-bottom: 5px;
        color: #172033;
        font-size: 13px;
        font-weight: 760;
        line-height: 1.25;
      }

      .pipeline-summary-step span {
        display: block;
        color: #5d6b7c;
        font-size: 12px;
        line-height: 1.45;
      }

      .pipeline-stack {
        display: grid;
        gap: 12px;
      }

      .pipeline-step {
        display: grid;
        gap: 9px;
        padding: 14px;
        border: 1px solid #d8e1eb;
        
        background: #ffffff;
      }

      .pipeline-step-header {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: center;
        color: #1f2937;
        font-size: 13px;
        font-weight: 760;
      }

      .track-comparison {
        display: grid;
        gap: 18px;
      }

      .track-style-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .track-scene {
        position: relative;
        display: grid;
        gap: 18px;
        align-content: center;
        min-height: 260px;
      }

      .track-choice {
        width: min(100%, 390px);
        --rsc-surface: #eef2f7;
        --rsc-border-color: #cfd8e3;
        --rsc-indicator-color: #334155;
      }

      .track-choice .rsc-list {
        width: min(100%, 390px);
        justify-content: space-between;
      }

      .track-choice .rsc-option {
        width: min(31%, 98px);
      }

      .track-choice .rsc-option[data-selected="true"] .rsc-option-label,
      .track-choice .rsc-option[data-previewed="true"] .rsc-option-label,
      .axis-choice .rsc-option[data-selected="true"] .rsc-option-label,
      .axis-choice .rsc-option[data-previewed="true"] .rsc-option-label,
      .track-style-choice .rsc-option[data-selected="true"] .rsc-option-label,
      .track-style-choice .rsc-option[data-previewed="true"] .rsc-option-label {
        color: #111827;
      }

      .axis-choice {
        width: min(100%, 390px);
        --rsc-padding: 0px;
        --rsc-surface: #eef2f7;
        --rsc-border-color: #cfd8e3;
        --rsc-track-size: 3px;
        --rsc-indicator-color: #0f766e;
        --rsc-focus-ring-color: rgba(15, 118, 110, 0.2);
      }

      .axis-choice .rsc-list {
        width: min(100%, 390px);
        justify-content: space-between;
        align-items: center;
      }

      .axis-choice .rsc-option {
        width: 70px;
        height: 82px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .axis-choice .rsc-option-content {
        width: 100%;
        height: 100%;
        min-block-size: 0;
        padding: 0;
        overflow: visible;
      }

      .axis-choice .rsc-option-label {
        position: absolute;
        top: 58px;
        left: 50%;
        width: max-content;
        max-inline-size: none;
        transform: translateX(-50%);
        color: #526173;
        font-size: 13px;
      }

      .axis-choice .rsc-option-anchor {
        background: #ffffff;
        box-shadow:
          inset 0 0 0 2px #0f766e,
          0 0 0 6px rgba(15, 118, 110, 0.1);
      }

      .axis-choice .rsc-indicator {
        background: rgba(15, 118, 110, 0.16);
        box-shadow: inset 0 0 0 2px #0f766e;
      }

      .track-style-card {
        display: grid;
        gap: 14px;
        padding: 16px;
        border: 1px solid #dce3ea;
        background: #ffffff;
      }

      .track-style-choice {
        width: min(100%, 360px);
        --rsc-padding: 0px;
        --rsc-surface: #eef2f7;
        --rsc-border-color: #cfd8e3;
        --rsc-track-size: 4px;
        --rsc-indicator-color: #0f766e;
        --rsc-focus-ring-color: rgba(15, 118, 110, 0.2);
      }

      .track-style-choice .rsc-list {
        width: min(100%, 360px);
        justify-content: space-between;
        align-items: center;
      }

      .track-style-choice .rsc-option {
        width: 64px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .track-style-choice .rsc-option-content {
        width: 100%;
        height: 100%;
        min-block-size: 0;
        padding: 0;
        overflow: visible;
      }

      .track-style-choice .rsc-option-label {
        position: absolute;
        top: 50px;
        left: 50%;
        width: max-content;
        max-inline-size: none;
        transform: translateX(-50%);
        color: #526173;
        font-size: 12px;
      }

      .track-style-choice .rsc-option-anchor {
        background: #ffffff;
        box-shadow:
          inset 0 0 0 2px #0f766e,
          0 0 0 5px rgba(15, 118, 110, 0.1);
      }

      .track-style-choice .rsc-indicator {
        background: rgba(15, 118, 110, 0.16);
        box-shadow: inset 0 0 0 2px #0f766e;
      }

      .surface-model-grid {
        display: grid;
        gap: 14px;
      }

      .surface-model-card {
        display: grid;
        gap: 12px;
        min-width: 0;
        padding: 16px;
        border: 1px solid #dce3ea;
        background: #ffffff;
      }

      .surface-model-visual {
        position: relative;
        display: grid;
        gap: 14px;
        min-width: 0;
        padding: 18px;
        overflow: hidden;
        border: 1px dashed #c7d2de;
        background:
          linear-gradient(90deg, rgba(148, 163, 184, 0.13) 1px, transparent 1px),
          #fbfdff;
        background-size: 24px 24px;
      }

      .surface-model-chips {
        margin-top: 0;
      }

      .surface-model-chips .architecture-code-chip {
        white-space: normal;
      }

      .surface-model-examples {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        align-items: start;
      }

      .surface-model-example {
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .surface-model-example-title {
        color: #334155;
        font-size: 12px;
        font-weight: 760;
      }

      .surface-choice {
        --rsc-surface: #eef2f7;
        --rsc-border-color: #cfd8e3;
        --rsc-indicator-color: #2563eb;
      }

      .surface-choice .rsc-option[data-selected="true"] .rsc-option-label,
      .surface-choice .rsc-option[data-previewed="true"] .rsc-option-label {
        color: #111827;
      }

      .surface-choice--compact {
        width: fit-content;
        max-width: 100%;
      }

      .surface-choice--wide {
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
      }

      .surface-choice--wide .rsc-list {
        box-sizing: border-box;
        width: 100%;
      }

      .surface-model-label-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        color: #526173;
        font-size: 11px;
        font-weight: 720;
      }

      .surface-model-label {
        display: inline-flex;
        align-items: center;
        min-height: 22px;
        padding: 3px 6px;
        border: 1px solid #cfd8e3;
        background: #ffffff;
      }

      .surface-model-label--width {
        flex: 1 1 100%;
        justify-content: center;
        border-style: dashed;
      }

      .surface-model-note {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(260px, 0.8fr);
        gap: 14px;
        align-items: start;
      }

      .indicator-map {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
      }

      .indicator-cell {
        display: grid;
        gap: 12px;
        align-content: start;
        min-height: 238px;
        padding: 14px;
        border: 1px solid #dce3ea;
        
        background: #ffffff;
      }

      .indicator-cell-heading {
        display: grid;
        gap: 6px;
      }

      .indicator-cell-heading strong {
        color: #172033;
        font-size: 13px;
      }

      .indicator-cell-heading span {
        color: #64748b;
        font-size: 12px;
        line-height: 1.45;
      }

      .indicator-choice {
        width: min(100%, 245px);
        --rsc-surface: #edf2f7;
        --rsc-border-color: #d5dee9;
        --rsc-indicator-color: #3b82f6;
        --rsc-indicator-border-width: 3px;
        --rsc-indicator-shadow: 0 8px 18px rgba(37, 99, 235, 0.14);
      }

      .indicator-choice .rsc-list {
        width: min(100%, 245px);
      }

      .indicator-choice .rsc-option[data-selected="true"] .rsc-option-label,
      .indicator-choice .rsc-option[data-previewed="true"] .rsc-option-label {
        color: #111827;
      }

      .indicator-choice--centered .rsc-list {
        justify-content: space-between;
      }

      .indicator-choice--centered .rsc-option {
        width: 72px;
      }

      .indicator-choice--centered .rsc-option {
        height: 76px;
      }

      .indicator-choice--centered .rsc-option-content {
        width: 100%;
        height: 100%;
        min-block-size: 0;
        padding: 0;
        overflow: visible;
      }

      .indicator-choice--centered .rsc-option-label {
        position: absolute;
        top: 58px;
        left: 50%;
        width: max-content;
        max-inline-size: none;
        transform: translateX(-50%);
        color: #64748b;
        font-size: 12px;
      }

      .indicator-choice--centered .rsc-option-anchor {
        background: #ffffff;
        box-shadow:
          inset 0 0 0 2px #3b82f6,
          0 0 0 5px rgba(59, 130, 246, 0.1);
      }

      .indicator-choice--no-indicator .rsc-option[data-selected="true"] .rsc-option-content {
        background: #e0f2fe;
        color: #075985;
      }

      .indicator-choice--clone {
        --rsc-indicator-color: #111827;
        --rsc-indicator-hover-bg: #111827;
        --rsc-indicator-shadow: 0 12px 24px rgba(17, 24, 39, 0.2);
      }

      .indicator-choice--clone .rsc-indicator {
        color: #ffffff;
      }

      .indicator-note {
        grid-column: 1 / -1;
      }

      .transition-compare {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .transition-panel {
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .transition-panel-label {
        color: #475569;
        font-size: 11px;
        font-weight: 760;
      }

      .transition-choice {
        width: min(100%, 116px);
        --rsc-surface: #edf2f7;
        --rsc-border-color: #d5dee9;
        --rsc-indicator-color: #3b82f6;
      }

      .transition-choice .rsc-list {
        width: min(100%, 116px);
      }

      .transition-choice .rsc-option {
        min-inline-size: 0;
      }

      .transition-choice .rsc-option[data-selected="true"] .rsc-option-label,
      .transition-choice .rsc-option[data-previewed="true"] .rsc-option-label {
        color: #111827;
      }

      .sizing-scene {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 20px;
        align-items: start;
      }

      .sizing-stack {
        display: grid;
        gap: 22px;
      }

      .sizing-row {
        position: relative;
        display: grid;
        gap: 8px;
        padding: 16px;
        border: 1px solid #dce3ea;
        
        background: #ffffff;
      }

      .sizing-visual {
        position: relative;
        width: fit-content;
        max-width: 100%;
        min-width: 0;
      }

      .sizing-label {
        position: absolute;
        right: -8px;
        top: -12px;
        transform: translateX(100%);
        padding: 4px 6px;
        border: 1px solid #cfd8e3;
        background: #fbfdff;
        color: #475569;
        font-size: 11px;
        font-weight: 760;
        line-height: 1.2;
        white-space: nowrap;
      }

      .sizing-choice {
        --rsc-surface: #f1f5f9;
        --rsc-border-color: #d7e0e9;
        --rsc-indicator-color: #4f46e5;
        --rsc-indicator-border-width: 3px;
      }

      .sizing-choice--option {
        width: fit-content;
        max-width: 100%;
      }

      .sizing-choice--option .rsc-option-content {
        background: rgba(79, 70, 229, 0.05);
      }

      .sizing-choice--option .rsc-option[data-selected="true"] .rsc-option-label,
      .sizing-choice--option .rsc-option[data-previewed="true"] .rsc-option-label {
        color: #111827;
      }

      .sizing-choice--anchor {
        width: min(100%, 340px);
        --rsc-padding: 0px;
        --rsc-track-size: 3px;
      }

      .sizing-choice--anchor .rsc-list {
        width: min(100%, 340px);
        justify-content: space-between;
      }

      .sizing-choice--anchor .rsc-option {
        width: 92px;
        height: 80px;
      }

      .sizing-choice--anchor .rsc-option-content {
        width: 100%;
        height: 100%;
        min-block-size: 0;
        padding: 0;
        overflow: visible;
      }

      .sizing-choice--anchor .rsc-option-label {
        position: absolute;
        top: 56px;
        left: 50%;
        width: max-content;
        max-inline-size: none;
        transform: translateX(-50%);
        color: #64748b;
        font-size: 13px;
      }

      .sizing-choice--anchor .rsc-track {
        background: #cbd5e1;
      }

      .sizing-choice--anchor .rsc-indicator {
        border-radius: 999px;
      }

      .sizing-choice--anchor .rsc-option-anchor {
        border-radius: 999px;
        box-shadow: none;
      }

      .sizing-choice--anchor .rsc-option:has(.sizing-anchor-label--low) .rsc-option-anchor {
        background: #0ea5e9;
      }

      .sizing-choice--anchor .rsc-option:has(.sizing-anchor-label--mid) .rsc-option-anchor {
        background: #6366f1;
      }

      .sizing-choice--anchor .rsc-option:has(.sizing-anchor-label--high) .rsc-option-anchor {
        background: #f97316;
      }

      .sizing-choice--selection {
        width: min(100%, 342px);
      }

      .sizing-choice--selection .rsc-list {
        width: min(100%, 342px);
      }

      .sizing-choice--selection .rsc-indicator {
        border-radius: 999px;
      }

      .sizing-choice--selection .rsc-option[data-selected="true"] .rsc-option-label,
      .sizing-choice--selection .rsc-option[data-previewed="true"] .rsc-option-label {
        color: #111827;
      }

      .sizing-var-map {
        display: grid;
        gap: 10px;
      }

      .sizing-var-row {
        display: grid;
        grid-template-columns: 150px 1fr;
        gap: 10px;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #e5ebf1;
      }

      .sizing-var-row:last-child {
        border-bottom: 0;
      }

      .contract-scene {
        display: grid;
        gap: 20px;
      }

      .contract-hero {
        display: grid;
        gap: 14px;
      }

      .contract-choice {
        width: min(100%, 400px);
        --rsc-padding: 0px;
        --rsc-track-size: 6px;
        --rsc-indicator-color: #7c3aed;
        --rsc-indicator-border-width: 3px;
        --rsc-focus-ring-color: rgba(124, 58, 237, 0.22);
      }

      .contract-choice .rsc-list {
        width: min(100%, 400px);
        justify-content: space-between;
      }

      .contract-choice .rsc-option {
        width: min(21vw, 86px);
        height: 88px;
      }

      .contract-choice .rsc-option-content {
        width: 100%;
        height: 100%;
        min-block-size: 0;
        padding: 0;
        overflow: visible;
      }

      .contract-choice .rsc-option-label {
        position: absolute;
        top: 64px;
        left: 50%;
        width: max-content;
        max-inline-size: none;
        transform: translateX(-50%);
        color: #64748b;
        font-size: 13px;
        font-weight: 650;
      }

      .contract-choice .rsc-track {
        background: linear-gradient(90deg, #dbe5ef 0%, #c5d2df 100%);
        border-radius: 999px;
        box-shadow: inset 0 0 0 1px rgba(100, 116, 139, 0.16);
      }

      .contract-choice .rsc-option-anchor {
        background: #d9e3ee;
        border-radius: 999px;
        box-shadow: inset 0 0 0 1px rgba(100, 116, 139, 0.2);
        transition:
          background-color 150ms ease,
          box-shadow 150ms ease,
          opacity 150ms ease;
      }

      .contract-choice.rsc-root .rsc-indicator {
        border-radius: 999px;
      }

      .contract-choice .rsc-option[data-selected="true"] .rsc-option-label {
        color: #4c1d95;
        font-weight: 760;
      }

      .contract-choice .rsc-option[data-selected="true"] .rsc-option-anchor {
        background: #ede9fe;
        box-shadow:
          inset 0 0 0 3px #7c3aed,
          0 0 0 7px rgba(124, 58, 237, 0.12);
      }

      .contract-choice.rsc-root[data-dragging="true"] .rsc-track {
        background: linear-gradient(90deg, #bbf7d0 0%, #ddd6fe 100%);
        box-shadow: inset 0 0 0 1px rgba(22, 163, 74, 0.22);
      }

      .contract-choice .rsc-option[data-previewed="true"] .rsc-option-label {
        color: #166534;
        font-weight: 760;
      }

      .contract-choice .rsc-option[data-previewed="true"] .rsc-option-anchor {
        background: #dcfce7;
        box-shadow:
          inset 0 0 0 3px #16a34a,
          0 0 0 7px rgba(22, 163, 74, 0.13);
      }

      .contract-choice.rsc-root[data-drag-released="true"] .rsc-indicator {
        animation: contract-release-pulse 180ms ease-out;
      }

      .contract-choice .rsc-option[data-disabled="true"] .rsc-option-anchor {
        background: #fed7aa;
        box-shadow: inset 0 0 0 2px #f97316;
        opacity: 0.74;
      }

      .contract-choice .rsc-option[data-disabled="true"] .rsc-option-label {
        color: #c2410c;
        opacity: 0.88;
      }

      @keyframes contract-release-pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.28);
        }

        100% {
          box-shadow: 0 0 0 12px rgba(124, 58, 237, 0);
        }
      }

      .contract-stack {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;
        align-items: start;
      }

      .contract-selector {
        display: grid;
        gap: 7px;
        padding: 12px;
        border: 1px solid #dce3ea;
        
        background: #ffffff;
      }

      .contract-legend {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }

      .contract-legend-card {
        display: grid;
        gap: 7px;
        min-width: 0;
        padding: 12px;
        border: 1px solid #dce3ea;
        background: #ffffff;
      }

      .contract-selector-title {
        color: #172033;
        font-size: 13px;
        font-weight: 760;
      }

      .contract-selector-copy {
        margin: 0;
        color: #5d6b7c;
        font-size: 12px;
        line-height: 1.5;
      }

      .contract-flow {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
      }

      .contract-flow-step {
        display: grid;
        gap: 5px;
        padding: 11px;
        border: 1px solid #dce3ea;
        background: #ffffff;
        color: #5d6b7c;
        font-size: 12px;
        line-height: 1.4;
      }

      .contract-flow-step strong {
        color: #172033;
        font-size: 12px;
      }

      @media (max-width: 1040px) {
        .indicator-map {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .surface-model-card {
          grid-template-columns: 1fr;
        }

        .surface-model-examples {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 860px) {
        .architecture-page {
          padding: 24px 16px;
        }

        .architecture-title {
          font-size: 26px;
        }

        .architecture-panel {
          padding: 18px;
        }

        .architecture-choice-wrap {
          padding: 14px;
        }

        .architecture-grid--two,
        .architecture-grid--three,
        .pipeline-flow,
        .sizing-scene,
        .surface-model-grid,
        .surface-model-note,
        .track-style-row,
        .contract-legend,
        .contract-flow,
        .contract-stack,
        .indicator-map {
          grid-template-columns: 1fr;
        }

        .surface-model-visual {
          overflow-x: auto;
        }

        .pipeline-choice,
        .track-choice,
        .axis-choice,
        .contract-choice {
          width: min(100%, 390px);
        }

        .pipeline-choice .rsc-list {
          width: 100%;
        }

        .pipeline-choice .rsc-list,
        .track-choice .rsc-list,
        .axis-choice .rsc-list,
        .contract-choice .rsc-list {
          width: 100%;
        }

        .indicator-choice,
        .sizing-choice--anchor,
        .sizing-choice--selection {
          width: 100%;
        }

        .pipeline-choice-wrap {
          align-content: center;
          gap: 8px;
          min-height: 300px;
        }

        .sizing-label {
          position: static;
          display: inline-flex;
          width: fit-content;
          margin-bottom: 6px;
          transform: none;
        }

        .sizing-var-row {
          grid-template-columns: 1fr;
        }

      }
    `}</style>
  );
}

function ArchitecturePage({
  children,
  compact = false,
  description,
  kicker,
  title,
}: {
  children: React.ReactNode;
  compact?: boolean;
  description: string;
  kicker: string;
  title: string;
}) {
  return (
    <div className="architecture-page">
      <ArchitectureStyles />
      <section className={`architecture-board${compact ? ' architecture-board--compact' : ''}`}>
        <header className="architecture-header">
          <span className="architecture-kicker">{kicker}</span>
          <h1 className="architecture-title">{title}</h1>
          <p className="architecture-copy">{description}</p>
        </header>
        {children}
      </section>
    </div>
  );
}

function CodeChip({ children }: { children: React.ReactNode }) {
  return <code className="architecture-code-chip">{children}</code>;
}

function CodeBlock({ children }: { children: string }) {
  return <pre className="architecture-code-block">{children}</pre>;
}

export const MentalModelPipeline: ArchitectureStory = {
  name: 'Mental Model Pipeline',
  render: function Render() {
    const [value, setValue] = useStoryValue('runtime');

    return (
      <ArchitecturePage
        kicker="Foundations"
        title="Geometry decides mechanics. CSS decides appearance."
        description="Use geometry for layout mechanics. Use CSS for appearance. Measured positions stay inside the component runtime stylesheet while consumers style public slots, state attrs and CSS variables."
      >
        <div className="pipeline-flow">
          <div className="architecture-panel pipeline-demo">
            <div className="architecture-choice-wrap pipeline-choice-wrap">
              <SegmentedChoice
                ariaLabel="Architecture layer"
                className="pipeline-choice"
                optionSizing="content"
                geometry={{
                  anchor: { size: 14 },
                  indicator: {
                    borderWidth: 3,
                    content: 'none',
                    size: 34,
                    style: 'ring',
                    transition: 'smooth',
                  },
                  mode: 'overlay',
                  track: { layout: 'center-span', style: 'surface' },
                }}
                onValueChange={setValue}
                options={modeOptions}
                value={value}
              />
              <div className="pipeline-summary">
                <div className="pipeline-summary-step">
                  <strong>Props describe intent</strong>
                  <span>
                    Options provide choices. Geometry describes how the selection should move.
                  </span>
                </div>
                <div className="pipeline-summary-step">
                  <strong>Runtime measures layout</strong>
                  <span>
                    The component positions the track and indicator from rendered option geometry.
                  </span>
                </div>
                <div className="pipeline-summary-step">
                  <strong>CSS paints the result</strong>
                  <span>Consumers theme public slots, state attrs and CSS variables.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pipeline-stack">
            <div className="pipeline-step">
              <div className="pipeline-step-header">
                <span>1. Geometry input</span>
                <CodeChip>geometry.track.layout</CodeChip>
              </div>
              <CodeBlock>{`geometry={{
  mode: 'overlay',
  track: { layout: 'center-span' },
  indicator: { style: 'ring', size: 34 }
}}`}</CodeBlock>
            </div>

            <div className="pipeline-step">
              <div className="pipeline-step-header">
                <span>2. Runtime layout</span>
                <CodeChip>component-owned layout</CodeChip>
              </div>
              <div className="architecture-chip-row">
                <CodeChip>geometry.mode: overlay</CodeChip>
                <CodeChip>track.layout: center-span</CodeChip>
                <CodeChip>indicator.style: ring</CodeChip>
                <CodeChip>indicator.size: 34</CodeChip>
                <CodeChip>anchor size</CodeChip>
              </div>
            </div>

            <div className="pipeline-step">
              <div className="pipeline-step-header">
                <span>3. CSS appearance</span>
                <CodeChip>public hooks</CodeChip>
              </div>
              <CodeBlock>{`.my-choice .rsc-indicator {
  border-color: var(--rsc-indicator-color);

  /* Paint changes here. Geometry stays component-owned. */
}`}</CodeBlock>
            </div>

            <div className="pipeline-step">
              <div className="pipeline-step-header">
                <span>4. Internal mechanics</span>
                <CodeChip>not theming API</CodeChip>
              </div>
              <p className="architecture-card-copy">
                Measured positions, transforms and track spans are emitted through the scoped
                runtime stylesheet. Treat those values as implementation mechanics. App CSS should
                use documented classes, attrs and public
                <CodeChip>--rsc-*</CodeChip> variables instead of internal runtime values.
              </p>
            </div>
          </div>
        </div>
      </ArchitecturePage>
    );
  },
};

export const TrackAsAxis: ArchitectureStory = {
  name: 'Track As Axis',
  render: function Render() {
    const [containerValue, setContainerValue] = useStoryValue('mid');
    const [axisValue, setAxisValue] = useStoryValue('mid');

    return (
      <ArchitecturePage
        kicker="Track system"
        title="Track layout changes measurement. Track style changes paint."
        description='The default `track.style: "surface"` paints the track. `track.layout` decides whether that surface fills the container or is measured between anchor centers. `track.style: "none"` keeps the same geometry without painting the track.'
      >
        <div className="architecture-grid architecture-grid--two track-comparison">
          <div className="architecture-panel track-scene">
            <div>
              <h2 className="architecture-card-title">Default surface</h2>
              <p className="architecture-card-copy">
                The common case uses surface paint and lets the track fill the control container.
              </p>
            </div>
            <div className="architecture-choice-wrap">
              <SegmentedChoice
                ariaLabel="Container track"
                className="track-choice"
                geometry={{
                  indicator: { style: 'fill' },
                  mode: 'underlay',
                  track: { layout: 'container', style: 'surface' },
                }}
                onValueChange={setContainerValue}
                options={rangeOptions}
                value={containerValue}
              />
            </div>
            <div className="architecture-chip-row">
              <CodeChip>track.style: "surface"</CodeChip>
              <CodeChip>track.layout: "container"</CodeChip>
            </div>
          </div>

          <div className="architecture-panel track-scene">
            <div>
              <h2 className="architecture-card-title">Center-span surface</h2>
              <p className="architecture-card-copy">
                The paint is still the default surface. Only the measured span changes: first anchor
                center to last anchor center.
              </p>
            </div>
            <div className="architecture-choice-wrap">
              <SegmentedChoice
                ariaLabel="Axis track"
                className="axis-choice"
                optionSizing="content"
                geometry={{
                  anchor: { size: 14 },
                  indicator: { size: 38, style: 'fill' },
                  mode: 'overlay',
                  track: { layout: 'center-span', style: 'surface' },
                }}
                onValueChange={setAxisValue}
                options={rangeOptions}
                value={axisValue}
              />
            </div>
            <div className="architecture-chip-row">
              <CodeChip>track.style: "surface"</CodeChip>
              <CodeChip>track.layout: "center-span"</CodeChip>
              <CodeChip>anchor.size: 14</CodeChip>
            </div>
          </div>
        </div>

        <div className="track-style-row">
          <div className="track-style-card">
            <div>
              <h2 className="architecture-card-title">Surface paint</h2>
              <p className="architecture-card-copy">
                `track.style: "surface"` is the default painted track, including with center-span
                measurement.
              </p>
            </div>
            <SegmentedChoice
              ariaLabel="Surface track paint"
              className="track-style-choice"
              optionSizing="content"
              geometry={{
                anchor: { size: 14 },
                indicator: { size: 34, style: 'fill' },
                mode: 'overlay',
                track: { layout: 'center-span', style: 'surface' },
              }}
              onValueChange={setAxisValue}
              options={rangeOptions}
              value={axisValue}
            />
            <div className="architecture-chip-row">
              <CodeChip>track.style: "surface"</CodeChip>
              <CodeChip>default paint</CodeChip>
            </div>
          </div>
          <div className="track-style-card">
            <div>
              <h2 className="architecture-card-title">No track paint</h2>
              <p className="architecture-card-copy">
                `track.style: "none"` leaves the same measured geometry, but the library does not
                paint the track surface.
              </p>
            </div>
            <SegmentedChoice
              ariaLabel="No track paint"
              className="track-style-choice"
              optionSizing="content"
              geometry={{
                anchor: { size: 14 },
                indicator: { size: 34, style: 'fill' },
                mode: 'overlay',
                track: { layout: 'center-span', style: 'none' },
              }}
              onValueChange={setAxisValue}
              options={rangeOptions}
              value={axisValue}
            />
            <div className="architecture-chip-row">
              <CodeChip>track.style: "none"</CodeChip>
              <CodeChip>geometry unchanged</CodeChip>
            </div>
          </div>
        </div>
      </ArchitecturePage>
    );
  },
};

export const SurfaceDistributionModel: ArchitectureStory = {
  name: 'Surface Distribution Model',
  render: function Render() {
    const [compactEqualValue, setCompactEqualValue] = useStoryValue('board');
    const [compactContentValue, setCompactContentValue] = useStoryValue('board');
    const [compactFixedValue, setCompactFixedValue] = useStoryValue('mid');
    const [wideEqualValue, setWideEqualValue] = useStoryValue('board');
    const [wideContentValue, setWideContentValue] = useStoryValue('board');
    const [wideFixedValue, setWideFixedValue] = useStoryValue('mid');
    const [equalAroundValue, setEqualAroundValue] = useStoryValue('board');

    return (
      <ArchitecturePage
        kicker="Option layout"
        title="Surface width is separate from option layout."
        description="optionSizing decides each option box. CSS decides whether the surface is compact or wide. optionDistribution only becomes visible when that surface has spare space."
      >
        <div className="surface-model-grid">
          <div className="surface-model-card">
            <div>
              <h2 className="architecture-card-title">default compact surface</h2>
              <p className="architecture-card-copy">
                With no explicit surface width, the control wraps its option boxes. Distribution is
                still part of the contract, but there is no spare space to see.
              </p>
            </div>
            <div className="surface-model-visual">
              <div className="surface-model-examples">
                <div className="surface-model-example">
                  <span className="surface-model-example-title">equal boxes</span>
                  <SegmentedChoice
                    ariaLabel="Compact equal option layout"
                    className="surface-choice surface-choice--compact"
                    onValueChange={setCompactEqualValue}
                    options={surfaceContentOptions}
                    value={compactEqualValue}
                  />
                </div>
                <div className="surface-model-example">
                  <span className="surface-model-example-title">content boxes</span>
                  <SegmentedChoice
                    ariaLabel="Compact content option layout"
                    className="surface-choice surface-choice--compact"
                    optionSizing="content"
                    onValueChange={setCompactContentValue}
                    options={surfaceContentOptions}
                    value={compactContentValue}
                  />
                </div>
                <div className="surface-model-example">
                  <span className="surface-model-example-title">fixed boxes</span>
                  <SegmentedChoice
                    ariaLabel="Compact fixed option layout"
                    className="surface-choice surface-choice--compact"
                    geometry={{
                      indicator: { style: 'fill' },
                      optionSize: 58,
                    }}
                    onValueChange={setCompactFixedValue}
                    options={rangeOptions}
                    value={compactFixedValue}
                  />
                </div>
              </div>
              <div className="surface-model-label-row">
                <span className="surface-model-label surface-model-label--width">
                  no explicit surface width
                </span>
                <span className="surface-model-label">surface wraps option boxes</span>
                <span className="surface-model-label">no visible extra gap</span>
              </div>
            </div>
            <div className="architecture-chip-row surface-model-chips">
              <CodeChip>optionSizing: equal</CodeChip>
              <CodeChip>optionSizing: content</CodeChip>
              <CodeChip>optionSize: fixed boxes</CodeChip>
              <CodeChip>optionDistribution: space-between</CodeChip>
            </div>
          </div>

          <div className="surface-model-card">
            <div>
              <h2 className="architecture-card-title">explicit wide surface + space-between</h2>
              <p className="architecture-card-copy">
                When consumer CSS gives the surface width, the same option boxes distribute across
                that space. Option sizing still decides the box dimensions.
              </p>
            </div>
            <div className="surface-model-visual">
              <div className="surface-model-examples">
                <div className="surface-model-example">
                  <span className="surface-model-example-title">equal boxes</span>
                  <SegmentedChoice
                    ariaLabel="Wide equal space-between option layout"
                    className="surface-choice surface-choice--wide"
                    onValueChange={setWideEqualValue}
                    options={surfaceContentOptions}
                    value={wideEqualValue}
                  />
                </div>
                <div className="surface-model-example">
                  <span className="surface-model-example-title">content boxes</span>
                  <SegmentedChoice
                    ariaLabel="Wide content space-between option layout"
                    className="surface-choice surface-choice--wide"
                    optionSizing="content"
                    onValueChange={setWideContentValue}
                    options={surfaceContentOptions}
                    value={wideContentValue}
                  />
                </div>
                <div className="surface-model-example">
                  <span className="surface-model-example-title">fixed boxes</span>
                  <SegmentedChoice
                    ariaLabel="Wide fixed space-between option layout"
                    className="surface-choice surface-choice--wide"
                    geometry={{
                      indicator: { style: 'fill' },
                      optionSize: 58,
                    }}
                    onValueChange={setWideFixedValue}
                    options={rangeOptions}
                    value={wideFixedValue}
                  />
                </div>
              </div>
              <div className="surface-model-label-row">
                <span className="surface-model-label surface-model-label--width">
                  explicit wide surface
                </span>
                <span className="surface-model-label">option boxes keep their sizing mode</span>
                <span className="surface-model-label">space-between gaps</span>
              </div>
            </div>
            <div className="architecture-chip-row surface-model-chips">
              <CodeChip>optionSizing: equal</CodeChip>
              <CodeChip>optionSizing: content</CodeChip>
              <CodeChip>optionSize: fixed boxes</CodeChip>
              <CodeChip>optionDistribution: space-between</CodeChip>
              <CodeChip>optionSize: 58</CodeChip>
            </div>
          </div>

          <div className="surface-model-card">
            <div>
              <h2 className="architecture-card-title">explicit wide surface + space-around</h2>
              <p className="architecture-card-copy">
                space-around changes placement only. The option boxes are still equal, content, or
                fixed based on option sizing.
              </p>
            </div>
            <div className="surface-model-visual">
              <SegmentedChoice
                ariaLabel="Wide equal space-around option layout"
                className="surface-choice surface-choice--wide"
                optionDistribution="space-around"
                onValueChange={setEqualAroundValue}
                options={surfaceContentOptions}
                value={equalAroundValue}
              />
              <div className="surface-model-label-row">
                <span className="surface-model-label surface-model-label--width">
                  explicit wide surface
                </span>
                <span className="surface-model-label">same equal option boxes</span>
                <span className="surface-model-label">space-around gaps</span>
              </div>
            </div>
            <div className="architecture-chip-row surface-model-chips">
              <CodeChip>optionSizing: equal</CodeChip>
              <CodeChip>optionDistribution: space-around</CodeChip>
            </div>
          </div>
        </div>

        <div className="architecture-panel surface-model-note">
          <div>
            <h2 className="architecture-card-title">The contract</h2>
            <p className="architecture-card-copy">
              Default controls are compact because no width is assigned. If CSS makes the surface
              wider, optionDistribution decides how already-sized option boxes use that extra space.
            </p>
          </div>
          <CodeBlock>{`<SegmentedChoice
  optionSizing="equal"
  optionDistribution="space-around"
/>

equal = shared option box size
space-around = placement when the surface has spare width`}</CodeBlock>
        </div>
      </ArchitecturePage>
    );
  },
};

export const IndicatorModesMap: ArchitectureStory = {
  name: 'Indicator Modes Map',
  render: function Render() {
    const [underlayValue, setUnderlayValue] = useStoryValue('visual');
    const [overlayValue, setOverlayValue] = useStoryValue('visual');
    const [ringValue, setRingValue] = useStoryValue('visual');
    const [noneValue, setNoneValue] = useStoryValue('visual');
    const [cloneValue, setCloneValue] = useStoryValue('visual');
    const [instantValue, setInstantValue] = useStoryValue('from');

    return (
      <ArchitecturePage
        kicker="Indicator system"
        title="One moving geometry, several visual contracts."
        description="The indicator is always driven by selection geometry. Mode changes its layer, style changes its paint, content can clone the active option and transition controls geometry motion."
      >
        <div className="indicator-map">
          <div className="architecture-note architecture-note--prose indicator-note">
            <strong>Paint modes do not own selection.</strong>
            <p>
              <code className="architecture-inline-code">fill</code>,{' '}
              <code className="architecture-inline-code">ring</code> and{' '}
              <code className="architecture-inline-code">none</code> change how the selected
              geometry is painted. The selected value and measured geometry stay the same contract.
            </p>
          </div>

          <div className="indicator-cell">
            <div className="indicator-cell-heading">
              <strong>underlay + fill</strong>
              <span>Classic selected background under option content.</span>
            </div>
            <SegmentedChoice
              ariaLabel="Underlay fill"
              className="indicator-choice"
              geometry={{
                indicator: { style: 'fill' },
                mode: 'underlay',
              }}
              onValueChange={setUnderlayValue}
              options={formatOptions}
              value={underlayValue}
            />
            <CodeChip>geometry.mode: underlay</CodeChip>
          </div>

          <div className="indicator-cell">
            <div className="indicator-cell-heading">
              <strong>overlay + fill</strong>
              <span>A handle above options. Useful for slider-like controls.</span>
            </div>
            <SegmentedChoice
              ariaLabel="Overlay fill"
              className="indicator-choice indicator-choice--centered"
              optionSizing="content"
              geometry={{
                anchor: { size: 12 },
                indicator: { size: 38, style: 'fill' },
                mode: 'overlay',
                track: { layout: 'center-span', style: 'surface' },
              }}
              onValueChange={setOverlayValue}
              options={formatOptions}
              value={overlayValue}
            />
            <CodeChip>geometry.mode: overlay</CodeChip>
          </div>

          <div className="indicator-cell">
            <div className="indicator-cell-heading">
              <strong>overlay + ring</strong>
              <span>The same geometry with transparent fill and a visible border.</span>
            </div>
            <SegmentedChoice
              ariaLabel="Overlay ring"
              className="indicator-choice indicator-choice--centered"
              optionSizing="content"
              geometry={{
                anchor: { size: 12 },
                indicator: { borderWidth: 3, size: 40, style: 'ring' },
                mode: 'overlay',
                track: { layout: 'center-span', style: 'surface' },
              }}
              onValueChange={setRingValue}
              options={formatOptions}
              value={ringValue}
            />
            <CodeChip>indicator.style: ring</CodeChip>
          </div>

          <div className="indicator-cell">
            <div className="indicator-cell-heading">
              <strong>none</strong>
              <span>
                The library indicator is not painted. This card colors the selected option with CSS.
              </span>
            </div>
            <SegmentedChoice
              ariaLabel="No indicator"
              className="indicator-choice indicator-choice--no-indicator"
              geometry={{
                indicator: { style: 'none' },
              }}
              onValueChange={setNoneValue}
              options={formatOptions}
              value={noneValue}
            />
            <CodeChip>indicator.style: none</CodeChip>
            <CodeBlock>{`.rsc-option[data-selected="true"] .rsc-option-content {
  background: #e0f2fe;
  color: #075985;
}`}</CodeBlock>
          </div>

          <div className="indicator-cell">
            <div className="indicator-cell-heading">
              <strong>clone-active</strong>
              <span>Overlay indicator carries the selected option content as a value capsule.</span>
            </div>
            <SegmentedChoice
              ariaLabel="Clone active"
              className="indicator-choice indicator-choice--clone"
              optionSizing="content"
              geometry={{
                indicator: { content: 'clone-active', style: 'fill' },
                mode: 'overlay',
              }}
              onValueChange={setCloneValue}
              options={formatOptions}
              value={cloneValue}
            />
            <CodeChip>indicator.content: clone-active</CodeChip>
          </div>

          <div className="indicator-cell">
            <div className="indicator-cell-heading">
              <strong>transition</strong>
              <span>Same selected geometry, different movement policy.</span>
            </div>
            <div className="transition-compare">
              <div className="transition-panel">
                <span className="transition-panel-label">smooth default</span>
                <SegmentedChoice
                  ariaLabel="Smooth indicator"
                  className="transition-choice"
                  geometry={{
                    indicator: { style: 'fill', transition: 'smooth' },
                  }}
                  onValueChange={setInstantValue}
                  options={transitionOptions}
                  value={instantValue}
                />
              </div>
              <div className="transition-panel">
                <span className="transition-panel-label">instant opt-out</span>
                <SegmentedChoice
                  ariaLabel="Instant indicator"
                  className="transition-choice"
                  geometry={{
                    indicator: { style: 'fill', transition: 'instant' },
                  }}
                  onValueChange={setInstantValue}
                  options={transitionOptions}
                  value={instantValue}
                />
              </div>
            </div>
            <div className="architecture-chip-row">
              <CodeChip>indicator.transition: smooth</CodeChip>
              <CodeChip>indicator.transition: instant</CodeChip>
            </div>
          </div>
        </div>
      </ArchitecturePage>
    );
  },
};

export const GeometrySizing: ArchitectureStory = {
  name: 'Geometry Sizing',
  render: function Render() {
    const [optionValue, setOptionValue] = useStoryValue('mid');
    const [anchorValue, setAnchorValue] = useStoryValue('mid');
    const [selectionValue, setSelectionValue] = useStoryValue('visual');

    return (
      <ArchitecturePage
        kicker="Geometry sizing"
        title="Sizing props change what the component measures."
        description="Use optionSize for fixed option boxes, anchor width and height for compact measurement targets and indicator width and height for fixed selection geometry. The measured layout details stay component-owned."
      >
        <div className="sizing-scene">
          <div className="sizing-stack">
            <div className="sizing-row">
              <h2 className="architecture-card-title">Option size</h2>
              <div className="sizing-visual">
                <span className="sizing-label">option box</span>
                <SegmentedChoice
                  ariaLabel="Option size"
                  className="sizing-choice sizing-choice--option"
                  optionSizing="content"
                  geometry={{
                    indicator: { style: 'fill' },
                    optionSize: 58,
                  }}
                  onValueChange={setOptionValue}
                  options={rangeOptions}
                  value={optionValue}
                />
              </div>
              <div className="architecture-chip-row">
                <CodeChip>optionSize: 58</CodeChip>
                <CodeChip>58w x 58h option box</CodeChip>
                <CodeChip>fixed option geometry</CodeChip>
              </div>
            </div>

            <div className="sizing-row">
              <h2 className="architecture-card-title">Anchor size</h2>
              <div className="sizing-visual">
                <span className="sizing-label">anchor target</span>
                <SegmentedChoice
                  ariaLabel="Anchor size"
                  className="sizing-choice sizing-choice--anchor"
                  optionSizing="content"
                  geometry={{
                    anchor: { height: 18, width: 44 },
                    indicator: { borderWidth: 3, height: 34, style: 'ring', width: 62 },
                    mode: 'overlay',
                    track: { layout: 'center-span', style: 'surface' },
                  }}
                  onValueChange={setAnchorValue}
                  options={[
                    {
                      value: 'low',
                      label: <span className="sizing-anchor-label--low">Low</span>,
                      accentColor: '#0ea5e9',
                    },
                    {
                      value: 'mid',
                      label: <span className="sizing-anchor-label--mid">Mid</span>,
                      accentColor: '#6366f1',
                    },
                    {
                      value: 'high',
                      label: <span className="sizing-anchor-label--high">High</span>,
                      accentColor: '#f97316',
                    },
                  ]}
                  value={anchorValue}
                />
              </div>
              <div className="architecture-chip-row">
                <CodeChip>anchor: 44w x 18h</CodeChip>
                <CodeChip>ring indicator: 62w x 34h</CodeChip>
                <CodeChip>explicit anchor geometry</CodeChip>
                <CodeChip>fixed indicator geometry</CodeChip>
              </div>
            </div>

            <div className="sizing-row">
              <h2 className="architecture-card-title">Fixed selection size</h2>
              <div className="sizing-visual">
                <SegmentedChoice
                  ariaLabel="Selection size"
                  className="sizing-choice sizing-choice--selection"
                  geometry={{
                    indicator: { height: 28, style: 'fill', width: 56 },
                    mode: 'underlay',
                  }}
                  onValueChange={setSelectionValue}
                  options={formatOptions}
                  value={selectionValue}
                />
              </div>
              <div className="architecture-chip-row">
                <CodeChip>indicator: 56w x 28h</CodeChip>
                <CodeChip>fixed indicator geometry</CodeChip>
              </div>
            </div>
          </div>

          <div className="architecture-panel sizing-var-map">
            <h2 className="architecture-card-title">Sizing props map</h2>
            <div className="sizing-var-row">
              <CodeChip>geometry.optionSize</CodeChip>
              <span className="architecture-card-copy">
                Sets fixed square option boxes while measurement details stay internal.
              </span>
            </div>
            <div className="sizing-var-row">
              <CodeChip>geometry.anchor</CodeChip>
              <span className="architecture-card-copy">
                Sets explicit measurement targets for overlay handles and center-span tracks.
              </span>
            </div>
            <div className="sizing-var-row">
              <CodeChip>geometry.indicator size</CodeChip>
              <span className="architecture-card-copy">
                Sets a fixed indicator size. CSS still styles public slots, not internal layout
                values.
              </span>
            </div>
            <CodeBlock>{`.my-choice .rsc-indicator {
  border-radius: 999px;
}

.my-choice .rsc-option-anchor {
  border-radius: 999px;
  background: currentColor;
}`}</CodeBlock>
          </div>
        </div>
      </ArchitecturePage>
    );
  },
};

export const DataAttrStylingContract: ArchitectureStory = {
  name: 'Data Attr Styling Contract',
  render: function Render() {
    const [value, setValue] = useStoryValue('visual');

    return (
      <ArchitecturePage
        compact
        kicker="CSS-first customization"
        title="Attrs are the bridge from runtime state to external CSS."
        description="Committed value, disabled options and pointer drag state appear as stable data attributes. Consumer CSS reads those attrs and paints the visible state while internal runtime variables stay private."
      >
        <div className="contract-scene">
          <div className="architecture-panel contract-hero">
            <div className="architecture-choice-wrap">
              <SegmentedChoice
                ariaLabel="Data attribute styling contract"
                className="contract-choice"
                optionSizing="content"
                draggable
                geometry={{
                  anchor: { height: 18, width: 44 },
                  indicator: {
                    borderWidth: 3,
                    height: 42,
                    style: 'ring',
                    transition: 'smooth',
                    width: 72,
                  },
                  mode: 'overlay',
                  track: { layout: 'center-span', style: 'surface' },
                }}
                onValueChange={setValue}
                options={[
                  { value: 'text', label: 'Text' },
                  { value: 'visual', label: 'Visual' },
                  { value: 'code', label: 'Code' },
                  { value: 'locked', label: 'Locked', disabled: true },
                ]}
                value={value}
              />
            </div>
            <div className="contract-legend">
              <div className="contract-legend-card">
                <span className="contract-selector-title">Root attrs</span>
                <div className="architecture-chip-row">
                  <CodeChip>data-dragging</CodeChip>
                  <CodeChip>data-drag-released</CodeChip>
                </div>
              </div>
              <div className="contract-legend-card">
                <span className="contract-selector-title">Option attrs</span>
                <div className="architecture-chip-row">
                  <CodeChip>data-selected</CodeChip>
                  <CodeChip>data-disabled</CodeChip>
                  <CodeChip>data-previewed</CodeChip>
                </div>
              </div>
              <div className="contract-legend-card">
                <span className="contract-selector-title">Geometry props</span>
                <p className="contract-selector-copy">
                  Geometry props choose the mechanics. Classes, CSS variables and state attrs are
                  the public styling hooks.
                </p>
              </div>
            </div>
          </div>

          <div className="contract-flow">
            <div className="contract-flow-step">
              <strong>React value</strong>
              selected option changes
            </div>
            <div className="contract-flow-step">
              <strong>DOM attrs</strong>
              root and option attrs update
            </div>
            <div className="contract-flow-step">
              <strong>CSS selector</strong>
              stable hooks match
            </div>
            <div className="contract-flow-step">
              <strong>Visual result</strong>
              CSS paints the state
            </div>
          </div>

          <div className="contract-stack">
            <div className="contract-selector">
              <span className="contract-selector-title">Selected state</span>
              <CodeBlock>{`.contract-choice
  .rsc-option[data-selected="true"]
  .rsc-option-label {
  color: #4c1d95;
  font-weight: 760;
}

.contract-choice
  .rsc-option[data-selected="true"]
  .rsc-option-anchor {
  background: #ede9fe;
  box-shadow: inset 0 0 0 3px #7c3aed;
}`}</CodeBlock>
            </div>

            <div className="contract-selector">
              <span className="contract-selector-title">Disabled state</span>
              <p className="contract-selector-copy">
                Disabled is not only a prop. Each disabled option also exposes a stable option attr
                that CSS can target.
              </p>
              <CodeBlock>{`.contract-choice
  .rsc-option[data-disabled="true"]
  .rsc-option-label {
  color: #c2410c;
  opacity: 0.88;
}

.contract-choice
  .rsc-option[data-disabled="true"]
  .rsc-option-anchor {
  background: #fed7aa;
  box-shadow: inset 0 0 0 2px #f97316;
}`}</CodeBlock>
            </div>

            <div className="contract-selector">
              <span className="contract-selector-title">Interaction state</span>
              <p className="contract-selector-copy">
                During pointer drag, root and option attrs describe the live preview before release
                commits the next value.
              </p>
              <CodeBlock>{`.contract-choice.rsc-root[data-dragging="true"]
  .rsc-track {
  background: linear-gradient(90deg, #bbf7d0, #ddd6fe);
}

.contract-choice
  .rsc-option[data-previewed="true"]
  .rsc-option-label {
  color: #166534;
  font-weight: 760;
}

.contract-choice.rsc-root[data-drag-released="true"]
  .rsc-indicator {
  animation: contract-release-pulse 180ms ease-out;
}`}</CodeBlock>
            </div>
          </div>
          <div className="architecture-note architecture-note--prose">
            <strong>Styling boundary</strong>
            <p>Use stable attrs and classes for state styling, not internal runtime values.</p>
          </div>
        </div>
      </ArchitecturePage>
    );
  },
};

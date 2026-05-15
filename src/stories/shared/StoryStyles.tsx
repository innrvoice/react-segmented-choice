import React from 'react';

import { SEGMENTED_CHOICE_FONT_FAMILY } from '../../index';

export const baseStoryStyles = `
  /* Shared shell and primitives */
  .demo-story-shell {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 32px 24px;
    box-sizing: border-box;
    background: #fff;
    color: #777;
    font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
  }

  .demo-story-shell--compact {
    min-height: auto;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .demo-story-shell--reference {
    padding: 24px 20px;
  }

  .demo-story-stage {
    display: grid;
    gap: 24px;
    justify-items: center;
  }

  .demo-story-shell--reference .demo-story-stage {
    gap: 18px;
  }

  .demo-choice-stack {
    display: grid;
    gap: 18px;
    justify-items: start;
  }

  .demo-story-shell--reference .demo-choice-stack {
    gap: 14px;
  }

  .demo-selection-readout {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.35rem 0.5rem;
    color: #666;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  .demo-story-shell--reference .demo-selection-readout {
    gap: 0.45rem;
    padding: 0.28rem 0.45rem;
    font-size: 0.74rem;
  }

  .demo-selection-readout code {
    padding: 0.2rem 0.45rem;
    background: #f1f1f1;
    color: #444;
    font-size: 0.92em;
    letter-spacing: 0.04em;
  }

  .demo-customization-shell,
  .demo-customization-stage {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    color: #777;
    font-family: ${SEGMENTED_CHOICE_FONT_FAMILY};
  }

  .demo-customization-shell--compact {
    min-height: auto;
    padding: 24px 20px;
    box-sizing: border-box;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .demo-customization-stage,
  .demo-customization-board {
    display: grid;
    gap: 32px;
    justify-items: center;
    padding: 24px 0;
  }

  .demo-customization-shell--compact .demo-customization-stage {
    gap: 24px;
    padding: 0;
  }

  .demo-customization-pair {
    display: grid;
    gap: 64px;
    justify-items: center;
  }

  .demo-customization-row,
  .demo-customization-board-row {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .demo-customization-pill-surface,
  .demo-customization-surface {
    width: 270px;
    height: 70px;
    border-radius: 35px;
    background: #eee;
    display: flex;
    justify-content: center;
    align-items: center;
  }

`;

export function StoryStyles() {
  return <style>{baseStoryStyles}</style>;
}

export function StoryShell({
  children,
  compact = false,
  reference = true,
}: {
  children: React.ReactNode;
  compact?: boolean;
  reference?: boolean;
}) {
  return (
    <>
      <StoryStyles />
      <div
        className={`demo-story-shell${compact ? ' demo-story-shell--compact' : ''}${reference ? ' demo-story-shell--reference' : ''}`}
      >
        <div className="demo-story-stage">{children}</div>
      </div>
    </>
  );
}

export function CustomizationShell({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <>
      <StoryStyles />
      <div
        className={`demo-customization-shell${compact ? ' demo-customization-shell--compact' : ''}`}
      >
        <div className="demo-customization-stage">{children}</div>
      </div>
    </>
  );
}

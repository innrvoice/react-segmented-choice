import { readFileSync } from 'node:fs';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react';
import { expect, it, vi } from 'vitest';

import {
  getFirstEnabledValue,
  getNonTextOptionsMissingAriaLabel,
  hasReadableTextLabel,
  isSelectableValue,
  stringifyValue,
  validateOptionsStructure,
} from '../internal/validation';
import { SegmentedChoice } from '../SegmentedChoice';
import {
  __resetSegmentedChoiceWarnings,
  warnInvalidDefaultValue,
  warnMissingAriaLabel,
} from '../SegmentedChoice.warnings';
import {
  SEGMENTED_CHOICE_COLOR_TOKENS,
  SEGMENTED_CHOICE_FONT_FAMILY,
  SEGMENTED_CHOICE_SIZE_TOKENS,
  SEGMENTED_CHOICE_TYPOGRAPHY_TOKENS,
  getSegmentedChoiceColorTokens,
  getSegmentedChoiceSizeTokens,
  getSegmentedChoiceTypographyTokens,
} from '../tokens';
import {
  baseOptions,
  getCssVar,
  getRadio,
  getRuntimeStyleElement,
  getRuntimeStyleElements,
  getRuntimeStyleRuleFor,
} from './SegmentedChoice.test.shared';

const segmentedChoiceCss = readFileSync('src/SegmentedChoice/SegmentedChoice.css', 'utf8');

export function registerSegmentedChoiceStateContractSuite() {
  it('keeps the design token helpers aligned with the exported token objects', () => {
    expect(SEGMENTED_CHOICE_FONT_FAMILY).toContain('-apple-system');
    expect(getSegmentedChoiceTypographyTokens()).toBe(SEGMENTED_CHOICE_TYPOGRAPHY_TOKENS);
    expect(getSegmentedChoiceTypographyTokens().fontSizes).toEqual({
      sm: '12px',
      md: '14px',
      lg: '16px',
    });
    expect(getSegmentedChoiceColorTokens()).toBe(SEGMENTED_CHOICE_COLOR_TOKENS);
    expect(getSegmentedChoiceColorTokens()).toMatchObject({
      accent: '#E6E8EC',
      surface: '#F5F7FA',
      text: '#1A1D23',
    });
    expect(getSegmentedChoiceSizeTokens('sm')).toBe(SEGMENTED_CHOICE_SIZE_TOKENS.sm);
    expect(getSegmentedChoiceSizeTokens('md')).toMatchObject({
      containerOffset: '4px',
      fontSize: '14px',
      optionRadius: '7px',
    });
    expect(getSegmentedChoiceSizeTokens('lg')).toMatchObject({
      containerOffset: '6px',
      fontSize: '16px',
      optionMinSize: '40px',
    });
  });

  it('validates option values and readable labels through the shared validation helpers', () => {
    const options = [
      { value: 'day', label: 'Day', disabled: true },
      { value: 'week', label: <span>Week</span> },
      { value: 'month', label: <span aria-hidden /> },
      { value: 'year', label: <span aria-hidden />, ariaLabel: 'Year' },
    ] as const;

    expect(stringifyValue(Symbol.for('range'))).toBe('Symbol(range)');
    expect(hasReadableTextLabel('  ')).toBe(false);
    expect(hasReadableTextLabel(42)).toBe(true);
    expect(hasReadableTextLabel([null, <span key="label">Readable</span>])).toBe(true);
    expect(hasReadableTextLabel(<span aria-hidden />)).toBe(false);
    expect(getFirstEnabledValue(options)).toBe('week');
    expect(isSelectableValue(options, undefined)).toBe(false);
    expect(isSelectableValue(options, 'day')).toBe(false);
    expect(isSelectableValue(options, 'week')).toBe(true);
    expect(getNonTextOptionsMissingAriaLabel(options)).toEqual(['month']);
    expect(validateOptionsStructure(options)).toEqual({
      valid: true,
      firstEnabledValue: 'week',
    });
    expect(
      validateOptionsStructure([
        { value: 'day', label: 'Day' },
        { value: 'day', label: 'Duplicate day' },
        { value: 1, label: 'Invalid' },
      ] as unknown as typeof options)
    ).toEqual({
      valid: false,
      duplicateValues: ['day'],
      invalidValueIndexes: [2],
      optionCount: 3,
    });
  });

  it('deduplicates development warnings and suppresses them in production', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const previousNodeEnv = process.env.NODE_ENV;

    try {
      __resetSegmentedChoiceWarnings();
      warnInvalidDefaultValue('missing');
      warnInvalidDefaultValue('missing');
      warnMissingAriaLabel('icon');

      expect(warn).toHaveBeenCalledTimes(2);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('defaultValue "missing"'));
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Option "icon"'));

      __resetSegmentedChoiceWarnings();
      process.env.NODE_ENV = 'production';
      warnInvalidDefaultValue('production-missing');

      expect(warn).toHaveBeenCalledTimes(2);
    } finally {
      if (previousNodeEnv === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = previousNodeEnv;
      }
      __resetSegmentedChoiceWarnings();
    }
  });

  it('keeps controlled state stable until the parent updates', () => {
    const onValueChange = vi.fn();

    render(
      <SegmentedChoice
        ariaLabel="Range"
        onValueChange={onValueChange}
        options={baseOptions}
        value="day"
      />
    );

    fireEvent.click(getRadio('Week'));

    expect(onValueChange).toHaveBeenCalledWith('week');
    expect((getRadio('Day') as HTMLInputElement).checked).toBe(true);
    expect((getRadio('Week') as HTMLInputElement).checked).toBe(false);
  });

  it('initializes uncontrolled state from defaultValue', () => {
    render(<SegmentedChoice ariaLabel="Range" defaultValue="week" options={baseOptions} />);

    expect((getRadio('Week') as HTMLInputElement).checked).toBe(true);
  });

  it('falls back to the first enabled option when defaultValue is invalid', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue={'missing' as 'day'}
        options={[
          { value: 'day', label: 'Day', disabled: true },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]}
      />
    );

    expect((getRadio('Week') as HTMLInputElement).checked).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('renders with no selected option and warns for an invalid controlled value', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" options={baseOptions} value={'missing' as 'day'} />
    );

    expect(screen.getAllByRole('radio').every(radio => !(radio as HTMLInputElement).checked)).toBe(
      true
    );
    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    expect(getRuntimeStyleRuleFor(root)).toContain('--_rsc-indicator-opacity: 0;');
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('warns and renders nothing when option values are duplicated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <SegmentedChoice
        ariaLabel="Range"
        options={[
          { value: 'day', label: 'Day' },
          { value: 'day', label: 'Duplicate Day' },
          { value: 'week', label: 'Week' },
        ]}
      />
    );

    expect(screen.queryByRole('radiogroup')).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('warns and renders nothing when fewer than two options are provided', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<SegmentedChoice ariaLabel="Range" options={[{ value: 'day', label: 'Day' }]} />);

    expect(screen.queryByRole('radiogroup')).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('warns and renders nothing when option values are not strings', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <SegmentedChoice
        ariaLabel="Range"
        options={
          [
            { value: 'day', label: 'Day' },
            { value: 1, label: 'Week' },
          ] as unknown as React.ComponentProps<typeof SegmentedChoice>['options']
        }
      />
    );

    expect(screen.queryByRole('radiogroup')).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('option values must be strings'));
  });

  it('warns when the radiogroup has no accessible group label', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<SegmentedChoice options={baseOptions} />);

    screen.getByRole('radiogroup');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('requires either ariaLabel or ariaLabelledby')
    );
  });

  it('warns when controlled and uncontrolled usage are mixed after mount', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = render(
      <SegmentedChoice ariaLabel="Range" options={baseOptions} value="day" />
    );

    rerender(<SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />);

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('changed to uncontrolled mode'));
  });

  it('restores the last uncontrolled selection when re-entering uncontrolled mode', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = render(
      <SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />
    );

    fireEvent.click(getRadio('Week'));
    expect((getRadio('Week') as HTMLInputElement).checked).toBe(true);

    rerender(<SegmentedChoice ariaLabel="Range" options={baseOptions} value="month" />);
    expect((getRadio('Month') as HTMLInputElement).checked).toBe(true);

    rerender(<SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />);

    expect((getRadio('Week') as HTMLInputElement).checked).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('changed to controlled mode'));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('changed to uncontrolled mode'));
  });

  it('keeps description ids unique even when multiple controls share the same name', () => {
    const describedOptions = [
      { value: 'day', label: 'Day', description: 'Today' },
      { value: 'week', label: 'Week', description: 'This week' },
    ] as const;

    render(
      <>
        <SegmentedChoice
          ariaLabel="Primary range"
          defaultValue="day"
          name="shared-range"
          options={describedOptions}
        />
        <SegmentedChoice
          ariaLabel="Secondary range"
          defaultValue="week"
          name="shared-range"
          options={describedOptions}
        />
      </>
    );

    const descriptionIds = Array.from(document.querySelectorAll('.rsc-option-description'))
      .map(node => node.id)
      .filter(Boolean);
    const describedByValues = screen
      .getAllByRole('radio')
      .map(radio => radio.getAttribute('aria-describedby'))
      .filter((value): value is string => Boolean(value));

    expect(new Set(descriptionIds).size).toBe(descriptionIds.length);
    expect(new Set(describedByValues).size).toBe(describedByValues.length);
  });

  it('includes the selected value in FormData', () => {
    render(
      <form data-testid="form">
        <SegmentedChoice ariaLabel="Range" defaultValue="week" name="range" options={baseOptions} />
      </form>
    );

    const form = screen.getByTestId('form') as HTMLFormElement;
    const formData = new FormData(form);

    expect(formData.get('range')).toBe('week');
  });

  it('resets uncontrolled selection back to its initial value when the parent form resets', async () => {
    render(
      <form data-testid="form">
        <SegmentedChoice ariaLabel="Range" defaultValue="week" name="range" options={baseOptions} />
      </form>
    );

    fireEvent.click(getRadio('Month'));
    expect((getRadio('Month') as HTMLInputElement).checked).toBe(true);

    const form = screen.getByTestId('form') as HTMLFormElement;
    act(() => {
      form.reset();
    });

    await waitFor(() => {
      expect((getRadio('Week') as HTMLInputElement).checked).toBe(true);
    });
  });

  it('keeps size presets in CSS instead of injecting public tokens inline', () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" options={baseOptions} size="sm" />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const runtimeStyle = getRuntimeStyleElement() as HTMLStyleElement;

    expect(root.dataset.size).toBe('sm');
    expect(root.hasAttribute('style')).toBe(false);
    expect(runtimeStyle.textContent).not.toContain('--rsc-font-family');
    expect(runtimeStyle.textContent).not.toContain('--rsc-font-size');
    expect(runtimeStyle.textContent).not.toContain('--rsc-option-padding-block');
    expect(runtimeStyle.textContent).not.toContain('--rsc-container-offset');
  });

  it('suppresses native mobile tap highlight by default with a CSS opt-in hook', () => {
    expect(segmentedChoiceCss).toContain(
      '-webkit-tap-highlight-color: var(--rsc-tap-highlight-color, transparent);'
    );
  });

  it('uses internal option sizing and distribution routing attrs', () => {
    const { container: defaultContainer } = render(
      <SegmentedChoice ariaLabel="Default range" options={baseOptions} />
    );
    const { container: contentContainer } = render(
      <SegmentedChoice ariaLabel="Content range" options={baseOptions} optionSizing="content" />
    );
    const { container: aroundContainer } = render(
      <SegmentedChoice
        ariaLabel="Around range"
        options={baseOptions}
        optionDistribution="space-around"
      />
    );
    const { container: fixedContainer } = render(
      <SegmentedChoice ariaLabel="Range" options={baseOptions} geometry={{ optionSize: 58 }} />
    );

    const defaultRoot = defaultContainer.querySelector('.rsc-root') as HTMLDivElement;
    const contentRoot = contentContainer.querySelector('.rsc-root') as HTMLDivElement;
    const aroundRoot = aroundContainer.querySelector('.rsc-root') as HTMLDivElement;
    const fixedRoot = fixedContainer.querySelector('.rsc-root') as HTMLDivElement;
    const equalContentIndex = segmentedChoiceCss.indexOf(
      ".rsc-root[data-rsc-option-sizing='equal'] .rsc-option-content"
    );
    const equalOptionIndex = segmentedChoiceCss.indexOf(
      ".rsc-root[data-rsc-option-sizing='equal'] .rsc-option {\n  width:"
    );
    const fixedContentIndex = segmentedChoiceCss.indexOf(
      ".rsc-root[data-rsc-option-sizing='fixed'] .rsc-option-content"
    );
    const fixedOptionIndex = segmentedChoiceCss.indexOf(
      ".rsc-root[data-rsc-option-sizing='fixed'] .rsc-option {\n  width:"
    );

    expect(defaultRoot.dataset.rscOptionSizing).toBe('equal');
    expect(defaultRoot.dataset.rscOptionDistribution).toBe('space-between');
    expect(contentRoot.dataset.rscOptionSizing).toBe('content');
    expect(aroundRoot.dataset.rscOptionDistribution).toBe('space-around');
    expect(fixedRoot.dataset.rscOptionSizing).toBe('fixed');
    expect(fixedRoot.dataset.rscAnchorSizing).toBe('fill');
    expect(equalOptionIndex).toBeGreaterThan(-1);
    expect(equalContentIndex).toBeGreaterThan(-1);
    expect(fixedOptionIndex).toBeGreaterThan(equalOptionIndex);
    expect(fixedContentIndex).toBeGreaterThan(equalContentIndex);
    expect(segmentedChoiceCss).toContain(
      ".rsc-root[data-rsc-option-distribution='space-between'] .rsc-list {\n  justify-content: space-between;\n}"
    );
    expect(segmentedChoiceCss).toContain(
      ".rsc-root[data-rsc-option-distribution='space-around'] .rsc-list {\n  justify-content: space-around;\n}"
    );
    expect(segmentedChoiceCss).toContain(".rsc-root[data-rsc-option-sizing='equal'] .rsc-option");
  });

  it('keeps overlay fill hover accent-stable unless a public hover override is provided', () => {
    expect(segmentedChoiceCss).not.toContain('--rsc-indicator-hover-bg: #e3e5e9;');
    expect(segmentedChoiceCss).toContain('--_rsc-default-indicator-hover-bg: #e3e5e9;');
    expect(segmentedChoiceCss).toContain(`background: var(
    --rsc-indicator-hover-bg,
    var(--_rsc-indicator-color, var(--_rsc-default-indicator-hover-bg))
  );`);
  });

  it('uses smooth indicator geometry transitions by default and routes instant internally', () => {
    const { container: defaultContainer } = render(
      <SegmentedChoice ariaLabel="Default transition" options={baseOptions} />
    );
    const { container: instantContainer } = render(
      <SegmentedChoice
        ariaLabel="Instant transition"
        options={baseOptions}
        geometry={{ indicator: { transition: 'instant' } }}
      />
    );

    expect(
      (defaultContainer.querySelector('.rsc-root') as HTMLDivElement).dataset.rscIndicatorTransition
    ).toBe('smooth');
    expect(
      (instantContainer.querySelector('.rsc-root') as HTMLDivElement).dataset.rscIndicatorTransition
    ).toBe('instant');
  });

  it('contains the instant indicator transition override in CSS', () => {
    expect(segmentedChoiceCss).toContain(
      ".rsc-root[data-rsc-indicator-transition='instant'] .rsc-indicator"
    );
    expect(segmentedChoiceCss)
      .toContain(`.rsc-root[data-rsc-indicator-transition='instant'] .rsc-indicator {
  transition:
    opacity 120ms ease,
    background-color 160ms ease,
    border-color 160ms ease,
    border-width 160ms ease;
}`);
  });

  it('contains the initial indicator placement transition override in CSS', () => {
    expect(segmentedChoiceCss).toContain(
      ".rsc-root[data-rsc-indicator-motion='initial'] .rsc-indicator"
    );
    expect(segmentedChoiceCss)
      .toContain(`.rsc-root[data-rsc-indicator-motion='initial'] .rsc-indicator {
  transition:
    opacity 120ms ease,
    background-color 160ms ease,
    border-color 160ms ease,
    border-width 160ms ease;
}`);
  });

  it('exposes the stable root and option data attributes', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        optionSizing="content"
        disabled
        orientation="vertical"
        size="lg"
        unstyled
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week', description: 'Current period' },
          { value: 'month', label: 'Month', disabled: true },
        ]}
        geometry={{
          mode: 'overlay',
          optionSize: 44,
          anchor: { size: 32 },
          indicator: {
            content: 'clone-active',
            height: 34,
            style: 'ring',
            width: 34,
          },
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const options = Array.from(container.querySelectorAll('.rsc-option')) as HTMLLabelElement[];

    expect(root.dataset.orientation).toBe('vertical');
    expect(root.dataset.size).toBe('lg');
    expect(root.dataset.disabled).toBe('true');
    expect(root.dataset.unstyled).toBe('true');
    expect(root.dataset.dragging).toBe('false');
    expect(root.dataset.rscSelectionMode).toBe('overlay');
    expect(root.dataset.rscTrackLayout).toBe('center-span');
    expect(root.dataset.rscTrackStyle).toBe('none');
    expect(root.dataset.rscIndicatorStyle).toBe('ring');
    expect(root.dataset.rscIndicatorContentMode).toBe('clone-active');
    expect(root.dataset.rscIndicatorTransition).toBe('smooth');
    expect(root.dataset.rscOptionSizing).toBe('fixed');
    expect(root.dataset.rscAnchorSizing).toBe('explicit');

    expect(options[0]?.dataset.previewed).toBe('false');
    expect(options[0]?.dataset.selected).toBe('false');
    expect(options[0]?.dataset.disabled).toBe('true');
    expect(options[0]?.dataset.focusVisible).toBe('false');
    expect(options[0]?.dataset.hasDescription).toBe('false');

    expect(options[1]?.dataset.previewed).toBe('false');
    expect(options[1]?.dataset.selected).toBe('true');
    expect(options[1]?.dataset.disabled).toBe('true');
    expect(options[1]?.dataset.hasDescription).toBe('true');

    expect(options[2]?.dataset.previewed).toBe('false');
    expect(options[2]?.dataset.selected).toBe('false');
    expect(options[2]?.dataset.disabled).toBe('true');
    expect(options[2]?.dataset.hasDescription).toBe('false');
  });

  it('resolves track layout and paint independently', () => {
    const { container: defaultContainer } = render(
      <SegmentedChoice ariaLabel="Default track" options={baseOptions} />
    );
    const { container: centerSpanSurfaceContainer } = render(
      <SegmentedChoice
        ariaLabel="Center span surface"
        options={baseOptions}
        geometry={{
          track: {
            layout: 'center-span',
            style: 'surface',
          },
        }}
      />
    );
    const { container: centerSpanNoneContainer } = render(
      <SegmentedChoice
        ariaLabel="Center span none"
        options={baseOptions}
        geometry={{
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    expect(
      (defaultContainer.querySelector('.rsc-root') as HTMLDivElement).dataset.rscTrackLayout
    ).toBe('container');
    expect(
      (defaultContainer.querySelector('.rsc-root') as HTMLDivElement).dataset.rscTrackStyle
    ).toBe('surface');
    expect(
      (centerSpanSurfaceContainer.querySelector('.rsc-root') as HTMLDivElement).dataset
        .rscTrackLayout
    ).toBe('center-span');
    expect(
      (centerSpanSurfaceContainer.querySelector('.rsc-root') as HTMLDivElement).dataset
        .rscTrackStyle
    ).toBe('surface');
    expect(
      (centerSpanNoneContainer.querySelector('.rsc-root') as HTMLDivElement).dataset.rscTrackLayout
    ).toBe('center-span');
    expect(
      (centerSpanNoneContainer.querySelector('.rsc-root') as HTMLDivElement).dataset.rscTrackStyle
    ).toBe('none');
  });

  it('ignores style objects in slotProps to keep customization CSS-first', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions}
        slotProps={
          {
            root: {
              style: {
                backgroundColor: 'rgb(255, 0, 0)',
              },
            },
            indicator: {
              style: {
                borderRadius: '4px',
              },
            },
            option: {
              style: {
                backgroundColor: 'rgb(0, 0, 255)',
              },
            },
          } as unknown as React.ComponentProps<typeof SegmentedChoice>['slotProps']
        }
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const indicator = container.querySelector('.rsc-indicator') as HTMLSpanElement;
    const option = container.querySelector('.rsc-option') as HTMLLabelElement;

    expect(root.hasAttribute('style')).toBe(false);
    expect(indicator.hasAttribute('style')).toBe(false);
    expect(option.hasAttribute('style')).toBe(false);
  });

  it('allows external CSS variables to theme the component without inline conflicts', () => {
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      .test-theme {
        --rsc-surface: rgb(18, 7, 41);
      }

      .test-theme .rsc-track {
        background: var(--rsc-surface);
      }
    `;
    document.head.appendChild(styleTag);

    try {
      const { container } = render(
        <SegmentedChoice
          ariaLabel="Range"
          defaultValue="day"
          options={baseOptions}
          className="test-theme"
        />
      );

      const root = container.querySelector('.rsc-root') as HTMLDivElement;
      const runtimeStyle = getRuntimeStyleElement() as HTMLStyleElement;

      expect(root.hasAttribute('style')).toBe(false);
      expect(runtimeStyle.textContent).not.toContain('--rsc-surface');
      expect(getCssVar(root, '--rsc-surface')).toBe('rgb(18,7,41)');
    } finally {
      styleTag.remove();
    }
  });

  it('creates, updates and cleans up the shared runtime stylesheet with nonce support', () => {
    const options = [
      { value: 'day', label: 'Day', accentColor: '#eb4900' },
      { value: 'week', label: 'Week', accentColor: '#0098eb' },
      { value: 'month', label: 'Month', accentColor: '#00db79' },
    ] as const;
    const { rerender, unmount } = render(
      <SegmentedChoice
        ariaLabel="Range"
        geometry={{ mode: 'overlay' }}
        options={options}
        styleNonce="nonce-123"
        value="day"
      />
    );

    const initialStyle = getRuntimeStyleElement();
    expect(initialStyle).not.toBeNull();
    expect(initialStyle?.nonce).toBe('nonce-123');
    expect(initialStyle?.textContent).toContain('#eb4900');

    rerender(
      <SegmentedChoice
        ariaLabel="Range"
        geometry={{ mode: 'overlay' }}
        options={options}
        styleNonce="nonce-123"
        value="week"
      />
    );

    const updatedStyle = getRuntimeStyleElement();
    expect(document.head.querySelectorAll('style[data-rsc-runtime="true"]')).toHaveLength(1);
    expect(updatedStyle?.textContent).toContain('#0098eb');

    unmount();
    expect(getRuntimeStyleElement()).toBeNull();
  });

  it('creates separate runtime styles for distinct styleNonce values', () => {
    render(
      <>
        <SegmentedChoice ariaLabel="Primary range" options={baseOptions} styleNonce="first" />
        <SegmentedChoice ariaLabel="Secondary range" options={baseOptions} styleNonce="second" />
      </>
    );

    const runtimeStyles = getRuntimeStyleElements();
    const nonces = runtimeStyles.map(styleElement => styleElement.nonce).sort();

    expect(runtimeStyles).toHaveLength(2);
    expect(nonces).toEqual(['first', 'second']);
  });

  it('keeps a single runtime style host through React.StrictMode remounts', () => {
    const { unmount } = render(
      <React.StrictMode>
        <SegmentedChoice ariaLabel="Range" options={baseOptions} styleNonce="strict" />
      </React.StrictMode>
    );

    expect(getRuntimeStyleElements()).toHaveLength(1);
    expect(getRuntimeStyleElements()[0]?.nonce).toBe('strict');

    unmount();
    expect(getRuntimeStyleElements()).toHaveLength(0);
  });
}

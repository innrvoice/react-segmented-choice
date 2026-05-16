import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';

import { measureIndicatorLayout } from '../hooks/useIndicatorLayout';
import { SegmentedChoice } from '../SegmentedChoice';
import {
  baseOptions,
  getCssVar,
  getRadio,
  getRuntimeStyleElement,
  getRuntimeStyleRuleFor,
} from './SegmentedChoice.test.shared';
import {
  setElementRect,
  setRectsForAxis,
  triggerResizeObservers,
} from './SegmentedChoice.testUtils';

export function registerSegmentedChoiceBehaviorSuite() {
  it('supports horizontal keyboard navigation', () => {
    render(<SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />);

    const day = getRadio('Day');
    act(() => {
      day.focus();
    });

    act(() => {
      fireEvent.keyDown(day, { key: 'ArrowRight' });
    });

    expect((getRadio('Week') as HTMLInputElement).checked).toBe(true);
  });

  it('supports vertical keyboard navigation', () => {
    render(
      <SegmentedChoice
        ariaLabel="Density"
        defaultValue="compact"
        orientation="vertical"
        options={[
          { value: 'comfortable', label: 'Comfortable' },
          { value: 'compact', label: 'Compact' },
          { value: 'dense', label: 'Dense' },
        ]}
      />
    );

    const compact = getRadio('Compact');
    act(() => {
      compact.focus();
    });

    act(() => {
      fireEvent.keyDown(compact, { key: 'ArrowDown' });
    });

    expect((getRadio('Dense') as HTMLInputElement).checked).toBe(true);
  });

  it('supports Home and End keyboard shortcuts', () => {
    render(<SegmentedChoice ariaLabel="Range" defaultValue="week" options={baseOptions} />);

    const week = getRadio('Week');
    act(() => {
      week.focus();
    });

    act(() => {
      fireEvent.keyDown(week, { key: 'End' });
    });
    expect((getRadio('Month') as HTMLInputElement).checked).toBe(true);

    act(() => {
      fireEvent.keyDown(getRadio('Month'), { key: 'Home' });
    });
    expect((getRadio('Day') as HTMLInputElement).checked).toBe(true);
  });

  it('skips disabled options during keyboard navigation', () => {
    render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week', disabled: true },
          { value: 'month', label: 'Month' },
        ]}
      />
    );

    const day = getRadio('Day');
    act(() => {
      day.focus();
    });
    act(() => {
      fireEvent.keyDown(day, { key: 'ArrowRight' });
    });

    expect((getRadio('Month') as HTMLInputElement).checked).toBe(true);
  });

  it('respects loop=false for keyboard navigation', () => {
    render(
      <SegmentedChoice ariaLabel="Range" defaultValue="month" loop={false} options={baseOptions} />
    );

    const month = getRadio('Month');
    act(() => {
      month.focus();
    });
    act(() => {
      fireEvent.keyDown(month, { key: 'ArrowRight' });
    });

    expect((getRadio('Month') as HTMLInputElement).checked).toBe(true);
  });

  it('wraps keyboard navigation when loop=true', () => {
    render(<SegmentedChoice ariaLabel="Range" defaultValue="month" loop options={baseOptions} />);

    const month = getRadio('Month');
    act(() => {
      month.focus();
    });
    act(() => {
      fireEvent.keyDown(month, { key: 'ArrowRight' });
    });

    expect((getRadio('Day') as HTMLInputElement).checked).toBe(true);
  });

  it('commits the nearest option on horizontal drag by default', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        onValueChange={onValueChange}
        options={baseOptions}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 16,
      clientY: 24,
      pointerId: 1,
    });
    fireEvent.pointerMove(list, {
      clientX: 212,
      clientY: 24,
      pointerId: 1,
    });
    fireEvent.pointerUp(list, {
      clientX: 212,
      clientY: 24,
      pointerId: 1,
    });

    expect(onValueChange).toHaveBeenLastCalledWith('month');
    expect((getRadio('Month') as HTMLInputElement).checked).toBe(true);
  });

  it('prevents default during an active drag move', () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0] as Element, {
      button: 0,
      clientX: 16,
      clientY: 24,
      pointerId: 101,
    });

    const moveWasNotCancelled = fireEvent.pointerMove(list, {
      cancelable: true,
      clientX: 180,
      clientY: 24,
      pointerId: 101,
    });

    expect(moveWasNotCancelled).toBe(false);
  });

  it('commits the nearest enabled option when tapping the underlay list surface', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        onValueChange={onValueChange}
        options={baseOptions}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 360, height: 48 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 40, height: 48 });
    setElementRect(labels[1] as Element, { left: 160, top: 0, width: 40, height: 48 });
    setElementRect(labels[2] as Element, { left: 320, top: 0, width: 40, height: 48 });

    fireEvent.pointerDown(list, {
      button: 0,
      clientX: 330,
      clientY: 24,
      pointerId: 102,
    });
    fireEvent.pointerUp(list, {
      clientX: 330,
      clientY: 24,
      pointerId: 102,
    });

    expect(onValueChange).toHaveBeenLastCalledWith('month');
    expect((getRadio('Month') as HTMLInputElement).checked).toBe(true);
  });

  it('drags from the underlay list surface and commits by coordinate', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        onValueChange={onValueChange}
        options={baseOptions}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 360, height: 48 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 40, height: 48 });
    setElementRect(labels[1] as Element, { left: 160, top: 0, width: 40, height: 48 });
    setElementRect(labels[2] as Element, { left: 320, top: 0, width: 40, height: 48 });

    fireEvent.pointerDown(list, {
      button: 0,
      clientX: 170,
      clientY: 24,
      pointerId: 103,
    });

    expect(root.dataset.dragging).toBe('true');
    expect((labels[1] as HTMLElement).dataset.previewed).toBe('true');

    fireEvent.pointerMove(list, {
      clientX: 330,
      clientY: 24,
      pointerId: 103,
    });
    fireEvent.pointerUp(list, {
      clientX: 330,
      clientY: 24,
      pointerId: 103,
    });

    expect(onValueChange).toHaveBeenLastCalledWith('month');
    expect((getRadio('Month') as HTMLInputElement).checked).toBe(true);
  });

  it('commits the nearest enabled option when tapping an overlay rail surface', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Steps"
        defaultValue="zero"
        optionSizing="content"
        onValueChange={onValueChange}
        options={[
          { value: 'zero', label: '0' },
          { value: 'one', label: '1', disabled: true },
          { value: 'two', label: '2' },
          { value: 'three', label: '3' },
        ]}
        geometry={{
          mode: 'overlay',
          indicator: {
            content: 'none',
            size: 15,
            style: 'fill',
          },
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 315, height: 40 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 15, height: 40 });
    setElementRect(labels[1] as Element, { left: 100, top: 0, width: 15, height: 40 });
    setElementRect(labels[2] as Element, { left: 200, top: 0, width: 15, height: 40 });
    setElementRect(labels[3] as Element, { left: 300, top: 0, width: 15, height: 40 });

    fireEvent.pointerDown(list, {
      button: 0,
      clientX: 112,
      clientY: 20,
      pointerId: 104,
    });
    fireEvent.pointerUp(list, {
      clientX: 112,
      clientY: 20,
      pointerId: 104,
    });

    expect(onValueChange).toHaveBeenLastCalledWith('two');
    expect((getRadio('2') as HTMLInputElement).checked).toBe(true);
  });

  it('drags from the overlay rail surface and commits by coordinate', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Steps"
        defaultValue="zero"
        optionSizing="content"
        onValueChange={onValueChange}
        options={[
          { value: 'zero', label: '0' },
          { value: 'one', label: '1' },
          { value: 'two', label: '2' },
          { value: 'three', label: '3' },
        ]}
        geometry={{
          mode: 'overlay',
          indicator: {
            content: 'none',
            size: 15,
            style: 'fill',
          },
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 315, height: 40 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 15, height: 40 });
    setElementRect(labels[1] as Element, { left: 100, top: 0, width: 15, height: 40 });
    setElementRect(labels[2] as Element, { left: 200, top: 0, width: 15, height: 40 });
    setElementRect(labels[3] as Element, { left: 300, top: 0, width: 15, height: 40 });

    fireEvent.pointerDown(list, {
      button: 0,
      clientX: 205,
      clientY: 20,
      pointerId: 105,
    });

    expect(root.dataset.dragging).toBe('true');
    expect((labels[2] as HTMLElement).dataset.previewed).toBe('true');

    fireEvent.pointerMove(list, {
      clientX: 305,
      clientY: 20,
      pointerId: 105,
    });
    fireEvent.pointerUp(list, {
      clientX: 305,
      clientY: 20,
      pointerId: 105,
    });

    expect(onValueChange).toHaveBeenLastCalledWith('three');
    expect((getRadio('3') as HTMLInputElement).checked).toBe(true);
  });

  it('shows a visibly moving indicator while dragging', async () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 11,
    });
    fireEvent.pointerMove(list, {
      clientX: 124,
      clientY: 24,
      pointerId: 11,
    });

    await waitFor(() => {
      expect(
        getCssVar(
          container.querySelector('.rsc-root') as HTMLDivElement,
          '--_rsc-indicator-transform'
        )
      ).toContain('105px');
    });
  });

  it('does not duplicate selected content into the moving handle by default', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        options={baseOptions}
        geometry={{
          mode: 'overlay',
        }}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const indicatorContent = container.querySelector('.rsc-indicator-content');

    expect(root.dataset.rscSelectionMode).toBe('overlay');
    expect(indicatorContent).toBeNull();
  });

  it('duplicates selected content when geometry.indicator.content is clone-active', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        options={baseOptions}
        geometry={{
          indicator: {
            content: 'clone-active',
          },
          mode: 'overlay',
        }}
      />
    );

    const indicatorContent = container.querySelector('.rsc-indicator-content');

    expect(indicatorContent?.textContent).toContain('Week');
  });

  it('uses drag preview target for clone-active indicator content in overlay mode', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          indicator: {
            content: 'clone-active',
          },
          mode: 'overlay',
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    const indicatorContent = () => container.querySelector('.rsc-indicator-content');
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    expect(indicatorContent()?.textContent).toContain('Day');

    fireEvent.pointerDown(labels[0] as Element, {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 71,
    });
    fireEvent.pointerMove(list, {
      clientX: 206,
      clientY: 24,
      pointerId: 71,
    });

    expect(indicatorContent()?.textContent).toContain('Month');

    fireEvent.pointerUp(list, {
      clientX: 206,
      clientY: 24,
      pointerId: 71,
    });

    expect((getRadio('Month') as HTMLInputElement).checked).toBe(true);
    expect(indicatorContent()?.textContent).toContain('Month');
  });

  it('resizes the overlay indicator during clone-active drag before commit', async () => {
    const options = [
      { value: 'photo', label: 'PHOTO' },
      { value: 'cinematic', label: 'CINEMATIC' },
      { value: 'video', label: 'VIDEO' },
    ] as const;
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Mode"
        defaultValue="photo"
        optionSizing="content"
        options={options}
        geometry={{
          indicator: {
            content: 'clone-active',
          },
          mode: 'overlay',
        }}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    const indicatorContent = () => container.querySelector('.rsc-indicator-content');
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 380, height: 48 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 80, height: 48 });
    setElementRect(labels[1] as Element, { left: 92, top: 0, width: 152, height: 48 });
    setElementRect(labels[2] as Element, { left: 256, top: 0, width: 88, height: 48 });

    fireEvent.pointerDown(labels[0] as Element, {
      button: 0,
      clientX: 40,
      clientY: 24,
      pointerId: 72,
    });

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('80px');
      expect(indicatorContent()?.textContent).toContain('PHOTO');
    });

    fireEvent.pointerMove(list, {
      clientX: 168,
      clientY: 24,
      pointerId: 72,
    });

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('152px');
      expect(indicatorContent()?.textContent).toContain('CINEMATIC');
    });
  });

  it('resizes the underlay indicator during content drag before commit', async () => {
    const options = [
      { value: 'overview', label: 'Overview' },
      { value: 'pipeline', label: 'Pipeline' },
      { value: 'retention', label: 'Retention' },
      { value: 'exports', label: 'Exports' },
    ] as const;
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Section"
        defaultValue="retention"
        optionSizing="content"
        options={options}
        geometry={{
          track: {
            style: 'none',
          },
        }}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 420, height: 48 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 84, height: 48 });
    setElementRect(labels[1] as Element, { left: 96, top: 0, width: 92, height: 48 });
    setElementRect(labels[2] as Element, { left: 200, top: 0, width: 108, height: 48 });
    setElementRect(labels[3] as Element, { left: 320, top: 0, width: 72, height: 48 });

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('108px');
    });

    fireEvent.pointerDown(labels[2] as Element, {
      button: 0,
      clientX: 254,
      clientY: 24,
      pointerId: 73,
    });
    fireEvent.pointerMove(list, {
      clientX: 356,
      clientY: 24,
      pointerId: 73,
    });

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('72px');
    });
  });

  it('keeps explicit indicator width fixed during drag across variable-width options', async () => {
    const options = [
      { value: 'photo', label: 'PHOTO' },
      { value: 'cinematic', label: 'CINEMATIC' },
      { value: 'video', label: 'VIDEO' },
    ] as const;
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Mode"
        defaultValue="photo"
        optionSizing="content"
        options={options}
        geometry={{
          indicator: {
            style: 'fill',
            width: 80,
          },
          mode: 'overlay',
        }}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    const indicator = container.querySelector('.rsc-indicator') as HTMLSpanElement;
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 380, height: 48 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 80, height: 48 });
    setElementRect(labels[1] as Element, { left: 92, top: 0, width: 152, height: 48 });
    setElementRect(labels[2] as Element, { left: 256, top: 0, width: 88, height: 48 });
    Object.defineProperty(indicator, 'offsetWidth', {
      configurable: true,
      value: 80,
    });
    Object.defineProperty(indicator, 'offsetHeight', {
      configurable: true,
      value: 48,
    });

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('80px');
    });

    fireEvent.pointerDown(labels[0] as Element, {
      button: 0,
      clientX: 40,
      clientY: 24,
      pointerId: 74,
    });
    fireEvent.pointerMove(list, {
      clientX: 168,
      clientY: 24,
      pointerId: 74,
    });

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('80px');
    });
  });

  it('renders explicit track and anchor slots', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        options={baseOptions}
        geometry={{
          anchor: { size: 24 },
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const track = container.querySelector('.rsc-track');
    const anchors = container.querySelectorAll('.rsc-option-anchor');

    expect(root.dataset.rscTrackLayout).toBe('center-span');
    expect(root.dataset.rscTrackStyle).toBe('none');
    expect(root.dataset.rscAnchorSizing).toBe('explicit');
    expect(getCssVar(root, '--_rsc-anchor-width')).toBe('24px');
    expect(getCssVar(root, '--_rsc-anchor-height')).toBe('24px');
    expect(track).not.toBeNull();
    expect(anchors).toHaveLength(3);
  });

  it('does not render option anchors in the simple baseline case', () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" defaultValue="week" options={baseOptions} />
    );

    expect(container.querySelector('.rsc-option-anchor')).toBeNull();
  });

  it('supports slotProps classes for track and anchor slots', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        options={baseOptions}
        slotProps={{
          optionAnchor: { className: 'test-anchor' },
          track: { className: 'test-track' },
        }}
      />
    );

    expect(container.querySelector('.rsc-track.test-track')).not.toBeNull();
    expect(container.querySelector('.rsc-option-anchor.test-anchor')).not.toBeNull();
  });

  it('passes slotProps data and aria attributes through to the DOM', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        options={baseOptions}
        slotProps={{
          root: { 'data-qa': 'root-slot' },
          indicator: { 'aria-hidden': 'true', 'data-qa': 'indicator-slot' },
          option: { 'data-track': 'option-slot' },
        }}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const indicator = container.querySelector('.rsc-indicator') as HTMLSpanElement;
    const option = container.querySelector('.rsc-option') as HTMLLabelElement;

    expect(root.getAttribute('data-qa')).toBe('root-slot');
    expect(indicator.getAttribute('data-qa')).toBe('indicator-slot');
    expect(indicator.getAttribute('aria-hidden')).toBe('true');
    expect(option.getAttribute('data-track')).toBe('option-slot');
  });

  it('calls slotProps option pointer handlers', () => {
    const onPointerEnter = vi.fn();
    const onPointerLeave = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        options={baseOptions}
        slotProps={{
          option: {
            onPointerEnter,
            onPointerLeave,
          },
        }}
      />
    );

    const weekOption = container.querySelectorAll('.rsc-option')[1] as HTMLLabelElement;

    fireEvent.pointerEnter(weekOption);
    expect(onPointerEnter).toHaveBeenCalledTimes(1);

    fireEvent.pointerLeave(weekOption);
    expect(onPointerLeave).toHaveBeenCalledTimes(1);
  });

  it('respects explicit indicator width and height from geometry', async () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Tip"
        defaultValue="week"
        options={baseOptions}
        geometry={{
          anchor: {
            height: 13,
            width: 20,
          },
          indicator: {
            content: 'none',
            height: 25,
            style: 'fill',
            width: 40,
          },
          mode: 'overlay',
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const indicator = container.querySelector('.rsc-indicator') as HTMLSpanElement;
    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));

    setElementRect(list, { left: 0, top: 0, width: 180, height: 40 });
    Object.defineProperty(indicator, 'offsetWidth', {
      configurable: true,
      value: 40,
    });
    Object.defineProperty(indicator, 'offsetHeight', {
      configurable: true,
      value: 25,
    });
    setElementRect(labels[0] as Element, { left: 0, top: 7.5, width: 40, height: 25 });
    setElementRect(labels[1] as Element, { left: 70, top: 7.5, width: 40, height: 25 });
    setElementRect(labels[2] as Element, { left: 140, top: 7.5, width: 40, height: 25 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('40px');
      expect(getCssVar(root, '--_rsc-indicator-height')).toBe('25px');
      expect(getCssVar(root, '--_rsc-indicator-transform')).toContain('70px');
      expect(getCssVar(root, '--_rsc-indicator-transform')).toContain('7.5px');
    });
  });

  it('measures center-span tracks between the outer anchor centers without protruding', async () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        options={baseOptions}
        geometry={{
          anchor: { size: 20 },
          mode: 'overlay',
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const options = Array.from(container.querySelectorAll('.rsc-option'));
    const anchors = Array.from(container.querySelectorAll('.rsc-option-anchor'));

    setElementRect(list, { left: 0, top: 0, width: 180, height: 40 });
    setElementRect(options[0] as Element, { left: 0, top: 0, width: 40, height: 40 });
    setElementRect(options[1] as Element, { left: 70, top: 0, width: 40, height: 40 });
    setElementRect(options[2] as Element, { left: 140, top: 0, width: 40, height: 40 });
    setElementRect(anchors[0] as Element, { left: 10, top: 10, width: 20, height: 20 });
    setElementRect(anchors[1] as Element, { left: 80, top: 10, width: 20, height: 20 });
    setElementRect(anchors[2] as Element, { left: 150, top: 10, width: 20, height: 20 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(
        getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-track-x')
      ).toBe('20px');
      expect(
        getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-track-width')
      ).toBe('140px');
      expect(
        getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-track-y')
      ).toBe('20px');
    });
  });

  it.each([
    {
      label: 'first disabled',
      options: [
        { value: 'first', label: 'First', disabled: true },
        { value: 'middle', label: 'Middle' },
        { value: 'last', label: 'Last' },
      ],
      selectedLabel: 'Middle',
      selectedValue: 'middle',
      disabledLabels: ['First'],
    },
    {
      label: 'last disabled',
      options: [
        { value: 'first', label: 'First' },
        { value: 'middle', label: 'Middle' },
        { value: 'last', label: 'Last', disabled: true },
      ],
      selectedLabel: 'Middle',
      selectedValue: 'middle',
      disabledLabels: ['Last'],
    },
    {
      label: 'first and last disabled',
      options: [
        { value: 'first', label: 'First', disabled: true },
        { value: 'middle', label: 'Middle' },
        { value: 'last', label: 'Last', disabled: true },
      ],
      selectedLabel: 'Middle',
      selectedValue: 'middle',
      disabledLabels: ['First', 'Last'],
    },
  ])('measures center-span tracks across disabled edge options: $label', async testCase => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue={testCase.selectedValue}
        options={testCase.options}
        geometry={{
          anchor: { size: 20 },
          mode: 'overlay',
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const options = Array.from(container.querySelectorAll('.rsc-option'));
    const anchors = Array.from(container.querySelectorAll('.rsc-option-anchor'));
    const root = container.querySelector('.rsc-root') as HTMLDivElement;

    setElementRect(list, { left: 0, top: 0, width: 180, height: 40 });
    setElementRect(options[0] as Element, { left: 0, top: 0, width: 40, height: 40 });
    setElementRect(options[1] as Element, { left: 70, top: 0, width: 40, height: 40 });
    setElementRect(options[2] as Element, { left: 140, top: 0, width: 40, height: 40 });
    setElementRect(anchors[0] as Element, { left: 10, top: 10, width: 20, height: 20 });
    setElementRect(anchors[1] as Element, { left: 80, top: 10, width: 20, height: 20 });
    setElementRect(anchors[2] as Element, { left: 150, top: 10, width: 20, height: 20 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-track-x')).toBe('20px');
      expect(getCssVar(root, '--_rsc-track-width')).toBe('140px');
      expect(getCssVar(root, '--_rsc-track-y')).toBe('20px');
      expect((getRadio(testCase.selectedLabel) as HTMLInputElement).checked).toBe(true);
      for (const label of testCase.disabledLabels) {
        expect((getRadio(label) as HTMLInputElement).disabled).toBe(true);
      }
    });
  });

  it('previews overlay handle color while dragging and commits it on release', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={[
          { value: 'day', label: 'Day', accentColor: '#eb4900' },
          { value: 'week', label: 'Week', accentColor: '#0098eb' },
          { value: 'month', label: 'Month', accentColor: '#00db79' },
        ]}
        geometry={{
          mode: 'overlay',
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 21,
    });
    fireEvent.pointerMove(list, {
      clientX: 124,
      clientY: 24,
      pointerId: 21,
    });

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-color')
    ).toBe('#0098eb');

    fireEvent.pointerUp(list, {
      clientX: 124,
      clientY: 24,
      pointerId: 21,
    });

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-color')
    ).toBe('#0098eb');
  });

  it('marks the overlay drag preview target separately from the committed selection', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={[
          { value: 'day', label: 'Day', accentColor: '#eb4900' },
          { value: 'week', label: 'Week', accentColor: '#0098eb' },
          { value: 'month', label: 'Month', accentColor: '#00db79' },
        ]}
        geometry={{
          mode: 'overlay',
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option')) as HTMLLabelElement[];
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 23,
    });
    fireEvent.pointerMove(list, {
      clientX: 124,
      clientY: 24,
      pointerId: 23,
    });

    expect(labels[0]?.dataset.selected).toBe('true');
    expect(labels[0]?.dataset.previewed).toBe('false');
    expect(labels[1]?.dataset.selected).toBe('false');
    expect(labels[1]?.dataset.previewed).toBe('true');

    fireEvent.pointerUp(list, {
      clientX: 124,
      clientY: 24,
      pointerId: 23,
    });

    expect(labels[1]?.dataset.selected).toBe('true');
    expect(labels[1]?.dataset.previewed).toBe('false');
  });

  it('sizes equal options to fit the widest content', async () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />
    );

    const optionContents = Array.from(container.querySelectorAll('.rsc-option-content'));
    setElementRect(optionContents[0] as Element, { left: 0, top: 0, width: 64, height: 32 });
    setElementRect(optionContents[1] as Element, { left: 64, top: 0, width: 72, height: 32 });
    setElementRect(optionContents[2] as Element, { left: 136, top: 0, width: 104, height: 32 });
    triggerResizeObservers();

    const root = container.querySelector('.rsc-root') as HTMLDivElement;

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-equal-option-inline-size')).toBe('104px');
      expect(getCssVar(root, '--_rsc-equal-option-block-size')).toBe('32px');
    });
  });

  it('updates underlay preview color during drag movement', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={[
          { value: 'day', label: 'Day', accentColor: '#eb4900' },
          { value: 'week', label: 'Week', accentColor: '#0098eb' },
          { value: 'month', label: 'Month', accentColor: '#00db79' },
        ]}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 22,
    });
    fireEvent.pointerMove(list, {
      clientX: 124,
      clientY: 24,
      pointerId: 22,
    });

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-color')
    ).toBe('#0098eb');
  });

  it('ignores invalid accentColor values instead of emitting them into runtime CSS', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const invalidAccentOptions = [
      { value: 'url', label: 'URL', accentColor: 'url(x)' },
      { value: 'expression', label: 'Expression', accentColor: 'expression(1)' },
      { value: 'comment', label: 'Comment', accentColor: 'red/**/' },
      { value: 'declaration', label: 'Declaration', accentColor: '; color:red' },
    ] as const;
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Unsafe colors"
        defaultValue="url"
        options={invalidAccentOptions}
        geometry={{
          mode: 'overlay',
        }}
      />
    );

    let runtimeStyle = getRuntimeStyleElement();
    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-color')
    ).toBe('');
    expect(runtimeStyle?.textContent).not.toContain('url(x)');

    fireEvent.click(getRadio('Expression'));
    runtimeStyle = getRuntimeStyleElement();
    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-color')
    ).toBe('');
    expect(runtimeStyle?.textContent).not.toContain('expression(1)');

    fireEvent.click(getRadio('Comment'));
    fireEvent.click(getRadio('Declaration'));

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    runtimeStyle = getRuntimeStyleElement();

    expect(getCssVar(root, '--_rsc-indicator-color')).toBe('');
    expect(runtimeStyle?.textContent).not.toContain('url(x)');
    expect(runtimeStyle?.textContent).not.toContain('expression(1)');
    expect(runtimeStyle?.textContent).not.toContain('red/**/');
    expect(runtimeStyle?.textContent).not.toContain('; color:red');
    expect(warn).toHaveBeenCalled();
  });

  it('renders ring indicators without cloned content when requested', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        options={baseOptions}
        geometry={{
          anchor: { size: 36 },
          indicator: {
            borderWidth: 5,
            content: 'none',
            style: 'ring',
          },
          mode: 'overlay',
          track: {
            style: 'none',
          },
        }}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const indicator = container.querySelector('.rsc-indicator') as HTMLSpanElement;

    expect(root.dataset.rscIndicatorStyle).toBe('ring');
    expect(root.dataset.rscIndicatorContentMode).toBe('none');
    expect(getCssVar(root, '--_rsc-indicator-border-width')).toBe('5px');
    expect(container.querySelector('.rsc-indicator-content')).toBeNull();
    expect(indicator).not.toBeNull();
  });

  it('does not mark underlay options as focus-visible after pointer selection', () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />
    );

    const labels = Array.from(container.querySelectorAll('.rsc-option'));

    fireEvent.click(getRadio('Week'));

    expect(labels.every(label => label.getAttribute('data-focus-visible') === 'false')).toBe(true);
  });

  it('clears old underlay option focus-visible state after dragging to a new value', () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" defaultValue="week" options={baseOptions} />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.keyDown(window, { key: 'Tab' });
    act(() => {
      getRadio('Week').focus();
    });

    expect(labels[1]?.getAttribute('data-focus-visible')).toBe('true');

    fireEvent.pointerDown(labels[1] as Element, {
      button: 0,
      clientX: 120,
      clientY: 24,
      pointerId: 36,
    });
    fireEvent.pointerMove(list, {
      clientX: 16,
      clientY: 24,
      pointerId: 36,
    });
    fireEvent.pointerUp(list, {
      clientX: 16,
      clientY: 24,
      pointerId: 36,
    });

    expect(labels[1]?.getAttribute('data-focus-visible')).toBe('false');
    expect(labels[0]?.getAttribute('data-focus-visible')).toBe('false');
  });

  it('restores underlay focus-visible state after keyboard modality resumes', () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />
    );

    const labels = Array.from(container.querySelectorAll('.rsc-option'));

    fireEvent.click(getRadio('Week'));

    expect(labels[1]?.getAttribute('data-focus-visible')).toBe('false');

    act(() => {
      getRadio('Week').blur();
    });
    fireEvent.keyDown(window, { key: 'Tab' });
    act(() => {
      getRadio('Week').focus();
    });

    expect(labels[1]?.getAttribute('data-focus-visible')).toBe('true');
  });

  it('keeps overlay focus styling on the anchor instead of the full option box', () => {
    render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        options={baseOptions}
        geometry={{
          anchor: { size: 42 },
          indicator: {
            borderWidth: 4,
            content: 'none',
            style: 'ring',
          },
          mode: 'overlay',
          track: {
            style: 'none',
          },
        }}
      />
    );

    const input = getRadio('Week');
    const optionContent = input.nextElementSibling as HTMLSpanElement;
    const anchor = optionContent.querySelector('.rsc-option-anchor') as HTMLSpanElement;

    expect(optionContent).not.toBeNull();
    expect(anchor).not.toBeNull();
  });

  it('does not mark the overlay handle as focus-visible after pointer selection', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          anchor: { size: 42 },
          indicator: {
            borderWidth: 4,
            content: 'none',
            style: 'ring',
          },
          mode: 'overlay',
          track: {
            style: 'none',
          },
        }}
      />
    );

    const indicator = container.querySelector('.rsc-indicator') as HTMLSpanElement;

    fireEvent.click(getRadio('Week'));

    expect(indicator.dataset.rscFocused).toBe('false');
  });

  it('moves DOM focus to the current overlay handle after pointer interaction', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Satisfaction"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          indicator: {
            content: 'none',
            style: 'fill',
          },
          mode: 'overlay',
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    const indicator = container.querySelector('.rsc-indicator') as HTMLSpanElement;
    const day = getRadio('Day');

    fireEvent.pointerDown(indicator, {
      button: 0,
      clientX: 20,
      clientY: 20,
      pointerId: 41,
    });

    expect(document.activeElement).toBe(day);
  });

  it('clears overlay focus-visible styling when pointer drag begins', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Satisfaction"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          dragScale: true,
          indicator: {
            content: 'none',
            style: 'fill',
          },
          mode: 'overlay',
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    const indicator = container.querySelector('.rsc-indicator') as HTMLSpanElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const day = getRadio('Day');
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });

    act(() => {
      day.focus();
    });
    act(() => {
      fireEvent.keyDown(day, { key: 'ArrowRight' });
    });

    expect(indicator.dataset.rscFocused).toBe('true');

    fireEvent.pointerDown(indicator, {
      button: 0,
      clientX: 20,
      clientY: 20,
      pointerId: 51,
    });

    expect(indicator.dataset.rscFocused).toBe('false');
  });

  it('clears old overlay option focus-visible state after dragging to a new value', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Impressions"
        defaultValue="month"
        options={baseOptions}
        geometry={{
          anchor: { size: 42 },
          dragScale: false,
          indicator: {
            borderWidth: 4,
            content: 'none',
            style: 'ring',
          },
          mode: 'overlay',
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 180, height: 50 });
    setRectsForAxis(labels, 'horizontal', { size: 50, gap: 15, crossSize: 50 });

    const month = getRadio('Month');
    act(() => {
      month.focus();
    });
    act(() => {
      fireEvent.keyDown(month, { key: 'ArrowLeft' });
    });

    expect(labels[1]?.getAttribute('data-focus-visible')).toBe('true');

    fireEvent.pointerDown(labels[1] as Element, {
      button: 0,
      clientX: 90,
      clientY: 25,
      pointerId: 61,
    });
    fireEvent.pointerMove(list, {
      clientX: 20,
      clientY: 25,
      pointerId: 61,
    });
    fireEvent.pointerUp(list, {
      clientX: 20,
      clientY: 25,
      pointerId: 61,
    });

    expect((getRadio('Day') as HTMLInputElement).checked).toBe(true);
    expect(labels[1]?.getAttribute('data-focus-visible')).toBe('false');
    expect(labels[0]?.getAttribute('data-focus-visible')).toBe('false');
  });

  it('marks the overlay handle as focus-visible during keyboard navigation', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          anchor: { size: 42 },
          indicator: {
            borderWidth: 4,
            content: 'none',
            style: 'ring',
          },
          mode: 'overlay',
          track: {
            style: 'none',
          },
        }}
      />
    );

    const indicator = container.querySelector('.rsc-indicator') as HTMLSpanElement;
    const day = getRadio('Day');

    act(() => {
      day.focus();
    });
    act(() => {
      fireEvent.keyDown(day, { key: 'ArrowRight' });
    });

    expect(indicator.dataset.rscFocused).toBe('true');
  });

  it('marks filled overlay handles as focus-visible during keyboard navigation', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Satisfaction"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          indicator: {
            content: 'none',
            style: 'fill',
          },
          mode: 'overlay',
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    const indicator = container.querySelector('.rsc-indicator') as HTMLSpanElement;
    const day = getRadio('Day');

    act(() => {
      day.focus();
    });
    act(() => {
      fireEvent.keyDown(day, { key: 'ArrowRight' });
    });

    expect(indicator.dataset.rscFocused).toBe('true');
  });

  it('marks filled overlay handles as focus-visible when entering with Tab', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Satisfaction"
        defaultValue="week"
        options={baseOptions}
        geometry={{
          indicator: {
            content: 'none',
            style: 'fill',
          },
          mode: 'overlay',
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    const indicator = container.querySelector('.rsc-indicator') as HTMLSpanElement;
    const week = getRadio('Week');

    act(() => {
      fireEvent.keyDown(window, { key: 'Tab' });
      week.focus();
    });

    expect(indicator.dataset.rscFocused).toBe('true');
  });

  it('commits the nearest option on vertical drag', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Density"
        defaultValue="comfortable"
        draggable
        orientation="vertical"
        onValueChange={onValueChange}
        options={[
          { value: 'comfortable', label: 'Comfortable' },
          { value: 'compact', label: 'Compact' },
          { value: 'dense', label: 'Dense' },
        ]}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 140, height: 280 });
    setRectsForAxis(labels, 'vertical', { size: 84, gap: 12, crossSize: 140 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 70,
      clientY: 16,
      pointerId: 2,
    });
    fireEvent.pointerMove(list, {
      clientX: 70,
      clientY: 210,
      pointerId: 2,
    });
    fireEvent.pointerUp(list, {
      clientX: 70,
      clientY: 210,
      pointerId: 2,
    });

    expect(onValueChange).toHaveBeenLastCalledWith('dense');
    expect((getRadio('Dense') as HTMLInputElement).checked).toBe(true);
  });

  it('applies dragScale={true} as scale(1.1) while dragging', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          dragScale: true,
          mode: 'overlay',
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 23,
    });
    fireEvent.pointerMove(list, {
      clientX: 90,
      clientY: 24,
      pointerId: 23,
    });

    expect(root.dataset.dragging).toBe('true');
    expect(getCssVar(root, '--_rsc-indicator-transform')).toContain('scale(1.1)');
  });

  it('applies a numeric dragScale while dragging', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          dragScale: 1.5,
          mode: 'overlay',
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 24,
    });
    fireEvent.pointerMove(list, {
      clientX: 90,
      clientY: 24,
      pointerId: 24,
    });

    expect(
      getCssVar(
        container.querySelector('.rsc-root') as HTMLDivElement,
        '--_rsc-indicator-transform'
      )
    ).toContain('scale(1.5)');
  });

  it('keeps the destination drag layout for the first release frame after committing a new value', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          dragScale: 1.3,
          indicator: { content: 'clone-active' },
          mode: 'overlay',
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 25,
    });
    fireEvent.pointerMove(list, {
      clientX: 190,
      clientY: 24,
      pointerId: 25,
    });

    const dragTransform = getCssVar(root, '--_rsc-indicator-transform');
    const dragTranslate = dragTransform.replace(/\s+scale\([^)]+\)$/, '');
    expect(root.dataset.dragging).toBe('true');
    expect(dragTransform).toContain('scale(1.3)');

    fireEvent.pointerUp(list, {
      clientX: 190,
      clientY: 24,
      pointerId: 25,
    });

    expect(root.dataset.dragging).toBe('false');
    expect(getCssVar(root, '--_rsc-indicator-transform')).toBe(`${dragTranslate} scale(1)`);
    expect((getRadio('Month') as HTMLInputElement).checked).toBe(true);
  });

  it('marks drag release after pointer up and clears it after the release window', () => {
    vi.useFakeTimers();

    try {
      const { container } = render(
        <SegmentedChoice
          ariaLabel="Range"
          defaultValue="day"
          options={baseOptions}
          geometry={{
            dragScale: 1.3,
            mode: 'overlay',
          }}
        />
      );

      const list = container.querySelector('.rsc-list') as HTMLDivElement;
      const root = container.querySelector('.rsc-root') as HTMLDivElement;
      const labels = Array.from(container.querySelectorAll('.rsc-option'));
      Object.assign(list, {
        releasePointerCapture: vi.fn(),
        setPointerCapture: vi.fn(),
      });
      setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
      setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

      expect(root.dataset.dragReleased).toBe('false');

      fireEvent.pointerDown(labels[0], {
        button: 0,
        clientX: 20,
        clientY: 24,
        pointerId: 26,
      });
      fireEvent.pointerMove(list, {
        clientX: 190,
        clientY: 24,
        pointerId: 26,
      });
      fireEvent.pointerUp(list, {
        clientX: 190,
        clientY: 24,
        pointerId: 26,
      });

      expect(root.dataset.dragging).toBe('false');
      expect(root.dataset.dragReleased).toBe('true');

      act(() => {
        vi.advanceTimersByTime(320);
      });

      expect(root.dataset.dragReleased).toBe('false');
    } finally {
      vi.useRealTimers();
    }
  });

  it('marks drag release after pointer cancel and clears it after the release window', () => {
    vi.useFakeTimers();

    try {
      const { container } = render(
        <SegmentedChoice
          ariaLabel="Range"
          defaultValue="day"
          options={baseOptions}
          geometry={{
            dragScale: 1.3,
            mode: 'overlay',
          }}
        />
      );

      const list = container.querySelector('.rsc-list') as HTMLDivElement;
      const root = container.querySelector('.rsc-root') as HTMLDivElement;
      const labels = Array.from(container.querySelectorAll('.rsc-option'));
      Object.assign(list, {
        releasePointerCapture: vi.fn(),
        setPointerCapture: vi.fn(),
      });
      setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
      setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

      expect(root.dataset.dragReleased).toBe('false');

      fireEvent.pointerDown(labels[0], {
        button: 0,
        clientX: 20,
        clientY: 24,
        pointerId: 27,
      });
      fireEvent.pointerCancel(list, {
        clientX: 90,
        clientY: 24,
        pointerId: 27,
      });

      expect(root.dataset.dragging).toBe('false');
      expect(root.dataset.dragReleased).toBe('true');

      act(() => {
        vi.advanceTimersByTime(320);
      });

      expect(root.dataset.dragReleased).toBe('false');
    } finally {
      vi.useRealTimers();
    }
  });

  it('shows grab and grabbing cursors for draggable underlay controls', () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-cursor')
    ).toBe('grab');
    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-list-cursor')
    ).toBe('grab');

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 30,
    });
    fireEvent.pointerMove(list, {
      clientX: 90,
      clientY: 24,
      pointerId: 30,
    });

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-cursor')
    ).toBe('grabbing');
    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-list-cursor')
    ).toBe('grabbing');

    fireEvent.pointerUp(list, {
      clientX: 90,
      clientY: 24,
      pointerId: 30,
    });

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-cursor')
    ).toBe('grab');
    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-list-cursor')
    ).toBe('grab');
  });

  it('shows grab and grabbing cursors for draggable overlay controls', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          mode: 'overlay',
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-cursor')
    ).toBe('grab');
    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-list-cursor')
    ).toBe('grab');

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 31,
    });
    fireEvent.pointerMove(list, {
      clientX: 90,
      clientY: 24,
      pointerId: 31,
    });

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-cursor')
    ).toBe('grabbing');
    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-list-cursor')
    ).toBe('grabbing');

    fireEvent.pointerUp(list, {
      clientX: 90,
      clientY: 24,
      pointerId: 31,
    });

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-cursor')
    ).toBe('grab');
    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-list-cursor')
    ).toBe('grab');
  });

  it('keeps pointer cursor on underlay controls when draggable is false', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        draggable={false}
        options={baseOptions}
      />
    );

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-cursor')
    ).toBe('pointer');
    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-list-cursor')
    ).toBe('pointer');
  });

  it('keeps pointer cursor on overlay controls when draggable is false', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        draggable={false}
        options={baseOptions}
        geometry={{
          mode: 'overlay',
        }}
      />
    );

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-cursor')
    ).toBe('pointer');
    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-list-cursor')
    ).toBe('pointer');
  });

  it('sets touch-action none while list drag is enabled', () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />
    );

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-list-touch-action')
    ).toBe('none');
  });

  it('keeps orientation pan behavior when draggable is false', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        draggable={false}
        options={baseOptions}
      />
    );

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-list-touch-action')
    ).toBe('');
  });

  it('does not expose interactive cursors when the control is disabled', () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" defaultValue="day" disabled options={baseOptions} />
    );

    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-cursor')
    ).toBe('');
    expect(
      getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-list-cursor')
    ).toBe('');
  });

  it('measures selectionSize from offset dimensions instead of transformed rects', () => {
    const list = document.createElement('div');
    const option = document.createElement('label');
    const anchor = document.createElement('span');
    const indicator = document.createElement('span');

    setElementRect(list, { left: 0, top: 0, width: 200, height: 15 });
    setElementRect(option, { left: 92.5, top: 0, width: 15, height: 15 });
    setElementRect(anchor, { left: 92.5, top: 0, width: 0, height: 0 });
    setElementRect(indicator, { left: 86.5, top: -6, width: 27, height: 27 });
    Object.defineProperty(indicator, 'offsetWidth', {
      configurable: true,
      value: 15,
    });
    Object.defineProperty(indicator, 'offsetHeight', {
      configurable: true,
      value: 15,
    });

    const layout = measureIndicatorLayout({
      activeIndex: 0,
      centerToOption: true,
      indicatorRef: {
        current: indicator,
      },
      inset: 0,
      listRef: {
        current: list,
      },
      measureRefs: {
        current: [anchor],
      },
      optionRefs: {
        current: [option],
      },
      sizeAdjustment: 0,
      useRenderedIndicatorSize: true,
    });

    expect(layout).not.toBeNull();
    expect(layout?.width).toBe(15);
    expect(layout?.height).toBe(15);
    expect(layout?.x).toBe(92.5);
    expect(layout?.y).toBe(0);
  });

  it('centers a larger selectionSize over a smaller optionSize in overlay mode', async () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        options={baseOptions}
        geometry={{
          indicator: {
            size: 60,
          },
          mode: 'overlay',
          optionSize: 40,
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const indicator = container.querySelector('.rsc-indicator') as HTMLSpanElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));

    setElementRect(list, { left: 0, top: 0, width: 180, height: 60 });
    setElementRect(indicator, { left: 0, top: 0, width: 60, height: 60 });
    Object.defineProperty(indicator, 'offsetWidth', {
      configurable: true,
      value: 60,
    });
    Object.defineProperty(indicator, 'offsetHeight', {
      configurable: true,
      value: 60,
    });
    setElementRect(labels[0] as Element, { left: 0, top: 10, width: 40, height: 40 });
    setElementRect(labels[1] as Element, { left: 60, top: 10, width: 40, height: 40 });
    setElementRect(labels[2] as Element, { left: 120, top: 10, width: 40, height: 40 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(
        getCssVar(
          container.querySelector('.rsc-root') as HTMLDivElement,
          '--_rsc-indicator-transform'
        )
      ).toContain('50px');
    });
  });

  it('grows ring geometry from anchor.size and indicatorBorderWidth', async () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        options={baseOptions}
        geometry={{
          anchor: { size: 42 },
          indicator: {
            borderWidth: 4,
            style: 'ring',
          },
          mode: 'overlay',
          track: {
            style: 'none',
          },
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const options = Array.from(container.querySelectorAll('.rsc-option'));
    const anchors = Array.from(container.querySelectorAll('.rsc-option-anchor'));

    setElementRect(list, { left: 0, top: 0, width: 180, height: 50 });
    setElementRect(options[0] as Element, { left: 0, top: 0, width: 50, height: 50 });
    setElementRect(options[1] as Element, { left: 60, top: 0, width: 50, height: 50 });
    setElementRect(options[2] as Element, { left: 120, top: 0, width: 50, height: 50 });
    setElementRect(anchors[0] as Element, { left: 4, top: 4, width: 42, height: 42 });
    setElementRect(anchors[1] as Element, { left: 64, top: 4, width: 42, height: 42 });
    setElementRect(anchors[2] as Element, { left: 124, top: 4, width: 42, height: 42 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(
        getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-width')
      ).toBe('50px');
      expect(
        getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-height')
      ).toBe('50px');
      expect(
        getCssVar(
          container.querySelector('.rsc-root') as HTMLDivElement,
          '--_rsc-indicator-transform'
        )
      ).toContain('60px');
    });
  });

  it('resolves an exact midpoint toward the forward option when drag direction is forward', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        onValueChange={onValueChange}
        options={baseOptions}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 360, height: 48 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 120, height: 48 });
    setElementRect(labels[1] as Element, { left: 120, top: 0, width: 120, height: 48 });
    setElementRect(labels[2] as Element, { left: 240, top: 0, width: 120, height: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 60,
      clientY: 24,
      pointerId: 12,
    });
    fireEvent.pointerMove(list, {
      clientX: 120,
      clientY: 24,
      pointerId: 12,
    });
    fireEvent.pointerUp(list, {
      clientX: 120,
      clientY: 24,
      pointerId: 12,
    });

    expect(onValueChange).toHaveBeenLastCalledWith('week');
    expect((getRadio('Week') as HTMLInputElement).checked).toBe(true);
  });

  it('resolves an exact midpoint toward the backward option when drag direction is backward', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        onValueChange={onValueChange}
        options={baseOptions}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 360, height: 48 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 120, height: 48 });
    setElementRect(labels[1] as Element, { left: 120, top: 0, width: 120, height: 48 });
    setElementRect(labels[2] as Element, { left: 240, top: 0, width: 120, height: 48 });

    fireEvent.pointerDown(labels[1], {
      button: 0,
      clientX: 180,
      clientY: 24,
      pointerId: 13,
    });
    fireEvent.pointerMove(list, {
      clientX: 120,
      clientY: 24,
      pointerId: 13,
    });
    fireEvent.pointerUp(list, {
      clientX: 120,
      clientY: 24,
      pointerId: 13,
    });

    expect(onValueChange).toHaveBeenLastCalledWith('day');
    expect((getRadio('Day') as HTMLInputElement).checked).toBe(true);
  });

  it('keeps the current selection on an exact midpoint when there is no meaningful drag direction', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="week"
        onValueChange={onValueChange}
        options={baseOptions}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 360, height: 48 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 120, height: 48 });
    setElementRect(labels[1] as Element, { left: 120, top: 0, width: 120, height: 48 });
    setElementRect(labels[2] as Element, { left: 240, top: 0, width: 120, height: 48 });

    fireEvent.pointerDown(labels[1], {
      button: 0,
      clientX: 120,
      clientY: 24,
      pointerId: 14,
    });
    fireEvent.pointerUp(list, {
      clientX: 120,
      clientY: 24,
      pointerId: 14,
    });

    expect(onValueChange).not.toHaveBeenCalled();
    expect((getRadio('Week') as HTMLInputElement).checked).toBe(true);
  });

  it('skips disabled options when resolving drag release', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        onValueChange={onValueChange}
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week', disabled: true },
          { value: 'month', label: 'Month' },
        ]}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 360, height: 48 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 120, height: 48 });
    setElementRect(labels[1] as Element, { left: 120, top: 0, width: 120, height: 48 });
    setElementRect(labels[2] as Element, { left: 240, top: 0, width: 120, height: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 60,
      clientY: 24,
      pointerId: 15,
    });
    fireEvent.pointerMove(list, {
      clientX: 180,
      clientY: 24,
      pointerId: 15,
    });
    fireEvent.pointerUp(list, {
      clientX: 180,
      clientY: 24,
      pointerId: 15,
    });

    expect(onValueChange).toHaveBeenLastCalledWith('month');
    expect((getRadio('Month') as HTMLInputElement).checked).toBe(true);
  });

  it('ignores drag gestures when draggable is false', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        draggable={false}
        onValueChange={onValueChange}
        options={baseOptions}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 16,
      clientY: 24,
      pointerId: 3,
    });
    fireEvent.pointerMove(list, {
      clientX: 212,
      clientY: 24,
      pointerId: 3,
    });
    fireEvent.pointerUp(list, {
      clientX: 212,
      clientY: 24,
      pointerId: 3,
    });

    expect(onValueChange).not.toHaveBeenCalled();
    expect((getRadio('Day') as HTMLInputElement).checked).toBe(true);
  });

  it('releases active drag state when the control unmounts mid-drag', () => {
    const { container, unmount } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          mode: 'overlay',
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    const releasePointerCapture = vi.fn();
    Object.assign(list, {
      releasePointerCapture,
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 81,
    });
    fireEvent.pointerMove(list, {
      clientX: 124,
      clientY: 24,
      pointerId: 81,
    });

    expect(root.dataset.dragging).toBe('true');

    unmount();

    expect(releasePointerCapture).toHaveBeenCalledWith(81);
  });

  it('cancels active drag when the window blurs', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          mode: 'overlay',
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 82,
    });
    fireEvent.pointerMove(list, {
      clientX: 124,
      clientY: 24,
      pointerId: 82,
    });

    expect(root.dataset.dragging).toBe('true');

    fireEvent.blur(window);

    expect(root.dataset.dragging).toBe('false');
  });

  it('cancels active drag when the document becomes hidden', () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          mode: 'overlay',
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    const originalVisibilityState = Object.getOwnPropertyDescriptor(document, 'visibilityState');
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 84,
    });
    fireEvent.pointerMove(list, {
      clientX: 124,
      clientY: 24,
      pointerId: 84,
    });

    expect(root.dataset.dragging).toBe('true');

    try {
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        value: 'hidden',
      });
      fireEvent(document, new Event('visibilitychange'));
    } finally {
      if (originalVisibilityState) {
        Object.defineProperty(document, 'visibilityState', originalVisibilityState);
      }
    }

    expect(root.dataset.dragging).toBe('false');
  });

  it('cancels active drag when options change mid-drag', () => {
    const { container, rerender } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          mode: 'overlay',
        }}
      />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });

    fireEvent.pointerDown(labels[0], {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 83,
    });
    fireEvent.pointerMove(list, {
      clientX: 124,
      clientY: 24,
      pointerId: 83,
    });

    expect(root.dataset.dragging).toBe('true');

    rerender(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions.slice(0, 2)}
        geometry={{
          mode: 'overlay',
        }}
      />
    );

    expect((container.querySelector('.rsc-root') as HTMLDivElement).dataset.dragging).toBe('false');
  });

  it('does not access window, document or navigator during render', () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);
    vi.stubGlobal('navigator', undefined);

    expect(() =>
      renderToString(<SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />)
    ).not.toThrow();
  });

  it('hydrates without recoverable errors and installs runtime CSS on the client', async () => {
    const recoverableErrors: unknown[] = [];
    const container = document.createElement('div');
    const markup = renderToString(
      <SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />
    );
    container.innerHTML = markup;
    document.body.appendChild(container);

    let root: ReturnType<typeof hydrateRoot> | null = null;

    try {
      await act(async () => {
        root = hydrateRoot(
          container,
          <SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />,
          {
            onRecoverableError(error) {
              recoverableErrors.push(error);
            },
          }
        );
      });

      await waitFor(() => {
        expect(getRuntimeStyleElement()).not.toBeNull();
      });

      expect(recoverableErrors).toHaveLength(0);
      expect(
        getRuntimeStyleRuleFor(container.querySelector('.rsc-root') as HTMLDivElement)
      ).toContain('[data-rsc-instance=');
    } finally {
      await act(async () => {
        root?.unmount();
      });
      container.remove();
    }
  });

  it('uses native required validation when no option is selected', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <form data-testid="range-form">
        <SegmentedChoice
          ariaLabel="Range"
          options={baseOptions}
          required
          value={'missing' as 'day'}
        />
      </form>
    );

    const form = document.querySelector('[data-testid="range-form"]') as HTMLFormElement;

    expect(form.checkValidity()).toBe(false);
    expect((getRadio('Day') as HTMLInputElement).validity.valueMissing).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('controlled value "missing"'));
  });

  it('keeps keyboard Home and End navigation on the only enabled option', () => {
    render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="middle"
        options={[
          { value: 'first', label: 'First', disabled: true },
          { value: 'middle', label: 'Middle' },
          { value: 'last', label: 'Last', disabled: true },
        ]}
      />
    );

    const middle = getRadio('Middle');
    act(() => {
      middle.focus();
    });

    act(() => {
      fireEvent.keyDown(middle, { key: 'Home' });
      fireEvent.keyDown(middle, { key: 'End' });
    });

    expect((middle as HTMLInputElement).checked).toBe(true);
  });

  it('updates indicator layout after the selection changes', async () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" defaultValue="day" options={baseOptions} />
    );

    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));

    setElementRect(list, { left: 0, top: 0, width: 320, height: 48 });
    setElementRect(labels[0], { left: 0, top: 0, width: 72, height: 48 });
    setElementRect(labels[1], { left: 84, top: 0, width: 116, height: 48 });
    setElementRect(labels[2], { left: 212, top: 0, width: 96, height: 48 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(
        getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-width')
      ).toBe('70px');
    });

    fireEvent.click(getRadio('Week'));

    await waitFor(() => {
      expect(
        getCssVar(container.querySelector('.rsc-root') as HTMLDivElement, '--_rsc-indicator-width')
      ).toBe('114px');
      expect(
        getCssVar(
          container.querySelector('.rsc-root') as HTMLDivElement,
          '--_rsc-indicator-transform'
        )
      ).toContain('85px');
    });
  });

  it('keeps smooth underlay click selection eligible for a transition handoff', async () => {
    const options = [
      { value: 'overview', label: 'Overview' },
      { value: 'analytics', label: 'Analytics' },
      { value: 'billing', label: 'Billing' },
      { value: 'team', label: 'Team' },
    ] as const;
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Section"
        defaultValue="overview"
        optionSizing="content"
        options={options}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      releasePointerCapture: vi.fn(),
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 420, height: 64 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 136, height: 64 });
    setElementRect(labels[1] as Element, { left: 148, top: 0, width: 154, height: 64 });
    setElementRect(labels[2] as Element, { left: 314, top: 0, width: 130, height: 64 });
    setElementRect(labels[3] as Element, { left: 456, top: 0, width: 96, height: 64 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-transform')).toContain('1px');
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('134px');
    });

    fireEvent.pointerDown(labels[2] as Element, {
      button: 0,
      clientX: 379,
      clientY: 32,
      pointerId: 81,
    });

    expect(root.dataset.dragging).toBe('true');
    expect(root.dataset.rscDragPreviewing).toBe('false');
    expect(root.dataset.rscIndicatorTransition).toBe('smooth');

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-transform')).toContain('315px');
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('128px');
    });
  });

  it('places an uncontrolled non-first defaultValue without initial geometry motion', async () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" defaultValue="week" options={baseOptions} />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));

    expect(root.dataset.rscIndicatorMotion).toBe('initial');
    expect(root.dataset.rscIndicatorTransition).toBe('smooth');

    setElementRect(list, { left: 0, top: 0, width: 320, height: 48 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 72, height: 48 });
    setElementRect(labels[1] as Element, { left: 84, top: 0, width: 116, height: 48 });
    setElementRect(labels[2] as Element, { left: 212, top: 0, width: 96, height: 48 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('114px');
      expect(getCssVar(root, '--_rsc-indicator-transform')).toContain('85px');
      expect(root.dataset.rscIndicatorMotion).toBeUndefined();
    });

    fireEvent.click(getRadio('Month'));

    await waitFor(() => {
      expect(root.dataset.rscIndicatorMotion).toBeUndefined();
      expect(root.dataset.rscIndicatorTransition).toBe('smooth');
      expect(getCssVar(root, '--_rsc-indicator-transform')).toContain('213px');
    });
  });

  it('places a controlled non-first initial value without initial geometry motion', async () => {
    const { container } = render(
      <SegmentedChoice ariaLabel="Range" options={baseOptions} value="month" />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));

    expect(root.dataset.rscIndicatorMotion).toBe('initial');
    expect(root.dataset.rscIndicatorTransition).toBe('smooth');

    setElementRect(list, { left: 0, top: 0, width: 320, height: 48 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 72, height: 48 });
    setElementRect(labels[1] as Element, { left: 84, top: 0, width: 116, height: 48 });
    setElementRect(labels[2] as Element, { left: 212, top: 0, width: 96, height: 48 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('94px');
      expect(getCssVar(root, '--_rsc-indicator-transform')).toContain('213px');
      expect(root.dataset.rscIndicatorMotion).toBeUndefined();
    });
  });

  it('keeps initial motion suppressed while fixed option geometry settles', async () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Dock"
        geometry={{
          mode: 'overlay',
          optionSize: 88,
          indicator: { content: 'clone-active', style: 'fill' },
        }}
        optionSizing="content"
        options={baseOptions}
        value="week"
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));

    setElementRect(list, { left: 0, top: 0, width: 320, height: 104 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 57, height: 32 });
    setElementRect(labels[1] as Element, { left: 84, top: 8, width: 57, height: 32 });
    setElementRect(labels[2] as Element, { left: 168, top: 0, width: 57, height: 32 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('57px');
      expect(root.dataset.rscIndicatorMotion).toBe('initial');
    });

    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 88, height: 88 });
    setElementRect(labels[1] as Element, { left: 96, top: 8, width: 88, height: 88 });
    setElementRect(labels[2] as Element, { left: 192, top: 0, width: 88, height: 88 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('88px');
      expect(root.dataset.rscIndicatorMotion).toBe('initial');
    });

    await waitFor(() => {
      expect(root.dataset.rscIndicatorMotion).toBeUndefined();
    });
  });

  it('moves the underlay content-width indicator from old geometry to clicked geometry', async () => {
    const options = [
      { value: 'deep', label: 'Deep Focus' },
      { value: 'discover', label: 'Discover' },
      { value: 'party', label: 'Party' },
      { value: 'sunrise', label: 'Sunrise' },
    ] as const;
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Mood"
        defaultValue="discover"
        optionSizing="content"
        onValueChange={onValueChange}
        options={options}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      releasePointerCapture: vi.fn(),
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 420, height: 70 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 132, height: 70 });
    setElementRect(labels[1] as Element, { left: 144, top: 0, width: 124, height: 70 });
    setElementRect(labels[2] as Element, { left: 280, top: 0, width: 92, height: 70 });
    setElementRect(labels[3] as Element, { left: 384, top: 0, width: 116, height: 70 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-transform')).toContain('145px');
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('122px');
    });

    fireEvent.pointerDown(labels[2] as Element, {
      button: 0,
      clientX: 326,
      clientY: 35,
      pointerId: 82,
    });
    fireEvent.pointerUp(list, {
      clientX: 326,
      clientY: 35,
      pointerId: 82,
    });

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith('party');
      expect(getCssVar(root, '--_rsc-indicator-transform')).toContain('281px');
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('90px');
      expect(root.dataset.dragging).toBe('false');
      expect(root.dataset.rscDragPreviewing).toBe('false');
    });
  });

  it('moves the overlay indicator from old geometry to clicked geometry', async () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Tip"
        defaultValue="day"
        options={baseOptions}
        geometry={{
          anchor: {
            height: 13,
            width: 20,
          },
          indicator: {
            content: 'none',
            height: 25,
            style: 'fill',
            width: 40,
          },
          mode: 'overlay',
          track: {
            layout: 'center-span',
            style: 'none',
          },
        }}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const indicator = container.querySelector('.rsc-indicator') as HTMLSpanElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));

    setElementRect(list, { left: 0, top: 0, width: 180, height: 40 });
    Object.defineProperty(indicator, 'offsetWidth', {
      configurable: true,
      value: 40,
    });
    Object.defineProperty(indicator, 'offsetHeight', {
      configurable: true,
      value: 25,
    });
    setElementRect(labels[0] as Element, { left: 0, top: 7.5, width: 40, height: 25 });
    setElementRect(labels[1] as Element, { left: 70, top: 7.5, width: 40, height: 25 });
    setElementRect(labels[2] as Element, { left: 140, top: 7.5, width: 40, height: 25 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-transform')).toContain('0px');
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('40px');
    });

    fireEvent.click(getRadio('Month'));

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-transform')).toContain('140px');
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('40px');
      expect(root.dataset.dragging).toBe('false');
    });
  });

  it('updates instant indicator geometry immediately', async () => {
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        options={baseOptions}
        geometry={{ indicator: { transition: 'instant' } }}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    setElementRect(list, { left: 0, top: 0, width: 320, height: 48 });
    setElementRect(labels[0] as Element, { left: 0, top: 0, width: 72, height: 48 });
    setElementRect(labels[1] as Element, { left: 84, top: 0, width: 116, height: 48 });
    setElementRect(labels[2] as Element, { left: 212, top: 0, width: 96, height: 48 });
    triggerResizeObservers();

    await waitFor(() => {
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('70px');
    });

    fireEvent.click(getRadio('Week'));

    await waitFor(() => {
      expect(root.dataset.rscIndicatorTransition).toBe('instant');
      expect(getCssVar(root, '--_rsc-indicator-width')).toBe('114px');
      expect(getCssVar(root, '--_rsc-indicator-transform')).toContain('85px');
    });
  });

  it('keeps drag layout live while moving and clears preview state after release', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SegmentedChoice
        ariaLabel="Range"
        defaultValue="day"
        onValueChange={onValueChange}
        options={baseOptions}
      />
    );

    const root = container.querySelector('.rsc-root') as HTMLDivElement;
    const list = container.querySelector('.rsc-list') as HTMLDivElement;
    const labels = Array.from(container.querySelectorAll('.rsc-option'));
    Object.assign(list, {
      releasePointerCapture: vi.fn(),
      setPointerCapture: vi.fn(),
    });
    setElementRect(list, { left: 0, top: 0, width: 280, height: 48 });
    setRectsForAxis(labels, 'horizontal', { size: 84, gap: 12, crossSize: 48 });
    triggerResizeObservers();

    fireEvent.pointerDown(labels[0] as Element, {
      button: 0,
      clientX: 20,
      clientY: 24,
      pointerId: 83,
    });

    expect(root.dataset.dragging).toBe('true');
    expect(root.dataset.rscDragPreviewing).toBe('false');

    fireEvent.pointerMove(list, {
      clientX: 206,
      clientY: 24,
      pointerId: 83,
    });

    expect(root.dataset.dragging).toBe('true');
    expect(root.dataset.rscDragPreviewing).toBe('true');
    const dragTransform = getCssVar(root, '--_rsc-indicator-transform');
    expect(dragTransform).toContain('187px');

    fireEvent.pointerUp(list, {
      clientX: 206,
      clientY: 24,
      pointerId: 83,
    });

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith('month');
      expect((getRadio('Month') as HTMLInputElement).checked).toBe(true);
      expect(root.dataset.dragging).toBe('false');
      expect(root.dataset.rscDragPreviewing).toBe('false');
      expect(getCssVar(root, '--_rsc-indicator-transform')).toBe(dragTransform);
    });
  });
}

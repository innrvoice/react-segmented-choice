import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

import { __resetSegmentedChoiceWarnings } from '../SegmentedChoice.warnings';

const resizeObserverCallbacks = new Set<ResizeObserverCallback>();

class MockResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    resizeObserverCallbacks.add(callback);
  }

  observe() {}
  unobserve() {}
  disconnect() {
    resizeObserverCallbacks.delete(this.callback);
  }
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
});

afterEach(() => {
  cleanup();
  __resetSegmentedChoiceWarnings();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

export function setElementRect(
  element: Element,
  rect: Partial<DOMRect> & Pick<DOMRect, 'width' | 'height' | 'top' | 'left'>
) {
  const normalizedRect = {
    x: rect.left,
    y: rect.top,
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    toJSON() {
      return this;
    },
    ...(rect as object),
  } satisfies DOMRect;

  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => normalizedRect,
  });
}

export function triggerResizeObservers() {
  for (const callback of resizeObserverCallbacks) {
    callback([], {} as ResizeObserver);
  }
}

export function setRectsForAxis(
  elements: Element[],
  orientation: 'horizontal' | 'vertical',
  {
    start = 0,
    size = 80,
    gap = 8,
    crossSize = 40,
  }: {
    crossSize?: number;
    gap?: number;
    size?: number;
    start?: number;
  } = {}
) {
  elements.forEach((element, index) => {
    const primaryStart = start + index * (size + gap);
    if (orientation === 'horizontal') {
      setElementRect(element, {
        left: primaryStart,
        top: 0,
        width: size,
        height: crossSize,
      });
      return;
    }

    setElementRect(element, {
      left: 0,
      top: primaryStart,
      width: crossSize,
      height: size,
    });
  });
}

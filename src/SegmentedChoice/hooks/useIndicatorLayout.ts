import type React from 'react';
import { useCallback, useState } from 'react';

import { getCenteredBoxLayout, getRelativeBoxLayout } from '../internal/geometry';
import { measureOptionRect } from '../internal/measureOptionRect';
import { useObservedMeasurement } from './useObservedMeasurement';

export type IndicatorLayout = {
  height: number;
  isVisible: boolean;
  width: number;
  x: number;
  y: number;
};

export function measureIndicatorLayout({
  activeIndex,
  centerToOption,
  indicatorRef,
  inset,
  listRef,
  measureRefs,
  optionRefs,
  sizeAdjustment,
  useRenderedIndicatorSize,
}: {
  activeIndex: number;
  centerToOption: boolean;
  indicatorRef?: React.RefObject<HTMLElement | null>;
  inset: number;
  listRef: React.RefObject<HTMLDivElement | null>;
  measureRefs: React.RefObject<Array<HTMLElement | null>>;
  optionRefs: React.RefObject<Array<HTMLLabelElement | null>>;
  sizeAdjustment: number;
  useRenderedIndicatorSize: boolean;
}) {
  const listElement = listRef.current;
  if (!listElement) {
    return null;
  }

  const measureRect = measureOptionRect({
    index: activeIndex,
    measureRefs,
    optionRefs,
  });

  if (!measureRect) {
    return null;
  }

  const listRect = listElement.getBoundingClientRect();
  const indicatorElement = indicatorRef?.current;
  const renderedIndicatorWidth = indicatorElement?.offsetWidth ?? 0;
  const renderedIndicatorHeight = indicatorElement?.offsetHeight ?? 0;
  const desiredWidth =
    centerToOption && useRenderedIndicatorSize && renderedIndicatorWidth > 0
      ? renderedIndicatorWidth
      : Math.max(measureRect.width + sizeAdjustment, 0);
  const desiredHeight =
    centerToOption && useRenderedIndicatorSize && renderedIndicatorHeight > 0
      ? renderedIndicatorHeight
      : Math.max(measureRect.height + sizeAdjustment, 0);
  return centerToOption
    ? getCenteredBoxLayout({
        anchorRect: measureRect,
        containerRect: listRect,
        height: desiredHeight,
        scrollLeft: listElement.scrollLeft,
        scrollTop: listElement.scrollTop,
        width: desiredWidth,
      })
    : getRelativeBoxLayout({
        containerRect: listRect,
        height: Math.max(measureRect.height - inset * 2, 0),
        left: measureRect.left + inset,
        scrollLeft: listElement.scrollLeft,
        scrollTop: listElement.scrollTop,
        top: measureRect.top + inset,
        width: Math.max(measureRect.width - inset * 2, 0),
      });
}

function getInitialLayout(): IndicatorLayout {
  return {
    height: 0,
    isVisible: false,
    width: 0,
    x: 0,
    y: 0,
  };
}

export function useIndicatorLayout({
  activeIndex,
  centerToOption,
  indicatorRef,
  inset,
  listRef,
  measureRefs,
  optionCount,
  optionRefs,
  overrideLayout,
  sizeAdjustment,
  useRenderedIndicatorSize,
}: {
  activeIndex: number;
  centerToOption: boolean;
  indicatorRef: React.RefObject<HTMLElement | null>;
  inset: number;
  listRef: React.RefObject<HTMLDivElement | null>;
  measureRefs: React.RefObject<Array<HTMLElement | null>>;
  optionCount: number;
  optionRefs: React.RefObject<Array<HTMLLabelElement | null>>;
  overrideLayout?: Omit<IndicatorLayout, 'isVisible'> | null;
  sizeAdjustment: number;
  useRenderedIndicatorSize: boolean;
}) {
  const [layout, setLayout] = useState<IndicatorLayout>(getInitialLayout);

  const measure = useCallback(() => {
    const measuredLayout = measureIndicatorLayout({
      activeIndex,
      centerToOption,
      indicatorRef,
      inset,
      listRef,
      measureRefs,
      optionRefs,
      sizeAdjustment,
      useRenderedIndicatorSize,
    });

    if (!measuredLayout) {
      setLayout(current => (current.isVisible ? getInitialLayout() : current));
      return;
    }

    setLayout({
      ...measuredLayout,
      isVisible: true,
    });
  }, [
    activeIndex,
    centerToOption,
    indicatorRef,
    inset,
    listRef,
    measureRefs,
    optionCount,
    optionRefs,
    sizeAdjustment,
    useRenderedIndicatorSize,
  ]);

  const observeElements = useCallback(
    () => [
      listRef.current,
      ...optionRefs.current.slice(0, optionCount),
      ...measureRefs.current.slice(0, optionCount),
    ],
    [listRef, measureRefs, optionCount, optionRefs]
  );

  useObservedMeasurement({
    measure,
    observeElements,
  });

  if (overrideLayout) {
    return {
      ...overrideLayout,
      isVisible: true,
    };
  }

  return layout;
}

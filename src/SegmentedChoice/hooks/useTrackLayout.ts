import { useCallback, useState } from 'react';

import { measureOptionRect } from '../internal/measureOptionRect';
import type { SegmentedChoiceOption, SegmentedChoiceValue } from '../SegmentedChoice.types';
import { useObservedMeasurement } from './useObservedMeasurement';

export type TrackLayout =
  | {
      visible: false;
    }
  | {
      height: number;
      visible: true;
      width: number;
      x: number;
      y: number;
    };

function getInitialLayout(): TrackLayout {
  return { visible: false };
}

function measureTrackLayout<T extends SegmentedChoiceValue>({
  listRef,
  measureRefs,
  optionRefs,
  options,
  orientation,
}: {
  listRef: React.RefObject<HTMLDivElement | null>;
  measureRefs: React.RefObject<Array<HTMLElement | null>>;
  optionRefs: React.RefObject<Array<HTMLLabelElement | null>>;
  options: readonly SegmentedChoiceOption<T>[];
  orientation: 'horizontal' | 'vertical';
}) {
  const listElement = listRef.current;
  if (!listElement) {
    return null;
  }

  if (options.length === 0) {
    return null;
  }

  const firstIndex = 0;
  const lastIndex = options.length - 1;

  const firstRect = measureOptionRect({
    index: firstIndex,
    measureRefs,
    optionRefs,
  });
  const lastRect = measureOptionRect({
    index: lastIndex,
    measureRefs,
    optionRefs,
  });

  if (!firstRect || !lastRect) {
    return null;
  }

  const listRect = listElement.getBoundingClientRect();

  if (orientation === 'horizontal') {
    const start = firstRect.left - listRect.left + listElement.scrollLeft + firstRect.width / 2;
    const end = lastRect.left - listRect.left + listElement.scrollLeft + lastRect.width / 2;
    const y = firstRect.top - listRect.top + listElement.scrollTop + firstRect.height / 2;

    return {
      height: 0,
      visible: true,
      width: Math.max(end - start, 0),
      x: start,
      y,
    } satisfies TrackLayout;
  }

  const start = firstRect.top - listRect.top + listElement.scrollTop + firstRect.height / 2;
  const end = lastRect.top - listRect.top + listElement.scrollTop + lastRect.height / 2;
  const x = firstRect.left - listRect.left + listElement.scrollLeft + firstRect.width / 2;

  return {
    height: Math.max(end - start, 0),
    visible: true,
    width: 0,
    x,
    y: start,
  } satisfies TrackLayout;
}

export function useTrackLayout<T extends SegmentedChoiceValue>({
  listRef,
  measureRefs,
  optionCount,
  optionRefs,
  options,
  orientation,
  trackLayout,
}: {
  listRef: React.RefObject<HTMLDivElement | null>;
  measureRefs: React.RefObject<Array<HTMLElement | null>>;
  optionCount: number;
  optionRefs: React.RefObject<Array<HTMLLabelElement | null>>;
  options: readonly SegmentedChoiceOption<T>[];
  orientation: 'horizontal' | 'vertical';
  trackLayout: 'center-span' | 'container';
}) {
  const [layout, setLayout] = useState<TrackLayout>(getInitialLayout);

  const measure = useCallback(() => {
    if (trackLayout !== 'center-span') {
      setLayout(current => (current.visible ? getInitialLayout() : current));
      return;
    }

    const nextLayout = measureTrackLayout({
      listRef,
      measureRefs,
      optionRefs,
      options,
      orientation,
    });

    if (!nextLayout) {
      setLayout(current => (current.visible ? getInitialLayout() : current));
      return;
    }

    setLayout(nextLayout);
  }, [listRef, measureRefs, optionRefs, options, orientation, trackLayout]);

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

  return layout;
}

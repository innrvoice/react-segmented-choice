import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  findNearestEnabledIndex,
  getAxisBounds,
  getAxisCoordinate,
  type IndexedAxisBounds,
  type RelativeBoxLayout,
} from '../internal/geometry';
import { getDragProjection } from '../internal/getDragProjection';
import { measureOptionRect } from '../internal/measureOptionRect';
import type { SegmentedChoiceOption, SegmentedChoiceValue } from '../SegmentedChoice.types';
import { measureIndicatorLayout } from './useIndicatorLayout';

const DRAG_RELEASED_DURATION_MS = 320;

function getLayoutCenterCoordinate({
  layout,
  listElement,
  orientation,
}: {
  layout: RelativeBoxLayout;
  listElement: HTMLDivElement;
  orientation: 'horizontal' | 'vertical';
}) {
  const listRect = listElement.getBoundingClientRect();

  return orientation === 'horizontal'
    ? listRect.left - listElement.scrollLeft + layout.x + layout.width / 2
    : listRect.top - listElement.scrollTop + layout.y + layout.height / 2;
}

export function useDragSelection<T extends SegmentedChoiceValue>({
  centerToOption,
  disabled,
  draggable,
  indicatorRef,
  inset,
  listRef,
  measureRefs,
  onCommitIndex,
  optionRefs,
  options,
  orientation,
  selectionMode,
  selectedIndex,
  sizeAdjustment,
  useRenderedIndicatorSize,
}: {
  centerToOption: boolean;
  disabled: boolean;
  draggable: boolean;
  indicatorRef: React.RefObject<HTMLElement | null>;
  inset: number;
  listRef: React.RefObject<HTMLDivElement | null>;
  measureRefs: React.RefObject<Array<HTMLElement | null>>;
  onCommitIndex: (index: number) => void;
  optionRefs: React.RefObject<Array<HTMLLabelElement | null>>;
  options: readonly SegmentedChoiceOption<T>[];
  orientation: 'horizontal' | 'vertical';
  selectionMode: 'underlay' | 'overlay';
  selectedIndex: number;
  sizeAdjustment: number;
  useRenderedIndicatorSize: boolean;
}) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragPreviewing, setDragPreviewing] = useState(false);
  const [dragReleased, setDragReleased] = useState(false);
  const [dragLayout, setDragLayout] = useState<{
    height: number;
    width: number;
    x: number;
    y: number;
  } | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const activePointerElementRef = useRef<HTMLDivElement | null>(null);
  const dragReleasedTimeoutRef = useRef<number | null>(null);
  const dragPreviewingRef = useRef(false);
  const initialIndexRef = useRef<number>(-1);
  const initialCoordinateRef = useRef<number | null>(null);
  const lastCoordinateRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<-1 | 0 | 1>(0);
  const initialLayoutRef = useRef<{
    height: number;
    width: number;
    x: number;
    y: number;
  } | null>(null);
  const optionsSignature = useMemo(
    () => options.map(option => `${option.value}:${option.disabled ? '1' : '0'}`).join('|'),
    [options]
  );

  const clearDragReleasedTimeout = useCallback(() => {
    if (dragReleasedTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(dragReleasedTimeoutRef.current);
    dragReleasedTimeoutRef.current = null;
  }, []);

  const startDragReleased = useCallback(() => {
    clearDragReleasedTimeout();
    setDragReleased(true);
    dragReleasedTimeoutRef.current = window.setTimeout(() => {
      dragReleasedTimeoutRef.current = null;
      setDragReleased(false);
    }, DRAG_RELEASED_DURATION_MS);
  }, [clearDragReleasedTimeout]);

  const getEnabledBounds = useCallback(() => {
    const bounds: IndexedAxisBounds[] = [];

    for (const [index, option] of options.entries()) {
      if (option.disabled) {
        continue;
      }

      const rect = measureOptionRect({
        index,
        measureRefs,
        optionRefs,
      });
      if (!rect) {
        continue;
      }

      bounds.push({
        ...getAxisBounds(orientation, rect),
        index,
      });
    }

    return bounds;
  }, [measureRefs, optionRefs, options, orientation]);

  const getProjection = useCallback(
    (coordinate: number) => {
      const listElement = listRef.current;
      const initialLayout = initialLayoutRef.current;
      const initialCoordinate = initialCoordinateRef.current;

      if (!listElement || !initialLayout || initialCoordinate === null) {
        return null;
      }

      return getDragProjection({
        coordinate,
        currentIndex: initialIndexRef.current,
        enabledBounds: getEnabledBounds(),
        initialCoordinate,
        initialLayout,
        lastDirection: lastDirectionRef.current,
        listRect: listElement.getBoundingClientRect(),
        measurePreviewLayout: useRenderedIndicatorSize
          ? undefined
          : resolvedIndex =>
              measureIndicatorLayout({
                activeIndex: resolvedIndex,
                centerToOption,
                indicatorRef,
                inset,
                listRef,
                measureRefs,
                optionRefs,
                sizeAdjustment,
                useRenderedIndicatorSize,
              }),
        orientation,
        scrollLeft: listElement.scrollLeft,
        scrollTop: listElement.scrollTop,
      });
    },
    [
      centerToOption,
      getEnabledBounds,
      indicatorRef,
      inset,
      listRef,
      measureRefs,
      optionRefs,
      options.length,
      orientation,
      sizeAdjustment,
      useRenderedIndicatorSize,
    ]
  );

  const reset = useCallback(({ preserveLayout = false }: { preserveLayout?: boolean } = {}) => {
    activePointerIdRef.current = null;
    initialCoordinateRef.current = null;
    initialIndexRef.current = -1;
    initialLayoutRef.current = null;
    lastCoordinateRef.current = null;
    lastDirectionRef.current = 0;
    activePointerElementRef.current = null;
    setDragging(false);
    dragPreviewingRef.current = false;
    setDragPreviewing(false);
    if (!preserveLayout) {
      setDragLayout(null);
    }
    setPreviewIndex(null);
  }, []);

  const releaseActivePointerCapture = useCallback(
    (pointerId: number | null) => {
      if (pointerId === null) {
        return;
      }

      const listElement = activePointerElementRef.current ?? listRef.current;
      if (!listElement || typeof listElement.releasePointerCapture !== 'function') {
        return;
      }

      try {
        listElement.releasePointerCapture(pointerId);
      } catch {
        // releasePointerCapture may throw when the pointer was already released.
      }
    },
    [listRef]
  );

  const cancelDrag = useCallback(() => {
    if (activePointerIdRef.current === null) {
      return;
    }

    releaseActivePointerCapture(activePointerIdRef.current);
    reset();
  }, [releaseActivePointerCapture, reset]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || !draggable || event.button !== 0) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const optionElement = target?.closest<HTMLLabelElement>('.rsc-option');
      const indicatorElement = target?.closest<HTMLElement>('.rsc-indicator');
      const startsFromListSurface = !optionElement && !indicatorElement;
      const pointerCoordinate = getAxisCoordinate(orientation, event.nativeEvent);

      const clickedIndex = (() => {
        if (optionElement) {
          return optionRefs.current.findIndex(optionRef => optionRef === optionElement);
        }

        if (selectionMode === 'overlay' && indicatorElement) {
          return selectedIndex;
        }

        return findNearestEnabledIndex(pointerCoordinate, getEnabledBounds());
      })();

      if (Number.isNaN(clickedIndex) || clickedIndex < 0 || options[clickedIndex]?.disabled) {
        return;
      }

      if (
        selectionMode === 'overlay' &&
        optionElement &&
        !indicatorElement &&
        clickedIndex !== (selectedIndex >= 0 ? selectedIndex : clickedIndex)
      ) {
        return;
      }

      const dragOriginIndex =
        (selectionMode === 'overlay' || startsFromListSurface) && selectedIndex >= 0
          ? selectedIndex
          : clickedIndex;
      const initialLayout = measureIndicatorLayout({
        activeIndex: dragOriginIndex,
        centerToOption,
        indicatorRef,
        inset,
        listRef,
        measureRefs,
        optionRefs,
        sizeAdjustment,
        useRenderedIndicatorSize,
      });

      if (!initialLayout) {
        return;
      }

      clearDragReleasedTimeout();
      setDragReleased(false);
      event.preventDefault();
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic browser-test pointer events may not register as capturable pointers.
      }
      activePointerIdRef.current = event.pointerId;
      activePointerElementRef.current = event.currentTarget;
      initialIndexRef.current = dragOriginIndex;
      initialCoordinateRef.current = startsFromListSurface
        ? getLayoutCenterCoordinate({
            layout: initialLayout,
            listElement: event.currentTarget,
            orientation,
          })
        : pointerCoordinate;
      lastCoordinateRef.current = initialCoordinateRef.current;
      initialLayoutRef.current = initialLayout;
      const initialProjection = startsFromListSurface ? getProjection(pointerCoordinate) : null;
      const initialDragPreviewing = initialProjection !== null;

      setDragLayout(initialProjection?.layout ?? initialLayoutRef.current);
      setDragging(true);
      dragPreviewingRef.current = initialDragPreviewing;
      setDragPreviewing(initialDragPreviewing);
      setPreviewIndex(
        initialProjection?.resolvedIndex !== undefined && initialProjection.resolvedIndex >= 0
          ? initialProjection.resolvedIndex
          : clickedIndex
      );
    },
    [
      centerToOption,
      clearDragReleasedTimeout,
      disabled,
      draggable,
      getEnabledBounds,
      getProjection,
      indicatorRef,
      inset,
      listRef,
      measureRefs,
      optionRefs,
      options,
      orientation,
      selectedIndex,
      selectionMode,
      sizeAdjustment,
      useRenderedIndicatorSize,
    ]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (activePointerIdRef.current !== event.pointerId) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      const coordinate = getAxisCoordinate(orientation, event.nativeEvent);
      const previousCoordinate = lastCoordinateRef.current;
      if (previousCoordinate !== null) {
        const delta = coordinate - previousCoordinate;
        if (Math.abs(delta) >= 2) {
          lastDirectionRef.current = delta > 0 ? 1 : -1;
        }
      }
      lastCoordinateRef.current = coordinate;

      const projection = getProjection(coordinate);
      if (projection) {
        dragPreviewingRef.current = true;
        setDragPreviewing(true);
        setDragLayout(projection.layout);
        if (projection.resolvedIndex >= 0) {
          setPreviewIndex(projection.resolvedIndex);
        }
      }
    },
    [getProjection, orientation]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (activePointerIdRef.current !== event.pointerId) {
        return;
      }

      const projection = getProjection(getAxisCoordinate(orientation, event.nativeEvent));
      const wasDragPreviewing = dragPreviewingRef.current;
      if (projection?.resolvedIndex !== undefined && projection.resolvedIndex >= 0) {
        setDragLayout(projection.layout);
        onCommitIndex(projection.resolvedIndex);
      }

      releaseActivePointerCapture(activePointerIdRef.current);
      reset({ preserveLayout: projection !== null });
      if (wasDragPreviewing) {
        startDragReleased();
      }
    },
    [
      getProjection,
      onCommitIndex,
      orientation,
      releaseActivePointerCapture,
      reset,
      startDragReleased,
    ]
  );

  const handlePointerCancel = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (activePointerIdRef.current !== event.pointerId) {
        return;
      }

      const wasDragPreviewing = dragPreviewingRef.current;
      cancelDrag();
      if (wasDragPreviewing) {
        startDragReleased();
      }
    },
    [cancelDrag, startDragReleased]
  );

  useEffect(
    () => () => {
      clearDragReleasedTimeout();
      cancelDrag();
    },
    [cancelDrag, clearDragReleasedTimeout]
  );

  useEffect(() => {
    if (dragging || dragLayout === null) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setDragLayout(null);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [dragLayout, dragging]);

  useEffect(() => {
    const handleWindowBlur = () => {
      cancelDrag();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        cancelDrag();
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cancelDrag]);

  useEffect(() => {
    cancelDrag();
  }, [
    cancelDrag,
    centerToOption,
    disabled,
    draggable,
    inset,
    optionsSignature,
    orientation,
    selectionMode,
    sizeAdjustment,
    useRenderedIndicatorSize,
  ]);

  return {
    dragLayout,
    dragReleased,
    dragPreviewing,
    dragging,
    previewIndex,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}

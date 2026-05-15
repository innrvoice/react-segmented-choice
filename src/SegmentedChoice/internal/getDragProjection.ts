import {
  clamp,
  resolveCommitIndex,
  type AxisOrientation,
  type IndexedAxisBounds,
  type RelativeBoxLayout,
} from './geometry';

function getProjectedCenterCoordinate({
  layout,
  listRect,
  orientation,
  scrollLeft,
  scrollTop,
}: {
  layout: RelativeBoxLayout;
  listRect: DOMRect;
  orientation: AxisOrientation;
  scrollLeft: number;
  scrollTop: number;
}) {
  return orientation === 'horizontal'
    ? listRect.left - scrollLeft + layout.x + layout.width / 2
    : listRect.top - scrollTop + layout.y + layout.height / 2;
}

export function getDragProjection({
  coordinate,
  currentIndex,
  enabledBounds,
  initialCoordinate,
  initialLayout,
  lastDirection,
  listRect,
  measurePreviewLayout,
  orientation,
  scrollLeft,
  scrollTop,
}: {
  coordinate: number;
  currentIndex: number;
  enabledBounds: readonly IndexedAxisBounds[];
  initialCoordinate: number;
  initialLayout: RelativeBoxLayout;
  lastDirection: -1 | 0 | 1;
  listRect: DOMRect;
  measurePreviewLayout?: (resolvedIndex: number) => RelativeBoxLayout | null;
  orientation: AxisOrientation;
  scrollLeft: number;
  scrollTop: number;
}) {
  const delta = coordinate - initialCoordinate;
  const initialPrimarySize =
    orientation === 'horizontal' ? initialLayout.width : initialLayout.height;
  const projectedCenter =
    (orientation === 'horizontal' ? initialLayout.x : initialLayout.y) +
    initialPrimarySize / 2 +
    delta;
  const maxInitialOffset =
    orientation === 'horizontal'
      ? Math.max(listRect.width - initialLayout.width, 0)
      : Math.max(listRect.height - initialLayout.height, 0);
  const initialPrimaryOffset = clamp(projectedCenter - initialPrimarySize / 2, 0, maxInitialOffset);

  let layout = {
    ...initialLayout,
    x: orientation === 'horizontal' ? initialPrimaryOffset : initialLayout.x,
    y: orientation === 'vertical' ? initialPrimaryOffset : initialLayout.y,
  } satisfies RelativeBoxLayout;
  const previewIndexForLayout = resolveCommitIndex(
    getProjectedCenterCoordinate({
      layout,
      listRect,
      orientation,
      scrollLeft,
      scrollTop,
    }),
    enabledBounds,
    {
      currentIndex,
      lastDirection,
    }
  );

  if (measurePreviewLayout && previewIndexForLayout >= 0) {
    const previewLayout = measurePreviewLayout(previewIndexForLayout);

    if (previewLayout) {
      const previewPrimarySize =
        orientation === 'horizontal' ? previewLayout.width : previewLayout.height;
      const maxPreviewOffset =
        orientation === 'horizontal'
          ? Math.max(listRect.width - previewLayout.width, 0)
          : Math.max(listRect.height - previewLayout.height, 0);
      const previewPrimaryOffset = clamp(
        projectedCenter - previewPrimarySize / 2,
        0,
        maxPreviewOffset
      );

      layout = {
        ...previewLayout,
        x: orientation === 'horizontal' ? previewPrimaryOffset : previewLayout.x,
        y: orientation === 'vertical' ? previewPrimaryOffset : previewLayout.y,
      };
    }
  }

  return {
    layout,
    resolvedIndex: resolveCommitIndex(
      getProjectedCenterCoordinate({
        layout,
        listRect,
        orientation,
        scrollLeft,
        scrollTop,
      }),
      enabledBounds,
      {
        currentIndex,
        lastDirection,
      }
    ),
  };
}

import type {
  SegmentedChoiceGeometry,
  SegmentedChoiceIndicatorContentMode,
  SegmentedChoiceIndicatorStyle,
  SegmentedChoiceIndicatorTransition,
  SegmentedChoiceTrackLayout,
  SegmentedChoiceTrackStyle,
} from '../SegmentedChoice.types';

export type ResolvedGeometryConfig = {
  anchorHeight: number | undefined;
  anchorWidth: number | undefined;
  dragScale: boolean | number | undefined;
  indicatorHeight: number | undefined;
  indicatorBorderWidth: number | undefined;
  indicatorContentMode: SegmentedChoiceIndicatorContentMode;
  indicatorInset: number | undefined;
  indicatorStyle: SegmentedChoiceIndicatorStyle;
  indicatorTransition: SegmentedChoiceIndicatorTransition;
  indicatorWidth: number | undefined;
  mode: 'underlay' | 'overlay';
  optionSize: number | undefined;
  trackLayout: SegmentedChoiceTrackLayout;
  trackStyle: SegmentedChoiceTrackStyle;
};

function resolveBoxSize(size: { height?: number; size?: number; width?: number } | undefined) {
  const width = size?.width ?? size?.size;
  const height = size?.height ?? size?.size;

  return {
    height,
    width,
  };
}

export function resolveGeometryConfig(
  geometry: SegmentedChoiceGeometry | undefined
): ResolvedGeometryConfig {
  const anchorSize = resolveBoxSize(geometry?.anchor);
  const indicatorSize = resolveBoxSize(geometry?.indicator);

  return {
    anchorHeight: anchorSize.height,
    anchorWidth: anchorSize.width,
    dragScale: geometry?.dragScale,
    indicatorBorderWidth: geometry?.indicator?.borderWidth,
    indicatorContentMode: geometry?.indicator?.content ?? 'none',
    indicatorHeight: indicatorSize.height,
    indicatorInset: geometry?.indicator?.inset,
    indicatorStyle: geometry?.indicator?.style ?? 'fill',
    indicatorTransition: geometry?.indicator?.transition ?? 'smooth',
    indicatorWidth: indicatorSize.width,
    mode: geometry?.mode ?? 'underlay',
    optionSize: geometry?.optionSize,
    trackLayout: geometry?.track?.layout ?? 'container',
    trackStyle: geometry?.track?.style ?? 'surface',
  };
}

export function resolveDragScale(value: boolean | number | undefined) {
  if (typeof value === 'number') {
    return value;
  }

  if (value) {
    return 1.1;
  }

  return 1;
}

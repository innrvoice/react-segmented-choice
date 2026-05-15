import type { EqualDistributionLayout } from '../hooks/useEqualDistributionLayout';
import type { IndicatorLayout } from '../hooks/useIndicatorLayout';
import type { TrackLayout } from '../hooks/useTrackLayout';
import { buildScopedRule, sanitizeAccentColor, toCssLength } from './runtimeStyles';

export function buildSegmentedChoiceRuntimeRule({
  anchorHeight,
  anchorWidth,
  equalDistributionLayout,
  indicatorBorderWidth,
  indicatorColor,
  indicatorCursor,
  indicatorHeight,
  indicatorLayout,
  indicatorScale,
  indicatorWidth,
  instanceId,
  listCursor,
  listTouchAction,
  optionSize,
  resolvedOptionSizing,
  resolvedTrackLayout,
  trackLayout,
}: {
  anchorHeight: number | undefined;
  anchorWidth: number | undefined;
  equalDistributionLayout: EqualDistributionLayout;
  indicatorBorderWidth: number | undefined;
  indicatorColor: string | undefined;
  indicatorCursor: string | undefined;
  indicatorHeight: number | undefined;
  indicatorLayout: IndicatorLayout;
  indicatorScale: number;
  indicatorWidth: number | undefined;
  instanceId: string;
  listCursor: string | undefined;
  listTouchAction: string | undefined;
  optionSize: number | undefined;
  resolvedOptionSizing: 'content' | 'equal' | 'fixed';
  resolvedTrackLayout: 'center-span' | 'container';
  trackLayout: TrackLayout;
}) {
  const indicatorWidthValue = toCssLength(
    indicatorWidth !== undefined ? indicatorWidth : indicatorLayout.width
  );
  const indicatorHeightValue = toCssLength(
    indicatorHeight !== undefined ? indicatorHeight : indicatorLayout.height
  );

  return buildScopedRule({
    instanceId,
    declarations: [
      ['--_rsc-anchor-width', toCssLength(anchorWidth)],
      ['--_rsc-anchor-height', toCssLength(anchorHeight)],
      ['--_rsc-option-size', toCssLength(optionSize)],
      ['--_rsc-indicator-border-width', toCssLength(indicatorBorderWidth)],
      ['--_rsc-indicator-width', indicatorWidthValue],
      ['--_rsc-indicator-height', indicatorHeightValue],
      ['--_rsc-indicator-opacity', indicatorLayout.isVisible ? '1' : '0'],
      [
        '--_rsc-indicator-transform',
        `translate3d(${indicatorLayout.x}px, ${indicatorLayout.y}px, 0px) scale(${indicatorScale})`,
      ],
      ['--_rsc-indicator-cursor', indicatorCursor],
      ['--_rsc-indicator-color', sanitizeAccentColor(indicatorColor)],
      ['--_rsc-list-cursor', listCursor],
      ['--_rsc-list-touch-action', listTouchAction],
      [
        '--_rsc-track-x',
        resolvedTrackLayout === 'center-span' && trackLayout.visible
          ? `${trackLayout.x}px`
          : undefined,
      ],
      [
        '--_rsc-track-y',
        resolvedTrackLayout === 'center-span' && trackLayout.visible
          ? `${trackLayout.y}px`
          : undefined,
      ],
      [
        '--_rsc-track-width',
        resolvedTrackLayout === 'center-span' && trackLayout.visible
          ? `${trackLayout.width}px`
          : undefined,
      ],
      [
        '--_rsc-track-height',
        resolvedTrackLayout === 'center-span' && trackLayout.visible
          ? `${trackLayout.height}px`
          : undefined,
      ],
      [
        '--_rsc-equal-option-inline-size',
        resolvedOptionSizing === 'equal' && equalDistributionLayout.visible
          ? `${equalDistributionLayout.inlineSize}px`
          : undefined,
      ],
      [
        '--_rsc-equal-option-block-size',
        resolvedOptionSizing === 'equal' && equalDistributionLayout.visible
          ? `${equalDistributionLayout.blockSize}px`
          : undefined,
      ],
    ],
  });
}

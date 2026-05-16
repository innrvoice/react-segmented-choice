import React, {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { SegmentedChoiceOptionRow } from './components/SegmentedChoiceOption';
import { SegmentedChoiceOptionText } from './components/SegmentedChoiceOptionText';
import { useControllableValue } from './hooks/useControllableValue';
import { useDragSelection } from './hooks/useDragSelection';
import { useEqualDistributionLayout } from './hooks/useEqualDistributionLayout';
import { useIndicatorLayout } from './hooks/useIndicatorLayout';
import { useSegmentedChoiceInteractions } from './hooks/useSegmentedChoiceInteractions';
import { useTrackLayout } from './hooks/useTrackLayout';
import { buildSegmentedChoiceRuntimeRule } from './internal/buildSegmentedChoiceRuntimeRule';
import { joinClassNames } from './internal/classNames';
import { getFirstEnabledIndex } from './internal/keyboard';
import { resolveDragScale, resolveGeometryConfig } from './internal/resolveGeometry';
import { sanitizeAccentColor, toInstanceId, useRuntimeStyleRule } from './internal/runtimeStyles';
import { normalizeSlotProps } from './internal/slotProps';
import {
  getNonTextOptionsMissingAriaLabel,
  isSelectableValue,
  stringifyValue,
  validateOptionsStructure,
} from './internal/validation';
import type {
  SegmentedChoiceOptionSizing,
  SegmentedChoiceProps,
  SegmentedChoiceValue,
} from './SegmentedChoice.types';
import {
  warnDuplicateValues,
  warnInvalidControlledValue,
  warnInvalidAccentColor,
  warnInvalidDefaultValue,
  warnMissingAriaLabel,
  warnMissingGroupLabel,
  warnNonStringOptionValues,
  warnTooFewOptions,
} from './SegmentedChoice.warnings';

function callAll<Args extends unknown[]>(
  ...callbacks: Array<((...args: Args) => void) | undefined>
) {
  return (...args: Args) => {
    for (const callback of callbacks) {
      callback?.(...args);
    }
  };
}

function setForwardedRef<T>(ref: React.ForwardedRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

function resolveIndicatorInsetPx({
  indicatorInset,
  selectionMode,
  trackStyle,
  unstyled,
}: {
  indicatorInset: number | undefined;
  selectionMode: string;
  trackStyle: string;
  unstyled: boolean;
}) {
  if (indicatorInset !== undefined) {
    return indicatorInset;
  }

  if (!unstyled && selectionMode === 'underlay' && trackStyle === 'surface') {
    return 1;
  }

  return 0;
}

function resolveShouldRenderAnchor({
  anchorHeight,
  anchorWidth,
  hasExplicitAnchorSlot,
  indicatorStyle,
  selectionMode,
  trackLayout,
}: {
  anchorHeight: number | undefined;
  anchorWidth: number | undefined;
  hasExplicitAnchorSlot: boolean;
  indicatorStyle: string;
  selectionMode: string;
  trackLayout: string;
}) {
  return (
    hasExplicitAnchorSlot ||
    anchorWidth !== undefined ||
    anchorHeight !== undefined ||
    selectionMode === 'overlay' ||
    trackLayout === 'center-span' ||
    indicatorStyle === 'ring'
  );
}

function isNearLayoutSize(measured: number, expected: number) {
  return Math.abs(measured - expected) < 0.5;
}

function InnerSegmentedChoice<T extends SegmentedChoiceValue>(
  {
    ariaDescribedby,
    ariaLabel,
    ariaLabelledby,
    className,
    defaultValue,
    disabled = false,
    draggable = true,
    loop = true,
    name,
    onValueChange,
    optionDistribution = 'space-between',
    optionSizing = 'equal',
    options,
    orientation = 'horizontal',
    required = false,
    size = 'md',
    slotProps,
    styleNonce,
    unstyled = false,
    value,
    geometry,
  }: SegmentedChoiceProps<T>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
  // Validate the public contract early so the rest of the component can assume
  // options are structurally usable.
  const structuralValidation = useMemo(() => validateOptionsStructure(options), [options]);

  useEffect(() => {
    if (structuralValidation.valid) {
      return;
    }

    if (structuralValidation.optionCount < 2) {
      warnTooFewOptions(structuralValidation.optionCount);
    }

    if (structuralValidation.invalidValueIndexes.length > 0) {
      warnNonStringOptionValues(structuralValidation.invalidValueIndexes);
    }

    if (structuralValidation.duplicateValues.length > 0) {
      warnDuplicateValues(structuralValidation.duplicateValues);
    }
  }, [structuralValidation]);

  useEffect(() => {
    if (!ariaLabel && !ariaLabelledby) {
      warnMissingGroupLabel();
    }
  }, [ariaLabel, ariaLabelledby]);

  useEffect(() => {
    for (const optionValue of getNonTextOptionsMissingAriaLabel(options)) {
      warnMissingAriaLabel(stringifyValue(optionValue));
    }
  }, [options]);

  useEffect(() => {
    for (const option of options) {
      if (option.accentColor && sanitizeAccentColor(option.accentColor) === undefined) {
        warnInvalidAccentColor(option.accentColor);
      }
    }
  }, [options]);

  const isValueSelectable = useMemo(
    () =>
      (candidate: T | undefined): candidate is T =>
        isSelectableValue(options, candidate),
    [options]
  );

  useEffect(() => {
    if (value !== undefined && !isValueSelectable(value)) {
      warnInvalidControlledValue(stringifyValue(value));
    }
  }, [isValueSelectable, value]);

  useEffect(() => {
    if (defaultValue !== undefined && !isValueSelectable(defaultValue)) {
      warnInvalidDefaultValue(stringifyValue(defaultValue));
    }
  }, [defaultValue, isValueSelectable]);

  // Static configuration shared by layout, interaction and accessibility
  const generatedId = useId();
  const instanceId = useMemo(() => toInstanceId(generatedId), [generatedId]);
  const resolvedName = name ?? instanceId;
  const descriptionBaseId = `${instanceId}-description`;
  const resolvedGeometry = useMemo(() => resolveGeometryConfig(geometry), [geometry]);
  const normalizedSlotProps = useMemo(() => normalizeSlotProps(slotProps), [slotProps]);
  const selectionMode = resolvedGeometry.mode;
  const trackConfig = {
    layout: resolvedGeometry.trackLayout,
    style: resolvedGeometry.trackStyle,
  };
  const anchorConfig = {
    width: resolvedGeometry.anchorWidth,
    height: resolvedGeometry.anchorHeight,
  };
  const indicatorConfig = {
    borderWidth: resolvedGeometry.indicatorBorderWidth,
    contentMode: resolvedGeometry.indicatorContentMode,
    height: resolvedGeometry.indicatorHeight,
    inset: resolvedGeometry.indicatorInset,
    style: resolvedGeometry.indicatorStyle,
    transition: resolvedGeometry.indicatorTransition,
    width: resolvedGeometry.indicatorWidth,
  };
  const optionLayoutSizing: SegmentedChoiceOptionSizing | 'fixed' =
    resolvedGeometry.optionSize !== undefined ? 'fixed' : optionSizing;
  const optionLayoutConfig = {
    distribution: optionDistribution,
    size: resolvedGeometry.optionSize,
    sizing: optionLayoutSizing,
  };
  const dragScale = resolvedGeometry.dragScale ?? false;

  // Current selection state, including uncontrolled fallback behavior.
  const { currentValue, commitValue, isControlled, resetValue } = useControllableValue({
    value,
    defaultValue,
    fallbackValue: structuralValidation.valid ? structuralValidation.firstEnabledValue : undefined,
    isValueSelectable,
    onValueChange,
  });

  const selectedIndex = useMemo(
    () => options.findIndex(option => option.value === currentValue),
    [currentValue, options]
  );
  const enabledFallbackIndex = useMemo(() => getFirstEnabledIndex(options), [options]);
  const committedIndex =
    selectedIndex >= 0 ? selectedIndex : isControlled ? -1 : enabledFallbackIndex;

  // DOM refs and interaction state power the keyboard/drag behavior.
  const listRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const optionRefs = useRef<Array<HTMLLabelElement | null>>([]);
  const optionContentRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const anchorRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Layout flags keep the later hooks/render logic readable without changing behavior.
  const indicatorBorderWidthPx = indicatorConfig.borderWidth ?? 0;
  const indicatorInsetPx = resolveIndicatorInsetPx({
    indicatorInset: indicatorConfig.inset,
    selectionMode,
    trackStyle: trackConfig.style,
    unstyled,
  });
  const indicatorSizeAdjustment =
    indicatorInsetPx * 2 + (indicatorConfig.style === 'ring' ? indicatorBorderWidthPx * 2 : 0);
  const hasExplicitIndicatorWidth = indicatorConfig.width !== undefined;
  const hasExplicitIndicatorHeight = indicatorConfig.height !== undefined;
  const hasExplicitIndicatorSize = hasExplicitIndicatorWidth || hasExplicitIndicatorHeight;
  const indicatorCentersOnOption = selectionMode === 'overlay' || hasExplicitIndicatorSize;
  const shouldRenderAnchor = resolveShouldRenderAnchor({
    anchorHeight: anchorConfig.height,
    anchorWidth: anchorConfig.width,
    hasExplicitAnchorSlot: slotProps?.optionAnchor !== undefined,
    indicatorStyle: indicatorConfig.style,
    selectionMode,
    trackLayout: trackConfig.layout,
  });
  const expectedFixedIndicatorSize =
    optionLayoutConfig.size !== undefined && !hasExplicitIndicatorSize
      ? Math.max(
          optionLayoutConfig.size +
            (indicatorCentersOnOption ? indicatorSizeAdjustment : -indicatorInsetPx * 2),
          0
        )
      : undefined;

  const {
    commitIndex,
    createInputBlurHandler,
    createInputFocusHandler,
    createInputKeyDownHandler,
    focusVisibleIndex,
    handleListPointerDown,
    inputRefs,
    rootRef,
  } = useSegmentedChoiceInteractions({
    commitValue,
    committedIndex,
    isControlled,
    loop,
    optionRefs,
    options,
    orientation,
    resetValue,
  });

  const {
    dragLayout,
    dragReleased,
    dragPreviewing,
    dragging,
    previewIndex,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useDragSelection({
    centerToOption: indicatorCentersOnOption,
    disabled,
    draggable,
    indicatorRef,
    inset: indicatorCentersOnOption ? 0 : indicatorInsetPx,
    listRef,
    measureRefs: anchorRefs,
    onCommitIndex: commitIndex,
    optionRefs,
    options,
    orientation,
    selectionMode,
    selectedIndex,
    sizeAdjustment: indicatorSizeAdjustment,
    useRenderedIndicatorSize: hasExplicitIndicatorSize,
  });

  const activeIndex =
    selectionMode === 'underlay' ? (previewIndex ?? committedIndex) : committedIndex;
  const indicatorLayout = useIndicatorLayout({
    activeIndex,
    centerToOption: indicatorCentersOnOption,
    indicatorRef,
    inset: indicatorCentersOnOption ? 0 : indicatorInsetPx,
    listRef,
    measureRefs: anchorRefs,
    optionCount: options.length,
    optionRefs,
    overrideLayout: dragLayout,
    sizeAdjustment: indicatorSizeAdjustment,
    useRenderedIndicatorSize: hasExplicitIndicatorSize,
  });
  const [indicatorMotionState, setIndicatorMotionState] = useState<'initial' | 'ready'>('initial');
  const trackLayout = useTrackLayout({
    listRef,
    measureRefs: anchorRefs,
    optionCount: options.length,
    optionRefs,
    options,
    orientation,
    trackLayout: trackConfig.layout,
  });
  const equalDistributionLayout = useEqualDistributionLayout({
    optionSizing: optionLayoutConfig.sizing,
    optionContentRefs,
    optionCount: options.length,
  });
  const activeOption = activeIndex >= 0 ? options[activeIndex] : undefined;
  const indicatorOption =
    selectionMode === 'overlay' && dragging
      ? options[previewIndex ?? committedIndex]
      : activeOption;
  const dragScaleValue = resolveDragScale(dragScale);
  const indicatorScale = dragging ? dragScaleValue : 1;
  const shouldCloneIndicatorContent =
    selectionMode === 'overlay' &&
    indicatorConfig.contentMode === 'clone-active' &&
    indicatorOption !== undefined;
  const interactiveCursor = disabled
    ? undefined
    : dragging && draggable
      ? 'grabbing'
      : draggable
        ? 'grab'
        : 'pointer';
  const indicatorCursor = interactiveCursor;
  const listCursor = interactiveCursor;
  const listTouchAction = !disabled && draggable ? 'none' : undefined;

  useLayoutEffect(() => {
    optionRefs.current.length = options.length;
    optionContentRefs.current.length = options.length;
    anchorRefs.current.length = options.length;
    inputRefs.current.length = options.length;
  }, [inputRefs, options.length]);

  useEffect(() => {
    const hasMeasuredIndicatorLayout =
      indicatorLayout.isVisible && indicatorLayout.width > 0 && indicatorLayout.height > 0;
    const hasSettledFixedIndicatorSize =
      expectedFixedIndicatorSize === undefined ||
      (isNearLayoutSize(indicatorLayout.width, expectedFixedIndicatorSize) &&
        isNearLayoutSize(indicatorLayout.height, expectedFixedIndicatorSize));

    if (
      indicatorMotionState !== 'initial' ||
      !hasMeasuredIndicatorLayout ||
      !hasSettledFixedIndicatorSize ||
      typeof window === 'undefined'
    ) {
      return;
    }

    let frame = 0;
    const releaseAfterPaint = (remainingFrames: number) => {
      frame = window.requestAnimationFrame(() => {
        if (remainingFrames <= 1) {
          setIndicatorMotionState('ready');
          return;
        }

        releaseAfterPaint(remainingFrames - 1);
      });
    };

    releaseAfterPaint(2);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [
    expectedFixedIndicatorSize,
    indicatorLayout.height,
    indicatorLayout.isVisible,
    indicatorLayout.width,
    indicatorLayout.x,
    indicatorLayout.y,
    indicatorMotionState,
  ]);

  const optionRowRefs = {
    anchorRefs,
    inputRefs,
    optionContentRefs,
    optionRefs,
  };
  const optionRowHandlers = {
    createInputBlurHandler,
    createInputFocusHandler,
    createInputKeyDownHandler,
    onCommitIndex: commitIndex,
  };
  const optionRowState = {
    currentValue,
    disabled,
    dragging,
    focusVisibleIndex,
    previewIndex,
    required,
    resolvedName,
    shouldRenderAnchor,
  };

  const instanceStyleText = buildSegmentedChoiceRuntimeRule({
    anchorHeight: anchorConfig.height,
    anchorWidth: anchorConfig.width,
    equalDistributionLayout,
    indicatorBorderWidth: indicatorConfig.borderWidth,
    indicatorColor: indicatorOption?.accentColor,
    indicatorCursor,
    indicatorHeight: hasExplicitIndicatorHeight ? indicatorConfig.height : undefined,
    indicatorLayout,
    indicatorScale,
    indicatorWidth: hasExplicitIndicatorWidth ? indicatorConfig.width : undefined,
    instanceId,
    listCursor,
    listTouchAction,
    optionSize: optionLayoutConfig.size,
    resolvedOptionSizing: optionLayoutConfig.sizing,
    resolvedTrackLayout: trackConfig.layout,
    trackLayout,
  });

  useRuntimeStyleRule({
    instanceId,
    ownerDocument: typeof document === 'undefined' ? null : document,
    ruleText: instanceStyleText,
    styleNonce,
  });

  if (!structuralValidation.valid) {
    return null;
  }

  return (
    <div
      {...normalizedSlotProps.root.props}
      ref={node => {
        rootRef.current = node;
        setForwardedRef(forwardedRef, node);
      }}
      role="radiogroup"
      aria-describedby={ariaDescribedby}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-orientation={orientation}
      className={joinClassNames('rsc-root', className, normalizedSlotProps.root.className)}
      data-disabled={disabled ? 'true' : 'false'}
      data-drag-released={dragReleased ? 'true' : 'false'}
      data-dragging={dragging ? 'true' : 'false'}
      data-orientation={orientation}
      data-rsc-anchor-sizing={
        anchorConfig.width !== undefined || anchorConfig.height !== undefined ? 'explicit' : 'fill'
      }
      data-rsc-drag-previewing={dragPreviewing ? 'true' : 'false'}
      data-rsc-indicator-content-mode={indicatorConfig.contentMode}
      data-rsc-indicator-motion={indicatorMotionState === 'initial' ? 'initial' : undefined}
      data-rsc-indicator-style={indicatorConfig.style}
      data-rsc-indicator-transition={indicatorConfig.transition}
      data-rsc-instance={instanceId}
      data-rsc-option-distribution={optionLayoutConfig.distribution}
      data-rsc-option-sizing={optionLayoutConfig.sizing}
      data-rsc-selection-mode={selectionMode}
      data-rsc-track-layout={trackConfig.layout}
      data-rsc-track-style={trackConfig.style}
      data-size={size}
      data-unstyled={unstyled ? 'true' : 'false'}
    >
      <div
        {...normalizedSlotProps.list.props}
        ref={listRef}
        className={joinClassNames('rsc-list', normalizedSlotProps.list.className)}
        onPointerCancel={callAll(
          handlePointerCancel,
          normalizedSlotProps.list.props.onPointerCancel
        )}
        onPointerDown={callAll(
          handleListPointerDown,
          handlePointerDown,
          normalizedSlotProps.list.props.onPointerDown
        )}
        onPointerMove={callAll(handlePointerMove, normalizedSlotProps.list.props.onPointerMove)}
        onPointerUp={callAll(handlePointerUp, normalizedSlotProps.list.props.onPointerUp)}
      >
        <span
          {...normalizedSlotProps.track.props}
          aria-hidden="true"
          className={joinClassNames('rsc-track', normalizedSlotProps.track.className)}
        />
        <span
          {...normalizedSlotProps.indicator.props}
          aria-hidden="true"
          className={joinClassNames('rsc-indicator', normalizedSlotProps.indicator.className)}
          data-rsc-focused={
            selectionMode === 'overlay' &&
            focusVisibleIndex !== null &&
            focusVisibleIndex === committedIndex
              ? 'true'
              : 'false'
          }
          ref={indicatorRef}
        >
          {shouldCloneIndicatorContent ? (
            <span
              {...normalizedSlotProps.indicatorContent.props}
              className={joinClassNames(
                'rsc-indicator-content',
                normalizedSlotProps.indicatorContent.className
              )}
            >
              <SegmentedChoiceOptionText
                description={indicatorOption.description}
                label={indicatorOption.label}
                slots={normalizedSlotProps}
              />
            </span>
          ) : null}
        </span>

        {options.map((option, index) => (
          <SegmentedChoiceOptionRow
            key={option.value}
            descriptionBaseId={descriptionBaseId}
            handlers={optionRowHandlers}
            index={index}
            option={option}
            refs={optionRowRefs}
            slots={normalizedSlotProps}
            state={optionRowState}
          />
        ))}
      </div>
    </div>
  );
}

export const SegmentedChoice = forwardRef(InnerSegmentedChoice) as <
  T extends SegmentedChoiceValue = string,
>(
  props: SegmentedChoiceProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

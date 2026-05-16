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
import type { SegmentedChoiceProps, SegmentedChoiceValue } from './SegmentedChoice.types';
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
  resolvedTrackStyle,
  selectionMode,
  unstyled,
}: {
  indicatorInset: number | undefined;
  resolvedTrackStyle: string;
  selectionMode: string;
  unstyled: boolean;
}) {
  if (indicatorInset !== undefined) {
    return indicatorInset;
  }

  if (!unstyled && selectionMode === 'underlay' && resolvedTrackStyle === 'surface') {
    return 1;
  }

  return 0;
}

function resolveShouldRenderAnchor({
  anchorHeight,
  anchorWidth,
  hasExplicitAnchorSlot,
  resolvedIndicatorStyle,
  resolvedTrackLayout,
  selectionMode,
}: {
  anchorHeight: number | undefined;
  anchorWidth: number | undefined;
  hasExplicitAnchorSlot: boolean;
  resolvedIndicatorStyle: string;
  resolvedTrackLayout: string;
  selectionMode: string;
}) {
  return (
    hasExplicitAnchorSlot ||
    anchorWidth !== undefined ||
    anchorHeight !== undefined ||
    selectionMode === 'overlay' ||
    resolvedTrackLayout === 'center-span' ||
    resolvedIndicatorStyle === 'ring'
  );
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
  const resolvedTrackLayout = resolvedGeometry.trackLayout;
  const resolvedTrackStyle = resolvedGeometry.trackStyle;
  const resolvedIndicatorStyle = resolvedGeometry.indicatorStyle;
  const resolvedIndicatorContentMode = resolvedGeometry.indicatorContentMode;
  const resolvedIndicatorTransition = resolvedGeometry.indicatorTransition;
  const anchorWidth = resolvedGeometry.anchorWidth;
  const anchorHeight = resolvedGeometry.anchorHeight;
  const dragScale = resolvedGeometry.dragScale ?? false;
  const indicatorBorderWidth = resolvedGeometry.indicatorBorderWidth;
  const indicatorInset = resolvedGeometry.indicatorInset;
  const optionSize = resolvedGeometry.optionSize;
  const resolvedOptionSizing = optionSize !== undefined ? 'fixed' : optionSizing;
  const resolvedOptionDistribution = optionDistribution;
  const indicatorWidth = resolvedGeometry.indicatorWidth;
  const indicatorHeight = resolvedGeometry.indicatorHeight;

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
  const indicatorBorderWidthPx = indicatorBorderWidth ?? 0;
  const indicatorInsetPx = resolveIndicatorInsetPx({
    indicatorInset,
    resolvedTrackStyle,
    selectionMode,
    unstyled,
  });
  const indicatorSizeAdjustment =
    indicatorInsetPx * 2 + (resolvedIndicatorStyle === 'ring' ? indicatorBorderWidthPx * 2 : 0);
  const hasSelectionWidth = indicatorWidth !== undefined;
  const hasSelectionHeight = indicatorHeight !== undefined;
  const hasSelectionSize = hasSelectionWidth || hasSelectionHeight;
  const centerToOption = selectionMode === 'overlay' || hasSelectionSize;
  const useRenderedIndicatorSize = hasSelectionSize;
  const shouldRenderAnchor = resolveShouldRenderAnchor({
    anchorHeight,
    anchorWidth,
    hasExplicitAnchorSlot: slotProps?.optionAnchor !== undefined,
    resolvedIndicatorStyle,
    resolvedTrackLayout,
    selectionMode,
  });

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
    centerToOption,
    disabled,
    draggable,
    indicatorRef,
    inset: centerToOption ? 0 : indicatorInsetPx,
    listRef,
    measureRefs: anchorRefs,
    onCommitIndex: commitIndex,
    optionRefs,
    options,
    orientation,
    selectionMode,
    selectedIndex,
    sizeAdjustment: indicatorSizeAdjustment,
    useRenderedIndicatorSize,
  });

  const activeIndex =
    selectionMode === 'underlay' ? (previewIndex ?? committedIndex) : committedIndex;
  const indicatorLayout = useIndicatorLayout({
    activeIndex,
    centerToOption,
    indicatorRef,
    inset: centerToOption ? 0 : indicatorInsetPx,
    listRef,
    measureRefs: anchorRefs,
    optionCount: options.length,
    optionRefs,
    overrideLayout: dragLayout,
    sizeAdjustment: indicatorSizeAdjustment,
    useRenderedIndicatorSize,
  });
  const [indicatorMotionState, setIndicatorMotionState] = useState<'initial' | 'ready'>('initial');
  const trackLayout = useTrackLayout({
    listRef,
    measureRefs: anchorRefs,
    optionCount: options.length,
    optionRefs,
    options,
    orientation,
    trackLayout: resolvedTrackLayout,
  });
  const equalDistributionLayout = useEqualDistributionLayout({
    optionSizing: resolvedOptionSizing,
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
    resolvedIndicatorContentMode === 'clone-active' &&
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
    if (
      indicatorMotionState !== 'initial' ||
      !indicatorLayout.isVisible ||
      indicatorLayout.width <= 0 ||
      indicatorLayout.height <= 0 ||
      typeof window === 'undefined'
    ) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIndicatorMotionState('ready');
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [
    indicatorLayout.height,
    indicatorLayout.isVisible,
    indicatorLayout.width,
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
    anchorHeight,
    anchorWidth,
    equalDistributionLayout,
    indicatorBorderWidth,
    indicatorColor: indicatorOption?.accentColor,
    indicatorCursor,
    indicatorHeight: hasSelectionHeight ? indicatorHeight : undefined,
    indicatorLayout,
    indicatorScale,
    indicatorWidth: hasSelectionWidth ? indicatorWidth : undefined,
    instanceId,
    listCursor,
    listTouchAction,
    optionSize,
    resolvedOptionSizing,
    resolvedTrackLayout,
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
        anchorWidth !== undefined || anchorHeight !== undefined ? 'explicit' : 'fill'
      }
      data-rsc-drag-previewing={dragPreviewing ? 'true' : 'false'}
      data-rsc-indicator-content-mode={resolvedIndicatorContentMode}
      data-rsc-indicator-motion={indicatorMotionState === 'initial' ? 'initial' : undefined}
      data-rsc-indicator-style={resolvedIndicatorStyle}
      data-rsc-indicator-transition={resolvedIndicatorTransition}
      data-rsc-instance={instanceId}
      data-rsc-option-distribution={resolvedOptionDistribution}
      data-rsc-option-sizing={resolvedOptionSizing}
      data-rsc-selection-mode={selectionMode}
      data-rsc-track-layout={resolvedTrackLayout}
      data-rsc-track-style={resolvedTrackStyle}
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

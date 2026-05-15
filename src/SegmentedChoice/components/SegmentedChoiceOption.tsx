import React from 'react';

import { joinClassNames } from '../internal/classNames';
import type { NormalizedSlotProps } from '../internal/slotProps';
import type { SegmentedChoiceOption, SegmentedChoiceValue } from '../SegmentedChoice.types';
import { SegmentedChoiceOptionText } from './SegmentedChoiceOptionText';

type OptionRowRefs = {
  anchorRefs: React.MutableRefObject<Array<HTMLSpanElement | null>>;
  inputRefs: React.MutableRefObject<Array<HTMLInputElement | null>>;
  optionContentRefs: React.MutableRefObject<Array<HTMLSpanElement | null>>;
  optionRefs: React.MutableRefObject<Array<HTMLLabelElement | null>>;
};

type OptionRowHandlers = {
  createInputBlurHandler: (index: number) => (event: React.FocusEvent<HTMLInputElement>) => void;
  createInputFocusHandler: (index: number) => (event: React.FocusEvent<HTMLInputElement>) => void;
  createInputKeyDownHandler: (
    index: number
  ) => (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onCommitIndex: (index: number) => void;
};

type OptionRowState<T extends SegmentedChoiceValue> = {
  currentValue: T | undefined;
  disabled: boolean;
  dragging: boolean;
  focusVisibleIndex: number | null;
  previewIndex: number | null;
  required: boolean;
  resolvedName: string;
  shouldRenderAnchor: boolean;
};

type SegmentedChoiceOptionRowProps<T extends SegmentedChoiceValue> = {
  descriptionBaseId: string;
  handlers: OptionRowHandlers;
  index: number;
  option: SegmentedChoiceOption<T>;
  refs: OptionRowRefs;
  slots: NormalizedSlotProps;
  state: OptionRowState<T>;
};

export function SegmentedChoiceOptionRow<T extends SegmentedChoiceValue>({
  descriptionBaseId,
  handlers,
  index,
  option,
  refs,
  slots,
  state,
}: SegmentedChoiceOptionRowProps<T>) {
  const selected = option.value === state.currentValue;
  const optionDisabled = state.disabled || Boolean(option.disabled);
  const descriptionId = option.description ? `${descriptionBaseId}-${index}` : undefined;

  if (!state.shouldRenderAnchor) {
    refs.anchorRefs.current[index] = null;
  }

  return (
    <label
      {...slots.option.props}
      ref={node => {
        refs.optionRefs.current[index] = node;
      }}
      className={joinClassNames('rsc-option', slots.option.className)}
      onPointerEnter={slots.option.props.onPointerEnter}
      onPointerLeave={slots.option.props.onPointerLeave}
      data-disabled={optionDisabled ? 'true' : 'false'}
      data-focus-visible={state.focusVisibleIndex === index ? 'true' : 'false'}
      data-has-description={option.description ? 'true' : 'false'}
      data-previewed={state.dragging && state.previewIndex === index ? 'true' : 'false'}
      data-selected={selected ? 'true' : 'false'}
    >
      <input
        ref={node => {
          refs.inputRefs.current[index] = node;
        }}
        aria-describedby={descriptionId}
        aria-label={option.ariaLabel}
        checked={selected}
        className="rsc-option-input"
        disabled={optionDisabled}
        name={state.resolvedName}
        onBlur={handlers.createInputBlurHandler(index)}
        onChange={() => {
          handlers.onCommitIndex(index);
        }}
        onFocus={handlers.createInputFocusHandler(index)}
        onKeyDown={handlers.createInputKeyDownHandler(index)}
        required={state.required}
        type="radio"
        value={option.value}
      />

      <span
        {...slots.optionContent.props}
        className={joinClassNames('rsc-option-content', slots.optionContent.className)}
        ref={node => {
          refs.optionContentRefs.current[index] = node;
        }}
      >
        {state.shouldRenderAnchor ? (
          <span
            {...slots.optionAnchor.props}
            aria-hidden="true"
            className={joinClassNames('rsc-option-anchor', slots.optionAnchor.className)}
            ref={node => {
              refs.anchorRefs.current[index] = node;
            }}
          />
        ) : null}
        <SegmentedChoiceOptionText
          description={option.description}
          descriptionId={descriptionId}
          label={option.label}
          slots={slots}
        />
      </span>
    </label>
  );
}

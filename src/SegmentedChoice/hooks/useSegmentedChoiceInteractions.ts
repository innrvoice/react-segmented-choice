import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getFirstEnabledIndex,
  getLastEnabledIndex,
  getNextEnabledIndex,
  getPreviousEnabledIndex,
} from '../internal/keyboard';
import type { SegmentedChoiceOption, SegmentedChoiceValue } from '../SegmentedChoice.types';
import { useInputModality } from './useInputModality';

export function useSegmentedChoiceInteractions<T extends SegmentedChoiceValue>({
  commitValue,
  committedIndex,
  isControlled,
  loop,
  optionRefs,
  options,
  orientation,
  resetValue,
}: {
  commitValue: (value: T) => void;
  committedIndex: number;
  isControlled: boolean;
  loop: boolean;
  optionRefs: React.RefObject<Array<HTMLLabelElement | null>>;
  options: readonly SegmentedChoiceOption<T>[];
  orientation: 'horizontal' | 'vertical';
  resetValue: () => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const {
    keyboardModalityRef,
    markKeyboardInteraction,
    markPointerInteraction,
    suppressFocusVisibleRef,
  } = useInputModality();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [focusVisibleIndex, setFocusVisibleIndex] = useState<number | null>(null);

  const focusInputAtIndex = useCallback((index: number) => {
    if (index < 0) {
      return;
    }

    const input = inputRefs.current[index];
    if (!input || input.disabled) {
      return;
    }

    input.focus();
  }, []);

  const commitIndex = useCallback(
    (index: number, { focus = false }: { focus?: boolean } = {}) => {
      const nextValue = options[index]?.value;
      if (nextValue === undefined) {
        return;
      }

      setFocusedIndex(index);
      if (focus) {
        setFocusVisibleIndex(index);
      }

      commitValue(nextValue);

      if (focus) {
        inputRefs.current[index]?.focus();
      }
    },
    [commitValue, options]
  );

  const handleListPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      markPointerInteraction();
      setFocusVisibleIndex(null);

      const target = event.target as HTMLElement | null;
      const optionElement = target?.closest<HTMLLabelElement>('.rsc-option');
      const indicatorElement = target?.closest<HTMLElement>('.rsc-indicator');
      const targetIndex = optionElement
        ? optionRefs.current.findIndex(optionRef => optionRef === optionElement)
        : indicatorElement
          ? committedIndex
          : -1;

      if (!Number.isNaN(targetIndex)) {
        focusInputAtIndex(targetIndex);
      }
    },
    [committedIndex, focusInputAtIndex, markPointerInteraction, optionRefs]
  );

  const createInputBlurHandler = useCallback(
    (index: number) => (event: React.FocusEvent<HTMLInputElement>) => {
      const nextFocused = event.relatedTarget;
      if (nextFocused instanceof HTMLElement && rootRef.current?.contains(nextFocused)) {
        return;
      }

      setFocusedIndex(current => (current === index ? null : current));
      setFocusVisibleIndex(current => (current === index ? null : current));
    },
    []
  );

  const createInputFocusHandler = useCallback(
    (index: number) => (event: React.FocusEvent<HTMLInputElement>) => {
      const focusVisible =
        (!suppressFocusVisibleRef.current && keyboardModalityRef.current) ||
        (typeof event.currentTarget.matches === 'function' &&
          !suppressFocusVisibleRef.current &&
          event.currentTarget.matches(':focus-visible'));
      suppressFocusVisibleRef.current = false;
      setFocusedIndex(current => (current === index ? current : index));
      setFocusVisibleIndex(current =>
        focusVisible ? (current === index ? current : index) : current === index ? null : current
      );
    },
    [keyboardModalityRef, suppressFocusVisibleRef]
  );

  const createInputKeyDownHandler = useCallback(
    (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      markKeyboardInteraction();
      let nextIndex = -1;

      if (event.key === 'Home') {
        nextIndex = getFirstEnabledIndex(options);
      } else if (event.key === 'End') {
        nextIndex = getLastEnabledIndex(options);
      } else if (orientation === 'horizontal' && event.key === 'ArrowRight') {
        nextIndex = getNextEnabledIndex({ options, startIndex: index, loop });
      } else if (orientation === 'horizontal' && event.key === 'ArrowLeft') {
        nextIndex = getPreviousEnabledIndex({ options, startIndex: index, loop });
      } else if (orientation === 'vertical' && event.key === 'ArrowDown') {
        nextIndex = getNextEnabledIndex({ options, startIndex: index, loop });
      } else if (orientation === 'vertical' && event.key === 'ArrowUp') {
        nextIndex = getPreviousEnabledIndex({ options, startIndex: index, loop });
      } else {
        return;
      }

      if (nextIndex < 0) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      commitIndex(nextIndex, { focus: true });
    },
    [commitIndex, loop, markKeyboardInteraction, options, orientation]
  );

  useEffect(() => {
    if (isControlled) {
      return;
    }

    const form = inputRefs.current.find(Boolean)?.form;
    if (!form) {
      return;
    }

    const handleReset = () => {
      queueMicrotask(() => {
        resetValue();
        setFocusedIndex(null);
        setFocusVisibleIndex(null);
      });
    };

    form.addEventListener('reset', handleReset);
    return () => {
      form.removeEventListener('reset', handleReset);
    };
  }, [isControlled, resetValue]);

  return {
    commitIndex,
    createInputBlurHandler,
    createInputFocusHandler,
    createInputKeyDownHandler,
    focusVisibleIndex,
    focusedIndex,
    handleListPointerDown,
    inputRefs,
    rootRef,
  };
}

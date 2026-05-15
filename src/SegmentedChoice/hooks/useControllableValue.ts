import { useCallback, useEffect, useRef, useState } from 'react';

import type { SegmentedChoiceValue } from '../SegmentedChoice.types';
import { warnControlledModeSwitch } from '../SegmentedChoice.warnings';

export function useControllableValue<T extends SegmentedChoiceValue>({
  value,
  defaultValue,
  fallbackValue,
  isValueSelectable,
  onValueChange,
}: {
  value: T | undefined;
  defaultValue: T | undefined;
  fallbackValue: T | undefined;
  isValueSelectable: (candidate: T | undefined) => candidate is T;
  onValueChange?: (nextValue: T) => void;
}) {
  const isControlled = value !== undefined;
  const wasControlledRef = useRef(isControlled);
  const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(() => {
    if (isValueSelectable(defaultValue)) {
      return defaultValue;
    }

    return fallbackValue;
  });

  useEffect(() => {
    if (wasControlledRef.current !== isControlled) {
      warnControlledModeSwitch(isControlled ? 'controlled' : 'uncontrolled');
      wasControlledRef.current = isControlled;
    }
  }, [isControlled]);

  useEffect(() => {
    if (isControlled) {
      return;
    }

    if (isValueSelectable(uncontrolledValue)) {
      return;
    }

    if (fallbackValue !== undefined) {
      setUncontrolledValue(fallbackValue);
    }
  }, [fallbackValue, isControlled, isValueSelectable, uncontrolledValue]);

  const currentValue = isControlled ? value : uncontrolledValue;

  const resetValue = useCallback(() => {
    if (isControlled) {
      return;
    }

    setUncontrolledValue(isValueSelectable(defaultValue) ? defaultValue : fallbackValue);
  }, [defaultValue, fallbackValue, isControlled, isValueSelectable]);

  const commitValue = useCallback(
    (nextValue: T) => {
      if (!isValueSelectable(nextValue) || currentValue === nextValue) {
        return;
      }

      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [currentValue, isControlled, isValueSelectable, onValueChange]
  );

  return {
    currentValue: isValueSelectable(currentValue) ? currentValue : undefined,
    commitValue,
    isControlled,
    resetValue,
  };
}

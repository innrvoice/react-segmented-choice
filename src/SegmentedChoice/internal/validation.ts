import React from 'react';

import type { SegmentedChoiceOption, SegmentedChoiceValue } from '../SegmentedChoice.types';

export type StructuralValidationResult<T extends SegmentedChoiceValue> =
  | {
      valid: true;
      firstEnabledValue: T | undefined;
    }
  | {
      valid: false;
      duplicateValues: string[];
      invalidValueIndexes: number[];
      optionCount: number;
    };

export function stringifyValue(value: unknown) {
  return String(value);
}

export function hasReadableTextLabel(node: React.ReactNode): boolean {
  if (typeof node === 'string') {
    return node.trim().length > 0;
  }

  if (typeof node === 'number') {
    return true;
  }

  if (Array.isArray(node)) {
    return node.some(hasReadableTextLabel);
  }

  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return hasReadableTextLabel(props.children);
  }

  return false;
}

export function getFirstEnabledValue<T extends SegmentedChoiceValue>(
  options: readonly SegmentedChoiceOption<T>[]
): T | undefined {
  return options.find(option => !option.disabled)?.value;
}

export function findOptionByValue<T extends SegmentedChoiceValue>(
  options: readonly SegmentedChoiceOption<T>[],
  value: T
): SegmentedChoiceOption<T> | undefined {
  return options.find(option => option.value === value);
}

export function isSelectableValue<T extends SegmentedChoiceValue>(
  options: readonly SegmentedChoiceOption<T>[],
  value: T | undefined
): value is T {
  if (value === undefined) {
    return false;
  }

  const option = findOptionByValue(options, value);
  return Boolean(option && !option.disabled);
}

export function getNonTextOptionsMissingAriaLabel<T extends SegmentedChoiceValue>(
  options: readonly SegmentedChoiceOption<T>[]
): T[] {
  return options
    .filter(option => !hasReadableTextLabel(option.label) && !option.ariaLabel)
    .map(option => option.value);
}

export function validateOptionsStructure<T extends SegmentedChoiceValue>(
  options: readonly SegmentedChoiceOption<T>[]
): StructuralValidationResult<T> {
  const duplicateValues = new Set<string>();
  const seenValues = new Set<string>();
  const invalidValueIndexes: number[] = [];

  for (const [index, option] of options.entries()) {
    if (typeof option.value !== 'string') {
      invalidValueIndexes.push(index);
      continue;
    }

    const key = option.value;
    if (seenValues.has(key)) {
      duplicateValues.add(key);
    }
    seenValues.add(key);
  }

  if (options.length < 2 || duplicateValues.size > 0 || invalidValueIndexes.length > 0) {
    return {
      valid: false,
      duplicateValues: Array.from(duplicateValues),
      invalidValueIndexes,
      optionCount: options.length,
    };
  }

  return {
    valid: true,
    firstEnabledValue: getFirstEnabledValue(options),
  };
}

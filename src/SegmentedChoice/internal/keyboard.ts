import type { SegmentedChoiceOption, SegmentedChoiceValue } from '../SegmentedChoice.types';

function isEnabled<T extends SegmentedChoiceValue>(
  options: readonly SegmentedChoiceOption<T>[],
  index: number
) {
  return !options[index]?.disabled;
}

export function getFirstEnabledIndex<T extends SegmentedChoiceValue>(
  options: readonly SegmentedChoiceOption<T>[]
) {
  return options.findIndex(option => !option.disabled);
}

export function getLastEnabledIndex<T extends SegmentedChoiceValue>(
  options: readonly SegmentedChoiceOption<T>[]
) {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

export function getNextEnabledIndex<T extends SegmentedChoiceValue>({
  options,
  startIndex,
  loop,
}: {
  options: readonly SegmentedChoiceOption<T>[];
  startIndex: number;
  loop: boolean;
}) {
  for (let index = startIndex + 1; index < options.length; index += 1) {
    if (isEnabled(options, index)) {
      return index;
    }
  }

  if (!loop) {
    return -1;
  }

  for (let index = 0; index < startIndex; index += 1) {
    if (isEnabled(options, index)) {
      return index;
    }
  }

  return -1;
}

export function getPreviousEnabledIndex<T extends SegmentedChoiceValue>({
  options,
  startIndex,
  loop,
}: {
  options: readonly SegmentedChoiceOption<T>[];
  startIndex: number;
  loop: boolean;
}) {
  for (let index = startIndex - 1; index >= 0; index -= 1) {
    if (isEnabled(options, index)) {
      return index;
    }
  }

  if (!loop) {
    return -1;
  }

  for (let index = options.length - 1; index > startIndex; index -= 1) {
    if (isEnabled(options, index)) {
      return index;
    }
  }

  return -1;
}

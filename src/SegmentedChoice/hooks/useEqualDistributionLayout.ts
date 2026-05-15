import { useCallback, useState } from 'react';

import { useObservedMeasurement } from './useObservedMeasurement';

export type EqualDistributionLayout = {
  blockSize: number;
  inlineSize: number;
  visible: boolean;
};

function getInitialLayout(): EqualDistributionLayout {
  return {
    blockSize: 0,
    inlineSize: 0,
    visible: false,
  };
}

function getMeasuredContentSize(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    blockSize: Math.max(element.scrollHeight, rect.height),
    inlineSize: Math.max(element.scrollWidth, rect.width),
  };
}

function measureEqualDistributionLayout({
  optionContentRefs,
  optionCount,
  optionSizing,
}: {
  optionSizing: 'equal' | 'content' | 'fixed';
  optionContentRefs: React.RefObject<Array<HTMLSpanElement | null>>;
  optionCount: number;
}) {
  if (optionSizing !== 'equal') {
    return null;
  }

  const sizes = optionContentRefs.current.slice(0, optionCount).flatMap(element => {
    if (!element) {
      return [];
    }

    const measured = getMeasuredContentSize(element);
    if (measured.inlineSize <= 0 && measured.blockSize <= 0) {
      return [];
    }

    return [measured];
  });

  if (sizes.length === 0) {
    return null;
  }

  return {
    blockSize: Math.max(...sizes.map(size => size.blockSize)),
    inlineSize: Math.max(...sizes.map(size => size.inlineSize)),
  } satisfies Omit<EqualDistributionLayout, 'visible'>;
}

export function useEqualDistributionLayout({
  optionSizing,
  optionContentRefs,
  optionCount,
}: {
  optionSizing: 'equal' | 'content' | 'fixed';
  optionContentRefs: React.RefObject<Array<HTMLSpanElement | null>>;
  optionCount: number;
}) {
  const [layout, setLayout] = useState<EqualDistributionLayout>(getInitialLayout);

  const measure = useCallback(() => {
    const measuredLayout = measureEqualDistributionLayout({
      optionSizing,
      optionContentRefs,
      optionCount,
    });

    if (!measuredLayout) {
      setLayout(current => (current.visible ? getInitialLayout() : current));
      return;
    }

    setLayout({
      ...measuredLayout,
      visible: true,
    });
  }, [optionSizing, optionContentRefs, optionCount]);

  const observeElements = useCallback(
    () => optionContentRefs.current.slice(0, optionCount),
    [optionContentRefs, optionCount]
  );

  useObservedMeasurement({
    measure,
    observeElements,
  });

  return layout;
}

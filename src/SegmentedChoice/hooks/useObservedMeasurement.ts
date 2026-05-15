import { useLayoutEffect } from 'react';

export function useObservedMeasurement({
  measure,
  observeElements,
}: {
  measure: () => void;
  observeElements: () => Array<Element | null>;
}) {
  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let frame = 0;
    const scheduleMeasure = () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    scheduleMeasure();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        scheduleMeasure();
      });

      for (const element of observeElements()) {
        if (element) {
          observer.observe(element);
        }
      }

      return () => {
        observer.disconnect();
        if (frame !== 0) {
          window.cancelAnimationFrame(frame);
        }
      };
    }

    window.addEventListener('resize', scheduleMeasure);
    return () => {
      window.removeEventListener('resize', scheduleMeasure);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [measure, observeElements]);
}

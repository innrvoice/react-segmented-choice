import { useCallback, useEffect, useRef } from 'react';

export function useInputModality() {
  const keyboardModalityRef = useRef(false);
  const suppressFocusVisibleRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleKeyDown = () => {
      keyboardModalityRef.current = true;
      suppressFocusVisibleRef.current = false;
    };

    const handlePointerDown = () => {
      keyboardModalityRef.current = false;
      suppressFocusVisibleRef.current = true;
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, []);

  const markKeyboardInteraction = useCallback(() => {
    keyboardModalityRef.current = true;
    suppressFocusVisibleRef.current = false;
  }, []);

  const markPointerInteraction = useCallback(() => {
    keyboardModalityRef.current = false;
    suppressFocusVisibleRef.current = true;
  }, []);

  return {
    keyboardModalityRef,
    suppressFocusVisibleRef,
    markKeyboardInteraction,
    markPointerInteraction,
  };
}

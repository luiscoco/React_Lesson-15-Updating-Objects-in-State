
import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * A tiny time-travel history hook: keeps a list of states and a pointer.
 * - push(next): adds a new state (truncating redo branch)
 * - undo(): move back if possible
 * - redo(): move forward if possible
 * - canUndo/canRedo booleans
 */
export function useHistory(initial) {
  const [pointer, setPointer] = useState(0);
  const historyRef = useRef([initial]);

  const value = historyRef.current[pointer];

  const push = useCallback((next) => {
    const hist = historyRef.current.slice(0, pointer + 1);
    hist.push(next);
    historyRef.current = hist;
    setPointer(hist.length - 1);
  }, [pointer]);

  const canUndo = pointer > 0;
  const canRedo = pointer < historyRef.current.length - 1;

  const undo = useCallback(() => {
    if (canUndo) setPointer(p => Math.max(0, p - 1));
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) setPointer(p => Math.min(historyRef.current.length - 1, p + 1));
  }, [canRedo]);

  const length = historyRef.current.length;

  return { value, push, undo, redo, canUndo, canRedo, pointer, length };
}

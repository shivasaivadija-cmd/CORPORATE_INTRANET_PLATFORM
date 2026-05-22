import { useEffect } from 'react';

type KeyCombo = string;

export function useKeyboardShortcut(keys: KeyCombo | KeyCombo[], callback: () => void) {
  useEffect(() => {
    const keyList = Array.isArray(keys) ? keys : [keys];

    const handler = (e: KeyboardEvent) => {
      for (const combo of keyList) {
        const parts = combo.toLowerCase().split('+');
        const key = parts[parts.length - 1];
        const needsMeta = parts.includes('meta');
        const needsCtrl = parts.includes('ctrl');
        const needsShift = parts.includes('shift');
        const needsAlt = parts.includes('alt');

        if (
          e.key.toLowerCase() === key &&
          (!needsMeta || e.metaKey) &&
          (!needsCtrl || e.ctrlKey) &&
          (!needsShift || e.shiftKey) &&
          (!needsAlt || e.altKey)
        ) {
          e.preventDefault();
          callback();
          return;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keys, callback]);
}

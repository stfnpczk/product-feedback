import { useEffect, useRef } from "react";

const RESET_MS = 500;

export function useTypeahead(labels: readonly string[]) {
  const state = useRef({ query: "", timeout: 0 });

  useEffect(() => {
    const current = state.current;
    return () => window.clearTimeout(current.timeout);
  }, []);

  return function match(char: string, fromIndex: number) {
    const s = state.current;
    window.clearTimeout(s.timeout);
    s.query += char.toLowerCase();
    s.timeout = window.setTimeout(() => (s.query = ""), RESET_MS);

    const isRepeat = [...s.query].every((c) => c === s.query[0]);
    const search = isRepeat ? s.query[0] : s.query;
    const offset = isRepeat ? 1 : 0;

    for (let i = 0; i < labels.length; i++) {
      const index = (fromIndex + offset + i) % labels.length;
      if (labels[index].toLowerCase().startsWith(search)) return index;
    }
    return -1;
  };
}

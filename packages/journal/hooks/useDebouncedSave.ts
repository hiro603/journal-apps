import { useCallback, useEffect, useRef } from "react";

// 入力が止まってから保存する。画面を離れるときと、アプリが裏に回ったときは待たずに保存する
export function useDebouncedSave<T>(save: (value: T) => void, delayMs = 500) {
  const pending = useRef<{ value: T } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const saveRef = useRef(save);

  useEffect(() => {
    saveRef.current = save;
  });

  const flush = useCallback(() => {
    clearTimeout(timer.current);
    if (!pending.current) return;
    saveRef.current(pending.current.value);
    pending.current = null;
  }, []);

  useEffect(() => {
    // iPhone でホーム画面に戻ったりアプリを切り替えたりすると、そのまま閉じられることがある
    const flushWhenHidden = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", flushWhenHidden);
    return () => {
      document.removeEventListener("visibilitychange", flushWhenHidden);
      flush();
    };
  }, [flush]);

  const schedule = useCallback(
    (value: T) => {
      pending.current = { value };
      clearTimeout(timer.current);
      timer.current = setTimeout(flush, delayMs);
    },
    [flush, delayMs],
  );

  return { schedule, flush };
}

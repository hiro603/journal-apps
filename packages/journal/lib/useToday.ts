import { useSyncExternalStore } from "react";
import { todayKey } from "./date";

// 次の0時と、アプリが前に戻ったとき（裏に回っている間はタイマーが止まることがある）に今日を読み直す
function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const scheduleMidnight = () => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    timer = setTimeout(() => {
      onChange();
      scheduleMidnight();
    }, nextMidnight.getTime() - now.getTime() + 1000);
  };
  const onVisible = () => {
    if (document.visibilityState === "visible") onChange();
  };
  scheduleMidnight();
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisible);
  };
}

// サーバー（UTC・ビルド時刻）では null、ブラウザでは端末の今日を返す。日付ずれと hydration エラーを防ぐ
export function useToday(): string | null {
  return useSyncExternalStore(subscribe, todayKey, () => null);
}

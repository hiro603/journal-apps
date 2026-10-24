import { useSyncExternalStore } from "react";
import { todayKey } from "./date";

const subscribe = () => () => {};

// サーバー（UTC・ビルド時刻）では null、ブラウザでは端末の今日を返す。日付ずれと hydration エラーを防ぐ
export function useToday(): string | null {
  return useSyncExternalStore(subscribe, todayKey, () => null);
}

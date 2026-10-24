"use client";

import { DayNav } from "@journal-apps/journal/components/DayNav";

// その日の釣行一覧（中身はステップ4で作る）
export function FishingDayScreen({ date }: { date: string }) {
  return <DayNav date={date} />;
}

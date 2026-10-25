"use client";

import { useSearchParams } from "next/navigation";
import { MonthCalendar, type DayBadge } from "@journal-apps/journal/components/MonthCalendar";
import { useMonthEntries } from "@journal-apps/journal/hooks/useMonthEntries";
import type { Entry } from "@journal-apps/journal/types";
import { isMonthKey, toMonthKey } from "@journal-apps/journal/lib/date";
import { useToday } from "@journal-apps/journal/lib/useToday";
import type { FishingFields } from "../fields";
import { fishingRepository } from "../repository";
import { dayTotal } from "../trips";
import styles from "./FishingCalendarScreen.module.scss";

// その日の合計匹数を印にする。釣行はあったが0匹（ボウズ）の日は「0」を薄く出す
function getFishingBadge(trips: Entry<FishingFields>[]): DayBadge {
  const total = dayTotal(trips);
  return {
    mark: String(total),
    label: total === 0 ? "釣果なし" : `合計${total}匹`,
    className: total === 0 ? styles.none : styles.caught,
  };
}

// 表示する月は ?month=2026-10 で持つ。日付から戻ったときに同じ月が開く
export function FishingCalendarScreen() {
  const today = useToday();
  const param = useSearchParams().get("month") ?? "";
  const month = isMonthKey(param) ? param : today && toMonthKey(today);
  const days = useMonthEntries(fishingRepository, month ?? "");

  if (!today || !month || !days) return null;

  return (
    <MonthCalendar
      month={month}
      today={today}
      days={days}
      getBadge={getFishingBadge}
      monthHref={(m) => `/calendar?month=${m}`}
      dayHref={(date) => (date === today ? "/" : `/day/${date}`)}
    />
  );
}

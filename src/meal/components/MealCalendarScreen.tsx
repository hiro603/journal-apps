"use client";

import { useSearchParams } from "next/navigation";
import { MonthCalendar, type DayBadge } from "@/journal/components/MonthCalendar";
import { useMonthEntries } from "@/journal/hooks/useMonthEntries";
import type { Entry } from "@/journal/types";
import { isMonthKey, toMonthKey } from "@/lib/date";
import { useToday } from "@/lib/useToday";
import { describeOverate, type MealFields } from "../fields";
import { mealRepository } from "../repository";
import styles from "./MealCalendarScreen.module.scss";

function getMealBadge(entry: Entry<MealFields>): DayBadge | null {
  const { overate } = entry.fields;
  if (overate === null) return null;
  return { ...describeOverate(overate), className: overate ? styles.over : styles.ok };
}

// 表示する月は ?month=2026-10 で持つ。日付から戻ったときに同じ月が開く
export function MealCalendarScreen() {
  const today = useToday();
  const param = useSearchParams().get("month") ?? "";
  const month = isMonthKey(param) ? param : today && toMonthKey(today);
  const days = useMonthEntries(mealRepository, month ?? "");

  if (!today || !month || !days) return null;

  return (
    <MonthCalendar
      month={month}
      today={today}
      days={days}
      getBadge={getMealBadge}
      monthHref={(m) => `/calendar?month=${m}`}
      dayHref={(date) => (date === today ? "/" : `/day/${date}`)}
    />
  );
}

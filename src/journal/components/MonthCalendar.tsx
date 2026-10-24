"use client";

import Link from "next/link";
import { addMonths, formatDateLabel, formatMonthLabel, monthGrid } from "@/lib/date";
import type { DaySummary } from "../hooks/useMonthEntries";
import type { Entry } from "../types";
import { BlobImage } from "./BlobImage";
import styles from "./MonthCalendar.module.scss";

// 各日に重ねる印。何を出すかはアプリ側が決める（食事日記なら ○×）
export type DayBadge = { mark: string; label: string; className?: string };

type Props<TFields> = {
  month: string;
  today: string;
  days: Map<string, DaySummary<TFields>>;
  getBadge: (entry: Entry<TFields>) => DayBadge | null;
  monthHref: (month: string) => string;
  dayHref: (date: string) => string;
};

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

export function MonthCalendar<TFields>({ month, today, days, getBadge, monthHref, dayHref }: Props<TFields>) {
  const nextMonth = addMonths(month, 1);
  const canGoNext = nextMonth <= today.slice(0, 7);

  return (
    <section className={styles.calendar}>
      <header className={styles.nav}>
        <Link href={monthHref(addMonths(month, -1))} className={styles.arrow} aria-label="前の月">
          ‹
        </Link>
        <h1 className={styles.title}>{formatMonthLabel(month)}</h1>
        {canGoNext ? (
          <Link href={monthHref(nextMonth)} className={styles.arrow} aria-label="次の月">
            ›
          </Link>
        ) : (
          <span className={styles.arrow} aria-hidden="true" />
        )}
      </header>

      {/* 曜日は各日のラベルに含めるので、見出し行は読み上げない */}
      <div className={styles.weekdays} aria-hidden="true">
        {weekdays.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <ol className={styles.grid}>
        {monthGrid(month).map((date, i) => {
          if (!date) return <li key={`blank-${i}`} aria-hidden="true" />;

          const dayNumber = Number(date.slice(8));
          if (date > today) {
            return (
              <li key={date}>
                <span className={`${styles.day} ${styles.future}`}>
                  <span className={styles.number}>{dayNumber}</span>
                </span>
              </li>
            );
          }

          const summary = days.get(date);
          const badge = summary ? getBadge(summary.entry) : null;
          const label = [formatDateLabel(date), badge?.label, summary?.cover && "写真あり"].filter(Boolean).join(" ");

          return (
            <li key={date}>
              <Link
                href={dayHref(date)}
                className={`${styles.day} ${summary?.cover ? styles.hasCover : ""}`}
                aria-label={label}
                aria-current={date === today ? "date" : undefined}
              >
                {summary?.cover && <BlobImage blob={summary.cover.thumb} alt="" className={styles.cover} />}
                <span className={styles.number}>{dayNumber}</span>
                {badge && (
                  <span className={`${styles.badge} ${badge.className ?? ""}`} aria-hidden="true">
                    {badge.mark}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

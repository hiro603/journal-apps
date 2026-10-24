"use client";

import Link from "next/link";
import { addDays, formatDateLabel } from "@/lib/date";
import { useToday } from "@/lib/useToday";
import styles from "./DayNav.module.scss";

const hrefFor = (date: string, today: string | null) => (date === today ? "/" : `/day/${date}`);

export function DayNav({ date }: { date: string }) {
  const today = useToday();
  const prev = addDays(date, -1);
  const next = addDays(date, 1);
  // 未来の日には進めない
  const canGoNext = today !== null && next <= today;

  return (
    <header className={styles.nav}>
      <Link href={hrefFor(prev, today)} className={styles.arrow} aria-label="前の日">
        ‹
      </Link>
      <h1 className={styles.title}>
        {formatDateLabel(date)}
        {date === today && <span className={styles.today}>今日</span>}
      </h1>
      {canGoNext ? (
        <Link href={hrefFor(next, today)} className={styles.arrow} aria-label="次の日">
          ›
        </Link>
      ) : (
        <span className={styles.arrow} aria-hidden="true" />
      )}
    </header>
  );
}

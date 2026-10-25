"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BlobImage } from "@journal-apps/journal/components/BlobImage";
import { DayNav } from "@journal-apps/journal/components/DayNav";
import { useEntriesByDate } from "@journal-apps/journal/hooks/useEntriesByDate";
import { useToday } from "@journal-apps/journal/lib/useToday";
import { initialFishingFields } from "../fields";
import { fishingRepository } from "../repository";
import { describeCatches, sortTrips, toTimeText } from "../trips";
import styles from "./FishingDayScreen.module.scss";
import screen from "./Screen.module.scss";

// その日の釣行一覧。釣行を追加すると、その釣行の編集画面へ移る
export function FishingDayScreen({ date }: { date: string }) {
  const trips = useEntriesByDate(fishingRepository, date);
  const today = useToday();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  async function addTrip() {
    setIsCreating(true);
    // 今日の釣行なら、開始時刻に今の時刻を入れておく
    const startTime = date === today ? toTimeText(new Date()) : null;
    const trip = await fishingRepository.create({ date, fields: { ...initialFishingFields, startTime } });
    router.push(`/trip/${trip.id}`);
  }

  return (
    <div className={screen.screen}>
      <DayNav date={date} />

      {trips &&
        (trips.length === 0 ? (
          <p className={styles.empty}>まだ釣行がありません</p>
        ) : (
          <ul className={styles.list}>
            {sortTrips(trips).map(({ entry, cover }) => (
              <li key={entry.id}>
                <Link href={`/trip/${entry.id}`} className={styles.card}>
                  {cover ? (
                    <BlobImage blob={cover.thumb} alt="" className={styles.thumb} />
                  ) : (
                    <span className={styles.thumb} aria-hidden="true" />
                  )}
                  <span className={styles.text}>
                    <span className={styles.title}>
                      {entry.fields.startTime ?? "時刻なし"}　{entry.fields.spot || "釣り場未入力"}
                    </span>
                    <span className={styles.catches}>{describeCatches(entry.fields.catches)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ))}

      <div className={screen.actions}>
        <button type="button" className={screen.primaryButton} disabled={!trips || isCreating} onClick={addTrip}>
          ＋ 釣行を追加
        </button>
      </div>
    </div>
  );
}

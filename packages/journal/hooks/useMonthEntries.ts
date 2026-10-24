import { useLiveQuery } from "dexie-react-hooks";
import type { JournalRepository } from "../repository";
import type { Entry, Photo } from "../types";

// その日の記録（作成順）と、その日で最初の写真（表紙）
export type DaySummary<TFields> = { entries: Entry<TFields>[]; cover: Photo | null };

export function summarizeByDate<TFields>(entries: Entry<TFields>[], photos: Photo[]): Map<string, DaySummary<TFields>> {
  const firstPhotoOf = new Map<string, Photo>();
  for (const photo of [...photos].sort((a, b) => a.createdAt - b.createdAt)) {
    if (!firstPhotoOf.has(photo.entryId)) firstPhotoOf.set(photo.entryId, photo);
  }

  const days = new Map<string, DaySummary<TFields>>();
  for (const entry of [...entries].sort((a, b) => a.createdAt - b.createdAt)) {
    const day = days.get(entry.date) ?? { entries: [], cover: null };
    day.entries.push(entry);
    day.cover ??= firstPhotoOf.get(entry.id) ?? null;
    days.set(entry.date, day);
  }
  return days;
}

// 1か月分を日付ごとにまとめる。読み込み中は undefined
export function useMonthEntries<TFields>(repo: JournalRepository<TFields>, month: string) {
  return useLiveQuery(async () => {
    const entries = await repo.findByMonth(month);
    const photos = await repo.listPhotosByEntries(entries.map((e) => e.id));
    return summarizeByDate(entries, photos);
  }, [repo, month]);
}

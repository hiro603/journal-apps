import { useLiveQuery } from "dexie-react-hooks";
import type { JournalRepository } from "../repository";
import type { Entry, Photo } from "../types";

export type DaySummary<TFields> = { entry: Entry<TFields>; cover: Photo | null };

// 1か月分の記録と、各記録の1枚目の写真（表紙）を日付ごとにまとめる。読み込み中は undefined
export function useMonthEntries<TFields>(repo: JournalRepository<TFields>, month: string) {
  return useLiveQuery(async () => {
    const entries = await repo.findByMonth(month);
    const photos = await repo.listPhotosByEntries(entries.map((e) => e.id));

    const covers = new Map<string, Photo>();
    for (const photo of photos) {
      if (!covers.has(photo.entryId)) covers.set(photo.entryId, photo);
    }
    return new Map<string, DaySummary<TFields>>(
      entries.map((entry) => [entry.date, { entry, cover: covers.get(entry.id) ?? null }]),
    );
  }, [repo, month]);
}

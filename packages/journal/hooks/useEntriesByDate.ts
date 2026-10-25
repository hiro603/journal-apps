import { useLiveQuery } from "dexie-react-hooks";
import type { JournalRepository } from "../repository";
import type { Entry, Photo } from "../types";
import { firstPhotoByEntry } from "./useMonthEntries";

export type EntryWithCover<TFields> = { entry: Entry<TFields>; cover: Photo | null };

// その日の記録すべてと、各記録の最初の写真（1日に複数件ある記録用）。読み込み中は undefined
export function useEntriesByDate<TFields>(repo: JournalRepository<TFields>, date: string) {
  return useLiveQuery(async (): Promise<EntryWithCover<TFields>[]> => {
    const entries = await repo.findByDate(date);
    const covers = firstPhotoByEntry(await repo.listPhotosByEntries(entries.map((e) => e.id)));
    return entries.map((entry) => ({ entry, cover: covers.get(entry.id) ?? null }));
  }, [repo, date]);
}

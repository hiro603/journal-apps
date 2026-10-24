import { useLiveQuery } from "dexie-react-hooks";
import type { JournalRepository } from "../repository";

// その日の記録をすべて返す（1日に複数件ある記録用）。読み込み中は undefined
export function useEntriesByDate<TFields>(repo: JournalRepository<TFields>, date: string) {
  return useLiveQuery(() => repo.findByDate(date), [repo, date]);
}

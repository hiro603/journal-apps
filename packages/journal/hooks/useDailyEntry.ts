import { useLiveQuery } from "dexie-react-hooks";
import { useRef } from "react";
import type { JournalRepository } from "../repository";
import type { Entry, Photo } from "../types";
import { addPhotosTo } from "./addPhotosTo";

const noPhotos: Photo[] = [];

// 1日1件の記録として扱うフック。記録は最初の操作（写真・メモ・項目の入力）で作る
export function useDailyEntry<TFields>(repo: JournalRepository<TFields>, date: string, initialFields: TFields) {
  // useLiveQuery は IndexedDB の変更を検知して自動で再取得する（読み込み中は undefined）
  const entries = useLiveQuery(() => repo.findByDate(date), [repo, date]);
  const entry = entries?.[0] ?? null;
  const photos = useLiveQuery(() => (entry ? repo.listPhotos(entry.id) : noPhotos), [repo, entry?.id]) ?? noPhotos;

  // 連続操作で同じ日の記録が2件できないよう、作成中の Promise を使い回す
  const creating = useRef<{ date: string; promise: Promise<Entry<TFields>> } | null>(null);

  function ensureEntry(): Promise<Entry<TFields>> {
    if (entry) return Promise.resolve(entry);
    if (creating.current?.date !== date) {
      creating.current = { date, promise: repo.create({ date, fields: initialFields }) };
    }
    return creating.current.promise;
  }

  async function addPhotos(files: File[]): Promise<number> {
    const target = await ensureEntry();
    return addPhotosTo(repo, target.id, files);
  }

  async function updateFields(fields: TFields) {
    const target = await ensureEntry();
    await repo.update(target.id, { fields });
  }

  async function updateNote(note: string) {
    const target = await ensureEntry();
    await repo.update(target.id, { note });
  }

  return {
    isLoading: entries === undefined,
    entry,
    photos,
    addPhotos,
    removePhoto: (photoId: string) => repo.removePhoto(photoId),
    updateFields,
    updateNote,
  };
}

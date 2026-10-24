import { useLiveQuery } from "dexie-react-hooks";
import type { JournalRepository } from "../repository";
import type { Photo } from "../types";
import { addPhotosTo } from "./addPhotosTo";

const noPhotos: Photo[] = [];

// ID で指定した記録1件を扱う。entry は読み込み中 undefined、見つからなければ null
export function useEntry<TFields>(repo: JournalRepository<TFields>, id: string) {
  const entry = useLiveQuery(async () => (await repo.findById(id)) ?? null, [repo, id]);
  const photos = useLiveQuery(() => repo.listPhotos(id), [repo, id]) ?? noPhotos;

  return {
    entry,
    photos,
    addPhotos: (files: File[]) => addPhotosTo(repo, id, files),
    removePhoto: (photoId: string) => repo.removePhoto(photoId),
    updateFields: (fields: TFields) => repo.update(id, { fields }),
    updateNote: (note: string) => repo.update(id, { note }),
    remove: () => repo.remove(id),
  };
}

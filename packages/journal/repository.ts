import type { Entry, EntryPatch, NewEntry, NewPhoto, Photo } from "./types";

// 画面はこのインターフェースだけに依存する。Supabase 版はこれを実装して差し替える
export interface JournalRepository<TFields> {
  findByDate(date: string): Promise<Entry<TFields>[]>;
  findByMonth(month: string): Promise<Entry<TFields>[]>;
  create(input: NewEntry<TFields>): Promise<Entry<TFields>>;
  update(id: string, patch: EntryPatch<TFields>): Promise<void>;
  listPhotos(entryId: string): Promise<Photo[]>;
  listPhotosByEntries(entryIds: string[]): Promise<Photo[]>;
  addPhoto(entryId: string, input: NewPhoto): Promise<Photo>;
  removePhoto(photoId: string): Promise<void>;
}

import { createId } from "../lib/id";
import type { JournalRepository } from "../repository";
import type { Entry, Photo } from "../types";
import type { JournalDB } from "./db";

export function createDexieRepository<TFields>(db: JournalDB<TFields>): JournalRepository<TFields> {
  return {
    findById(id) {
      return db.entries.get(id);
    },

    findByDate(date) {
      return db.entries.where("date").equals(date).sortBy("createdAt");
    },

    // date は "YYYY-MM-DD" の文字列なので、月の前方一致で引ける
    findByMonth(month) {
      return db.entries.where("date").startsWith(`${month}-`).sortBy("date");
    },

    findAll() {
      return db.entries.toArray();
    },

    async create(input) {
      const now = Date.now();
      const entry: Entry<TFields> = {
        id: createId(),
        date: input.date,
        note: input.note ?? "",
        fields: input.fields,
        createdAt: now,
        updatedAt: now,
      };
      await db.entries.add(entry);
      return entry;
    },

    async update(id, patch) {
      // オブジェクト形式は TFields がジェネリックだと型解決できないため、関数形式で書き換える
      await db.entries.update(id, (entry) => {
        Object.assign(entry, patch, { updatedAt: Date.now() });
      });
    },

    // 途中で失敗して写真だけ残る、ということがないよう1つのトランザクションで消す
    async remove(id) {
      await db.transaction("rw", db.entries, db.photos, async () => {
        await db.photos.where("entryId").equals(id).delete();
        await db.entries.delete(id);
      });
    },

    listPhotos(entryId) {
      return db.photos.where("entryId").equals(entryId).sortBy("createdAt");
    },

    // カレンダーで1か月分をまとめて引く用
    listPhotosByEntries(entryIds) {
      return db.photos.where("entryId").anyOf(entryIds).sortBy("createdAt");
    },

    async addPhoto(entryId, input) {
      const photo: Photo = { id: createId(), entryId, ...input, createdAt: Date.now() };
      await db.photos.add(photo);
      return photo;
    },

    async removePhoto(photoId) {
      await db.photos.delete(photoId);
    },
  };
}

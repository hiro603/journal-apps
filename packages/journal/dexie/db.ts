import Dexie, { type EntityTable } from "dexie";
import type { Entry, Photo } from "../types";

export class JournalDB<TFields> extends Dexie {
  entries!: EntityTable<Entry<TFields>, "id">;
  photos!: EntityTable<Photo, "id">;

  // アプリごとに DB 名を分ける（食事日記と釣果記録が同じ端末でも混ざらない）
  constructor(name: string) {
    super(name);
    this.version(1).stores({
      entries: "id, date",
      photos: "id, entryId",
    });
  }
}

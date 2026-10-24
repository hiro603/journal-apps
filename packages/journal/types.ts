// 記録の汎用型。アプリ固有の項目は TFields に入れる（食事日記なら MealFields）
export type Entry<TFields> = {
  id: string;
  date: string;
  note: string;
  fields: TFields;
  createdAt: number;
  updatedAt: number;
};

export type Photo = {
  id: string;
  entryId: string;
  image: Blob;
  thumb: Blob;
  width: number;
  height: number;
  createdAt: number;
};

export type NewEntry<TFields> = Pick<Entry<TFields>, "date" | "fields"> & { note?: string };

export type EntryPatch<TFields> = Partial<Pick<Entry<TFields>, "note" | "fields">>;

export type NewPhoto = Pick<Photo, "image" | "thumb" | "width" | "height">;

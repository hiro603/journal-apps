import { JournalDB } from "@journal-apps/journal/dexie/db";
import { createDexieRepository } from "@journal-apps/journal/dexie/repository";
import type { FishingFields } from "./fields";

// 食事日記とは DB 名を分け、同じ端末でもデータが混ざらないようにする
export const fishingRepository = createDexieRepository(new JournalDB<FishingFields>("fishing-log"));

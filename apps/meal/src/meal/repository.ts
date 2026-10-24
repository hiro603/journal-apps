import { JournalDB } from "@journal-apps/journal/dexie/db";
import { createDexieRepository } from "@journal-apps/journal/dexie/repository";
import type { MealFields } from "./fields";

export const mealRepository = createDexieRepository(new JournalDB<MealFields>("meal-diary"));

import type { Entry } from "@journal-apps/journal/types";
import type { Catch, FishingFields } from "./fields";

type Trip = Entry<FishingFields>;

const pad = (n: number) => String(n).padStart(2, "0");

export function toTimeText(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 開始時刻の順。時刻が無い釣行は後ろに回し、同じなら作った順
export function sortTrips<T extends { entry: Trip }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ta = a.entry.fields.startTime;
    const tb = b.entry.fields.startTime;
    if (ta !== tb) {
      if (ta === null) return 1;
      if (tb === null) return -1;
      return ta < tb ? -1 : 1;
    }
    return a.entry.createdAt - b.entry.createdAt;
  });
}

export function totalCount(catches: Catch[]): number {
  return catches.reduce((sum, c) => sum + c.count, 0);
}

// 一覧に出す釣果の要約。例: "アジ 12・サバ 3"
export function describeCatches(catches: Catch[]): string {
  const caught = catches.filter((c) => c.species !== "" && c.count > 0);
  if (caught.length === 0) return "釣果なし";
  return caught.map((c) => `${c.species} ${c.count}`).join("・");
}

export type Suggestions = { spots: string[]; species: string[]; tackles: string[] };

// 過去に入れた値を、最近使った順・重複なしで返す
export function collectSuggestions(trips: Trip[]): Suggestions {
  const recent = [...trips].sort((a, b) => b.updatedAt - a.updatedAt);
  const unique = (values: string[]) => [...new Set(values.filter((v) => v !== ""))];
  return {
    spots: unique(recent.map((t) => t.fields.spot)),
    species: unique(recent.flatMap((t) => t.fields.catches.map((c) => c.species))),
    tackles: unique(recent.map((t) => t.fields.tackle)),
  };
}

import { describe, expect, it } from "vitest";
import type { Entry } from "@journal-apps/journal/types";
import { initialFishingFields, type FishingFields } from "./fields";
import { collectSuggestions, dayTotal, describeCatches, sortTrips, toTimeText, totalCount } from "./trips";

const trip = (id: string, fields: Partial<FishingFields>, createdAt = 0, updatedAt = createdAt): Entry<FishingFields> => ({
  id,
  date: "2026-10-25",
  note: "",
  fields: { ...initialFishingFields, ...fields },
  createdAt,
  updatedAt,
});

describe("sortTrips", () => {
  it("開始時刻の順に並べ、時刻の無い釣行は後ろ、同じなら作った順", () => {
    const items = [
      trip("none", {}, 1),
      trip("late", { startTime: "15:00" }, 2),
      trip("early-b", { startTime: "05:30" }, 4),
      trip("early-a", { startTime: "05:30" }, 3),
    ].map((entry) => ({ entry }));

    expect(sortTrips(items).map((i) => i.entry.id)).toEqual(["early-a", "early-b", "late", "none"]);
  });
});

describe("describeCatches / totalCount", () => {
  it("魚種と匹数を並べる", () => {
    const catches = [
      { species: "アジ", count: 12, maxSizeCm: 23 },
      { species: "サバ", count: 3, maxSizeCm: null },
    ];
    expect(describeCatches(catches)).toBe("アジ 12・サバ 3");
    expect(totalCount(catches)).toBe(15);
  });

  it("釣果が無い、または 0 匹・魚種未入力だけなら「釣果なし」", () => {
    expect(describeCatches([])).toBe("釣果なし");
    expect(describeCatches([{ species: "アジ", count: 0, maxSizeCm: null }, { species: "", count: 2, maxSizeCm: null }])).toBe("釣果なし");
  });
});

describe("collectSuggestions", () => {
  it("最近使った順・重複なし・空欄を除いて返す", () => {
    const trips = [
      trip("old", { spot: "〇〇港", tackle: "サビキ", catches: [{ species: "アジ", count: 1, maxSizeCm: null }] }, 0, 10),
      trip("new", { spot: "△△磯", tackle: "", catches: [{ species: "メジナ", count: 1, maxSizeCm: null }, { species: "アジ", count: 2, maxSizeCm: null }] }, 0, 20),
      trip("again", { spot: "〇〇港" }, 0, 5),
    ];

    expect(collectSuggestions(trips)).toEqual({
      spots: ["△△磯", "〇〇港"],
      species: ["メジナ", "アジ"],
      tackles: ["サビキ"],
    });
  });
});

describe("toTimeText", () => {
  it("時と分を2桁で返す", () => {
    expect(toTimeText(new Date(2026, 9, 25, 5, 3))).toBe("05:03");
  });
});

describe("dayTotal", () => {
  it("その日の釣行の匹数をすべて足し、釣果が無ければ0", () => {
    const morning = trip("m", { catches: [{ species: "アジ", count: 12, maxSizeCm: null }, { species: "サバ", count: 3, maxSizeCm: null }] });
    const evening = trip("e", { catches: [{ species: "アジ", count: 5, maxSizeCm: 22 }] });

    expect(dayTotal([morning, evening])).toBe(20);
    expect(dayTotal([trip("empty", {})])).toBe(0);
  });
});

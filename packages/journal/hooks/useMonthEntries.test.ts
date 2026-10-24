import { describe, expect, it } from "vitest";
import type { Entry, Photo } from "../types";
import { summarizeByDate } from "./useMonthEntries";

const entry = (id: string, date: string, createdAt: number): Entry<null> => ({
  id,
  date,
  note: "",
  fields: null,
  createdAt,
  updatedAt: createdAt,
});

const photo = (id: string, entryId: string, createdAt: number) =>
  ({ id, entryId, createdAt, width: 1, height: 1 }) as Photo;

describe("summarizeByDate", () => {
  it("同じ日の記録を作成順にまとめる", () => {
    const days = summarizeByDate([entry("b", "2026-10-03", 20), entry("a", "2026-10-03", 10), entry("c", "2026-10-04", 30)], []);

    expect(days.get("2026-10-03")?.entries.map((e) => e.id)).toEqual(["a", "b"]);
    expect(days.get("2026-10-04")?.entries.map((e) => e.id)).toEqual(["c"]);
  });

  it("表紙はその日で最初の記録の、最初の写真にする", () => {
    const days = summarizeByDate(
      [entry("a", "2026-10-03", 10), entry("b", "2026-10-03", 20)],
      [photo("b1", "b", 1), photo("a2", "a", 6), photo("a1", "a", 5)],
    );

    expect(days.get("2026-10-03")?.cover?.id).toBe("a1");
  });

  it("最初の記録に写真が無ければ、次の記録の写真を表紙にする", () => {
    const days = summarizeByDate([entry("a", "2026-10-03", 10), entry("b", "2026-10-03", 20)], [photo("b1", "b", 1)]);

    expect(days.get("2026-10-03")?.cover?.id).toBe("b1");
  });

  it("写真がひとつも無い日の表紙は null", () => {
    const days = summarizeByDate([entry("a", "2026-10-03", 10)], []);

    expect(days.get("2026-10-03")?.cover).toBeNull();
  });
});

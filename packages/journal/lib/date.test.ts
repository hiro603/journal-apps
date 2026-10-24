import { describe, expect, it } from "vitest";
import { addDays, addMonths, formatDateLabel, formatMonthLabel, isDateKey, isMonthKey, monthGrid, toDateKey } from "./date";

describe("toDateKey", () => {
  it("UTC ではなくローカルの日付を返す", () => {
    expect(toDateKey(new Date(2026, 9, 24, 0, 30))).toBe("2026-10-24");
  });
});

describe("isDateKey", () => {
  it.each(["2026-10-24", "2028-02-29"])("%s は有効", (value) => {
    expect(isDateKey(value)).toBe(true);
  });

  it.each(["2026-02-30", "2026-13-01", "2026-1-5", "abc", ""])("%s は無効", (value) => {
    expect(isDateKey(value)).toBe(false);
  });
});

describe("formatDateLabel", () => {
  it("月日と曜日を返す", () => {
    expect(formatDateLabel("2026-10-24")).toBe("10月24日(土)");
  });
});

describe("addDays", () => {
  it("月・年をまたぐ", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2027-01-01", -1)).toBe("2026-12-31");
  });
});

describe("isMonthKey", () => {
  it.each(["2026-10", "2026-01", "2026-12"])("%s は有効", (value) => {
    expect(isMonthKey(value)).toBe(true);
  });

  it.each(["2026-13", "2026-00", "2026-1", "2026-10-01", ""])("%s は無効", (value) => {
    expect(isMonthKey(value)).toBe(false);
  });
});

describe("addMonths", () => {
  it("年をまたぐ", () => {
    expect(addMonths("2026-12", 1)).toBe("2027-01");
    expect(addMonths("2026-01", -1)).toBe("2025-12");
  });
});

describe("formatMonthLabel", () => {
  it("年と月を返す", () => {
    expect(formatMonthLabel("2026-10")).toBe("2026年10月");
  });
});

describe("monthGrid", () => {
  it("1日の曜日の分だけ前を空け、月末まで並べる", () => {
    // 2026年10月1日は木曜
    const grid = monthGrid("2026-10");
    expect(grid.slice(0, 5)).toEqual([null, null, null, null, "2026-10-01"]);
    expect(grid.at(-1)).toBe("2026-10-31");
    expect(grid).toHaveLength(4 + 31);
  });

  it("うるう年の2月は29日まで", () => {
    expect(monthGrid("2028-02").at(-1)).toBe("2028-02-29");
  });
});

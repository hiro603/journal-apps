import { describe, expect, it } from "vitest";
import { fromDraft, toDraft, type TripDraft } from "./draft";
import { initialFishingFields, type FishingFields } from "./fields";

const fields: FishingFields = {
  ...initialFishingFields,
  startTime: "05:30",
  spot: "〇〇港",
  windSpeed: 3.5,
  catches: [{ species: "アジ", count: 12, maxSizeCm: 23.5 }],
};

describe("toDraft / fromDraft", () => {
  it("下書きにして戻すと元の値になる", () => {
    expect(fromDraft(toDraft(fields))).toEqual(fields);
  });

  it("数値の欄は空なら null、匹数だけは 0 にする", () => {
    const draft: TripDraft = { ...toDraft(fields), windSpeed: "", catches: [{ species: "サバ", count: "", maxSizeCm: "" }] };

    expect(fromDraft(draft)).toMatchObject({ windSpeed: null, catches: [{ species: "サバ", count: 0, maxSizeCm: null }] });
  });

  it("数値にならない入力は null、匹数は 0 以上の整数にそろえる", () => {
    const draft: TripDraft = { ...toDraft(fields), windSpeed: "abc", catches: [{ species: "アジ", count: "-2.7", maxSizeCm: "x" }] };

    expect(fromDraft(draft)).toMatchObject({ windSpeed: null, catches: [{ count: 0, maxSizeCm: null }] });
  });

  it("指数表記・16進数・負の値は数値にせず、匹数は上限 9999 にそろえる", () => {
    const draft: TripDraft = {
      ...toDraft(fields),
      windSpeed: "-2",
      catches: [
        { species: "イワシ", count: "1e400", maxSizeCm: "Infinity" },
        { species: "アジ", count: "0x10", maxSizeCm: "-5" },
        { species: "サバ", count: "99999999999999999999", maxSizeCm: "23." },
      ],
    };

    expect(fromDraft(draft)).toMatchObject({
      windSpeed: null,
      catches: [
        { count: 0, maxSizeCm: null },
        { count: 0, maxSizeCm: null },
        { count: 9999, maxSizeCm: 23 },
      ],
    });
  });

  it("文字の欄は前後の空白を取る", () => {
    const draft: TripDraft = { ...toDraft(fields), spot: " 〇〇港 ", tackle: " サビキ ", catches: [{ species: " アジ ", count: "1", maxSizeCm: "" }] };

    expect(fromDraft(draft)).toMatchObject({ spot: "〇〇港", tackle: "サビキ", catches: [{ species: "アジ" }] });
  });
});

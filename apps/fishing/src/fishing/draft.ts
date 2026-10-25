import type { FishingFields } from "./fields";

// 入力中の値。数値の欄は "23." のような途中の入力を消さないよう文字列で持ち、保存時に数値へ変える
export type CatchDraft = { species: string; count: string; maxSizeCm: string };
export type TripDraft = Omit<FishingFields, "windSpeed" | "catches"> & {
  windSpeed: string;
  catches: CatchDraft[];
};

const toText = (n: number | null) => (n === null ? "" : String(n));

const MAX_COUNT = 9999;

// 0以上の数字と小数点だけを受け付ける（"1e400" や "0x10"、負の値は数値にしない）
function toNumber(text: string): number | null {
  const trimmed = text.trim();
  return /^(\d+\.?\d*|\.\d+)$/.test(trimmed) ? Number(trimmed) : null;
}

export function toDraft(fields: FishingFields): TripDraft {
  return {
    ...fields,
    windSpeed: toText(fields.windSpeed),
    catches: fields.catches.map((c) => ({ species: c.species, count: String(c.count), maxSizeCm: toText(c.maxSizeCm) })),
  };
}

export function fromDraft(draft: TripDraft): FishingFields {
  return {
    ...draft,
    spot: draft.spot.trim(),
    tackle: draft.tackle.trim(),
    windSpeed: toNumber(draft.windSpeed),
    catches: draft.catches.map((c) => ({
      species: c.species.trim(),
      count: Math.min(MAX_COUNT, Math.trunc(toNumber(c.count) ?? 0)),
      maxSizeCm: toNumber(c.maxSizeCm),
    })),
  };
}

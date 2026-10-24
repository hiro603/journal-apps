// 食事日記の固有項目。overate: true=食べすぎ / false=OK / null=未入力
export type MealFields = {
  overate: boolean | null;
};

export type Overate = MealFields["overate"];

export const initialMealFields: MealFields = { overate: null };

// 記録画面のトグルとカレンダーで同じ記号・文言を使う
export function describeOverate(value: Overate): { mark: string; label: string } {
  if (value === true) return { mark: "○", label: "食べすぎ" };
  if (value === false) return { mark: "×", label: "ふつう" };
  return { mark: "―", label: "未入力" };
}

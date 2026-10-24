// 釣果ノートの固有項目。釣行1回 = 記録1件で、1日に複数の釣行を持てる

export const weathers = ["晴れ", "曇り", "雨", "雪"] as const;
export const tides = ["大潮", "中潮", "小潮", "長潮", "若潮"] as const;
export const windDirections = [
  "北", "北北東", "北東", "東北東", "東", "東南東", "南東", "南南東",
  "南", "南南西", "南西", "西南西", "西", "西北西", "北西", "北北西",
] as const;

export type Weather = (typeof weathers)[number];
export type Tide = (typeof tides)[number];
export type WindDirection = (typeof windDirections)[number];

// 魚種ごとに1行。サイズはその魚種の最大サイズ
export type Catch = {
  species: string;
  count: number;
  maxSizeCm: number | null;
};

export type FishingFields = {
  startTime: string | null;
  spot: string;
  weather: Weather | null;
  tide: Tide | null;
  windSpeed: number | null;
  windDirection: WindDirection | null;
  tackle: string;
  catches: Catch[];
};

export const initialFishingFields: FishingFields = {
  startTime: null,
  spot: "",
  weather: null,
  tide: null,
  windSpeed: null,
  windDirection: null,
  tackle: "",
  catches: [],
};

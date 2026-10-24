import { describe, expect, it } from "vitest";
import { fitWithin } from "./image";

describe("fitWithin", () => {
  it("横長は横幅を長辺に合わせる", () => {
    expect(fitWithin({ width: 4032, height: 3024 }, 1200)).toEqual({ width: 1200, height: 900 });
  });

  it("縦長は高さを長辺に合わせる", () => {
    expect(fitWithin({ width: 3024, height: 4032 }, 1200)).toEqual({ width: 900, height: 1200 });
  });

  it("長辺より小さい画像は拡大しない", () => {
    expect(fitWithin({ width: 800, height: 600 }, 1200)).toEqual({ width: 800, height: 600 });
  });
});

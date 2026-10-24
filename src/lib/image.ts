import type { NewPhoto } from "@/journal/types";

const IMAGE_MAX_EDGE = 1200;
const THUMB_MAX_EDGE = 240;
const JPEG_QUALITY = 0.8;

type Size = { width: number; height: number };

// 長辺を maxEdge に収める。小さい画像は拡大しない
export function fitWithin({ width, height }: Size, maxEdge: number): Size {
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

async function renderJpeg(source: ImageBitmap, maxEdge: number): Promise<{ blob: Blob } & Size> {
  const size = fitWithin(source, maxEdge);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("画像を処理できませんでした");
  // 透過 PNG を JPEG にすると透明部分が黒になるため、先に白で塗る
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size.width, size.height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, size.width, size.height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
  if (!blob) throw new Error("画像を処理できませんでした");
  return { blob, ...size };
}

// canvas に描き直した画素だけを書き出すので、位置情報などの EXIF は残らない。
// 回転情報は createImageBitmap が描画前に反映する
export async function processImage(file: File): Promise<NewPhoto> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const image = await renderJpeg(bitmap, IMAGE_MAX_EDGE);
    const thumb = await renderJpeg(bitmap, THUMB_MAX_EDGE);
    return { image: image.blob, thumb: thumb.blob, width: image.width, height: image.height };
  } finally {
    bitmap.close();
  }
}

import { processImage } from "../lib/image";
import type { JournalRepository } from "../repository";

// 縮小・EXIF 除去をしてから保存し、読み込めなかった枚数を返す（PC の Chrome で HEIC を選んだときなど）
export async function addPhotosTo<TFields>(repo: JournalRepository<TFields>, entryId: string, files: File[]): Promise<number> {
  let failed = 0;
  for (const file of files) {
    try {
      await repo.addPhoto(entryId, await processImage(file));
    } catch {
      failed++;
    }
  }
  return failed;
}

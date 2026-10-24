"use client";

import type { Photo } from "../types";
import { BlobImage } from "./BlobImage";
import styles from "./PhotoGrid.module.scss";

type Props = { photos: Photo[]; onRemove: (photoId: string) => void };

export function PhotoGrid({ photos, onRemove }: Props) {
  if (photos.length === 0) {
    return <p className={styles.empty}>まだ写真がありません</p>;
  }

  return (
    <ul className={styles.grid}>
      {photos.map((photo, i) => (
        <li key={photo.id} className={styles.item}>
          {/* サムネイル(長辺240px)は正方形に切り抜くと高解像度の画面でぼやけるため、本体を表示する */}
          <BlobImage blob={photo.image} alt={`写真${i + 1}`} className={styles.image} />
          <button
            type="button"
            className={styles.remove}
            aria-label={`写真${i + 1}を削除`}
            onClick={() => {
              if (window.confirm("この写真を削除しますか？")) onRemove(photo.id);
            }}
          >
            <span className={styles.removeMark} aria-hidden="true">
              ×
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

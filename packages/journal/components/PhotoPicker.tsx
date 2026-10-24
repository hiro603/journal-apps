"use client";

import { useRef, type ChangeEvent } from "react";
import styles from "./PhotoPicker.module.scss";

type Props = { onFiles: (files: File[]) => void; disabled: boolean };

// capture を付けるとアルバムを選べなくなるため、「撮る」と「選ぶ」で input を分ける
export function PhotoPicker({ onFiles, disabled }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    // 同じ写真を続けて選んでも change が発火するように空にする
    e.target.value = "";
    if (files.length > 0) onFiles(files);
  }

  return (
    <div className={styles.picker}>
      <button type="button" className={styles.primary} disabled={disabled} onClick={() => cameraRef.current?.click()}>
        撮る
      </button>
      <button type="button" className={styles.secondary} disabled={disabled} onClick={() => libraryRef.current?.click()}>
        選ぶ
      </button>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={handleChange} />
      <input ref={libraryRef} type="file" accept="image/*" multiple hidden onChange={handleChange} />
    </div>
  );
}

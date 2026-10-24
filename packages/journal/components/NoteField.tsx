"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./NoteField.module.scss";

const SAVE_DELAY_MS = 500;

type Props = { initialValue: string; onSave: (note: string) => void };

// 入力が止まってから自動保存する。画面を離れるときは待たずに保存する
export function NoteField({ initialValue, onSave }: Props) {
  const id = useId();
  const [value, setValue] = useState(initialValue);
  const pending = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    onSaveRef.current = onSave;
  });

  function flush() {
    clearTimeout(timer.current);
    if (pending.current === null) return;
    onSaveRef.current(pending.current);
    pending.current = null;
  }

  useEffect(() => flush, []);

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        メモ
      </label>
      <textarea
        id={id}
        className={styles.textarea}
        value={value}
        rows={3}
        placeholder="ひとこと（任意）"
        onChange={(e) => {
          setValue(e.target.value);
          pending.current = e.target.value;
          clearTimeout(timer.current);
          timer.current = setTimeout(flush, SAVE_DELAY_MS);
        }}
        onBlur={flush}
      />
    </div>
  );
}

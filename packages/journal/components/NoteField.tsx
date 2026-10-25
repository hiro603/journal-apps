"use client";

import { useId, useState } from "react";
import { useDebouncedSave } from "../hooks/useDebouncedSave";
import styles from "./NoteField.module.scss";

type Props = { initialValue: string; onSave: (note: string) => void };

// 入力が止まってから自動保存する。欄を離れたとき・画面を離れるとき・アプリが裏に回ったときは待たずに保存する
export function NoteField({ initialValue, onSave }: Props) {
  const id = useId();
  const [value, setValue] = useState(initialValue);
  const { schedule, flush } = useDebouncedSave(onSave);

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
          schedule(e.target.value);
        }}
        onBlur={flush}
      />
    </div>
  );
}

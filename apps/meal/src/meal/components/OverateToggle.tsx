"use client";

import { useId } from "react";
import { describeOverate, type Overate } from "../fields";
import styles from "./OverateToggle.module.scss";

const tones: { value: Overate; tone: string }[] = [
  { value: true, tone: styles.over },
  { value: false, tone: styles.ok },
  { value: null, tone: styles.none },
];
const options = tones.map((o) => ({ ...o, ...describeOverate(o.value) }));

type Props = { value: Overate; onChange: (value: Overate) => void };

// 3択なのでネイティブのラジオボタンを使う（キーボード・読み上げの操作が標準で付く）
export function OverateToggle({ value, onChange }: Props) {
  const name = useId();

  return (
    <fieldset className={styles.toggle}>
      <legend className={styles.legend}>食べすぎた？</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={String(option.value)} className={`${styles.option} ${option.tone}`}>
            <input
              type="radio"
              name={name}
              className={styles.input}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.mark} aria-hidden="true">
              {option.mark}
            </span>
            <span className={styles.label}>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

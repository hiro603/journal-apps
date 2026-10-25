"use client";

import { useId } from "react";
import styles from "./ChoiceGroup.module.scss";

type Props<T extends string> = {
  legend: string;
  options: readonly T[];
  value: T | null;
  onChange: (value: T | null) => void;
  columns: number;
};

// 選択式の項目。ネイティブのラジオボタンなので、キーボードと読み上げにも対応する。「―」で未入力に戻せる
export function ChoiceGroup<T extends string>({ legend, options, value, onChange, columns }: Props<T>) {
  const name = useId();
  const choices: { value: T | null; label: string }[] = [...options.map((o) => ({ value: o, label: o })), { value: null, label: "―" }];

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {choices.map((choice) => (
          <label key={choice.label} className={styles.option}>
            <input
              type="radio"
              name={name}
              className={styles.input}
              checked={value === choice.value}
              onChange={() => onChange(choice.value)}
            />
            {choice.value === null ? (
              <>
                <span aria-hidden="true">―</span>
                <span className={styles.input}>未入力</span>
              </>
            ) : (
              <span>{choice.label}</span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

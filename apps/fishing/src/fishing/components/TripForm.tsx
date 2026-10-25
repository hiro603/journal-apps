"use client";

import { useId, useState } from "react";
import { useDebouncedSave } from "@journal-apps/journal/hooks/useDebouncedSave";
import { fromDraft, toDraft, type CatchDraft, type TripDraft } from "../draft";
import { tides, weathers, windDirections, type FishingFields, type WindDirection } from "../fields";
import { useSuggestions } from "../useSuggestions";
import { ChoiceGroup } from "./ChoiceGroup";
import styles from "./TripForm.module.scss";

type Props = { initial: FishingFields; onSave: (fields: FishingFields) => void };

const newCatch: CatchDraft = { species: "", count: "1", maxSizeCm: "" };

// 入力は画面の中で持ち、止まってから保存する（1文字ごとに保存すると、読み戻した値で入力欄が上書きされる）
export function TripForm({ initial, onSave }: Props) {
  const id = useId();
  const [draft, setDraft] = useState(() => toDraft(initial));
  const save = useDebouncedSave((value: TripDraft) => onSave(fromDraft(value)));
  const suggestions = useSuggestions();

  function change(next: TripDraft) {
    setDraft(next);
    save(next);
  }

  function changeCatch(index: number, patch: Partial<CatchDraft>) {
    change({ ...draft, catches: draft.catches.map((c, i) => (i === index ? { ...c, ...patch } : c)) });
  }

  return (
    <div className={styles.form}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${id}-time`} className={styles.label}>
            開始時刻
          </label>
          <input
            id={`${id}-time`}
            type="time"
            className={styles.input}
            value={draft.startTime ?? ""}
            onChange={(e) => change({ ...draft, startTime: e.target.value || null })}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-spot`} className={styles.label}>
            釣り場
          </label>
          <input
            id={`${id}-spot`}
            className={styles.input}
            list={`${id}-spots`}
            value={draft.spot}
            placeholder="〇〇港"
            onChange={(e) => change({ ...draft, spot: e.target.value })}
          />
          <datalist id={`${id}-spots`}>
            {suggestions.spots.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
      </div>

      <fieldset className={styles.catches}>
        <legend className={styles.label}>釣果</legend>
        {draft.catches.length > 0 && (
          <div className={styles.catchHead} aria-hidden="true">
            <span>魚種</span>
            <span>匹数</span>
            <span>最大cm</span>
          </div>
        )}
        <datalist id={`${id}-species`}>
          {suggestions.species.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        {draft.catches.map((c, i) => (
          <div key={i} className={styles.catchRow}>
            <input
              className={styles.input}
              aria-label={`魚種${i + 1}`}
              list={`${id}-species`}
              value={c.species}
              placeholder="アジ"
              onChange={(e) => changeCatch(i, { species: e.target.value })}
            />
            <input
              className={styles.input}
              aria-label={`魚種${i + 1}の匹数`}
              inputMode="numeric"
              value={c.count}
              onChange={(e) => changeCatch(i, { count: e.target.value })}
            />
            <input
              className={styles.input}
              aria-label={`魚種${i + 1}の最大サイズ（cm）`}
              inputMode="decimal"
              value={c.maxSizeCm}
              onChange={(e) => changeCatch(i, { maxSizeCm: e.target.value })}
            />
            <button
              type="button"
              className={styles.removeCatch}
              aria-label={`魚種${i + 1}を削除`}
              onClick={() => change({ ...draft, catches: draft.catches.filter((_, j) => j !== i) })}
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className={styles.addCatch} onClick={() => change({ ...draft, catches: [...draft.catches, newCatch] })}>
          ＋ 魚種を追加
        </button>
      </fieldset>

      <ChoiceGroup legend="天気" options={weathers} value={draft.weather} columns={5} onChange={(weather) => change({ ...draft, weather })} />
      <ChoiceGroup legend="潮" options={tides} value={draft.tide} columns={3} onChange={(tide) => change({ ...draft, tide })} />

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${id}-wind`} className={styles.label}>
            風速（m/s）
          </label>
          <input
            id={`${id}-wind`}
            className={styles.input}
            inputMode="decimal"
            value={draft.windSpeed}
            onChange={(e) => change({ ...draft, windSpeed: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-direction`} className={styles.label}>
            風向き
          </label>
          <select
            id={`${id}-direction`}
            className={styles.input}
            value={draft.windDirection ?? ""}
            onChange={(e) => change({ ...draft, windDirection: (e.target.value || null) as WindDirection | null })}
          >
            <option value="">―</option>
            {windDirections.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-tackle`} className={styles.label}>
          仕掛け
        </label>
        <input
          id={`${id}-tackle`}
          className={styles.input}
          list={`${id}-tackles`}
          value={draft.tackle}
          placeholder="サビキ 6号"
          onChange={(e) => change({ ...draft, tackle: e.target.value })}
        />
        <datalist id={`${id}-tackles`}>
          {suggestions.tackles.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { DayNav } from "@/journal/components/DayNav";
import { NoteField } from "@/journal/components/NoteField";
import { PhotoGrid } from "@/journal/components/PhotoGrid";
import { PhotoPicker } from "@/journal/components/PhotoPicker";
import { useDailyEntry } from "@/journal/hooks/useDailyEntry";
import { initialMealFields } from "../fields";
import { mealRepository } from "../repository";
import { OverateToggle } from "./OverateToggle";
import styles from "./MealDayScreen.module.scss";

export function MealDayScreen({ date }: { date: string }) {
  const day = useDailyEntry(mealRepository, date, initialMealFields);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleFiles(files: File[]) {
    setIsAdding(true);
    setMessage(null);
    const failed = await day.addPhotos(files);
    setIsAdding(false);
    if (failed > 0) setMessage(`${failed}枚の画像を読み込めませんでした`);
  }

  const fields = day.entry?.fields ?? initialMealFields;

  return (
    <div className={styles.screen}>
      <DayNav date={date} />

      {!day.isLoading && (
        <div className={styles.body}>
          <PhotoGrid photos={day.photos} onRemove={day.removePhoto} />
          <OverateToggle value={fields.overate} onChange={(overate) => day.updateFields({ ...fields, overate })} />
          <NoteField initialValue={day.entry?.note ?? ""} onSave={day.updateNote} />
        </div>
      )}

      <div className={styles.actions}>
        {message && (
          <p className={styles.message} role="alert">
            {message}
          </p>
        )}
        {isAdding && <p className={styles.status}>保存しています…</p>}
        <PhotoPicker onFiles={handleFiles} disabled={day.isLoading || isAdding} />
      </div>
    </div>
  );
}

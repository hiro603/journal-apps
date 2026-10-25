"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NoteField } from "@journal-apps/journal/components/NoteField";
import { PhotoGrid } from "@journal-apps/journal/components/PhotoGrid";
import { PhotoPicker } from "@journal-apps/journal/components/PhotoPicker";
import { useEntry } from "@journal-apps/journal/hooks/useEntry";
import { formatDateLabel } from "@journal-apps/journal/lib/date";
import { useToday } from "@journal-apps/journal/lib/useToday";
import { fishingRepository } from "../repository";
import { TripForm } from "./TripForm";
import styles from "./TripScreen.module.scss";
import screen from "./Screen.module.scss";

export function TripScreen({ id }: { id: string }) {
  const trip = useEntry(fishingRepository, id);
  const today = useToday();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (trip.entry === undefined || today === null) return null;

  if (trip.entry === null) {
    return (
      <div className={styles.missing}>
        <h1 className={styles.title}>この釣行は見つかりません</h1>
        <Link href="/">今日の釣行へ</Link>
      </div>
    );
  }

  const { date, fields, note } = trip.entry;
  const dayHref = date === today ? "/" : `/day/${date}`;

  async function handleFiles(files: File[]) {
    setIsAdding(true);
    setMessage(null);
    const failed = await trip.addPhotos(files);
    setIsAdding(false);
    if (failed > 0) setMessage(`${failed}枚の画像を読み込めませんでした`);
  }

  async function handleRemove() {
    if (!window.confirm("この釣行を削除しますか？写真も一緒に消えます。")) return;
    await trip.remove();
    router.replace(dayHref);
  }

  return (
    <div className={screen.screen}>
      <header className={styles.header}>
        <Link href={dayHref} className={styles.back} aria-label="その日の釣行一覧へ戻る">
          ‹
        </Link>
        <h1 className={styles.title}>{formatDateLabel(date)}の釣行</h1>
      </header>

      <div className={screen.body}>
        <PhotoGrid photos={trip.photos} onRemove={trip.removePhoto} />
        <TripForm initial={fields} onSave={trip.updateFields} />
        <NoteField initialValue={note} onSave={trip.updateNote} />
        <button type="button" className={styles.remove} onClick={handleRemove}>
          この釣行を削除
        </button>
      </div>

      <div className={screen.actions}>
        {message && (
          <p className={screen.message} role="alert">
            {message}
          </p>
        )}
        {isAdding && <p className={screen.status}>保存しています…</p>}
        <PhotoPicker onFiles={handleFiles} disabled={isAdding} />
      </div>
    </div>
  );
}

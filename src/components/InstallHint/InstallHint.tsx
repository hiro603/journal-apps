"use client";

import { useSyncExternalStore } from "react";
import styles from "./InstallHint.module.scss";

const DISMISS_KEY = "install-hint-dismissed";
const listeners = new Set<() => void>();
// localStorage が使えない環境（プライベートブラウズ等）でも、閉じたらその場では消す
let dismissedInSession = false;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function isDismissed(): boolean {
  if (dismissedInSession) return true;
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

// iPadOS の Safari は Mac として名乗るため、タッチ対応かどうかで見分ける
function isIOS(): boolean {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
}

function isStandalone(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return iosStandalone || matchMedia("(display-mode: standalone)").matches;
}

// iOS は Safari とホーム画面のアプリで保存場所が別。Safari で記録を始めてしまわないよう案内する
function shouldShow(): boolean {
  return isIOS() && !isStandalone() && !isDismissed();
}

function dismiss() {
  dismissedInSession = true;
  try {
    localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // 保存できなくても、このページを開いている間は消えていれば十分
  }
  listeners.forEach((listener) => listener());
}

export function InstallHint() {
  const visible = useSyncExternalStore(subscribe, shouldShow, () => false);
  if (!visible) return null;

  return (
    <aside className={styles.hint} aria-label="ホーム画面への追加のおすすめ">
      <div className={styles.body}>
        <p className={styles.title}>ホーム画面に追加して使ってください</p>
        <p className={styles.text}>
          Safari とホーム画面のアプリでは、記録が別々に保存されます。共有ボタンから「ホーム画面に追加」を選び、追加したアイコンから記録してください。
        </p>
      </div>
      <button type="button" className={styles.close} aria-label="案内を閉じる" onClick={dismiss}>
        ×
      </button>
    </aside>
  );
}

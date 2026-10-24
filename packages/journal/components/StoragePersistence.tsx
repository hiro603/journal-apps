"use client";

import { useEffect } from "react";

// ブラウザに「このサイトのデータは容量が足りなくなっても消さないで」と頼む。
// HTTPS でしか使えないため、LAN の http から開いたときは何もしない
export function StoragePersistence() {
  useEffect(() => {
    navigator.storage?.persist?.();
  }, []);
  return null;
}

import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { InstallHint } from "@journal-apps/journal/components/InstallHint/InstallHint";
import { StoragePersistence } from "@journal-apps/journal/components/StoragePersistence";
import { TabBar } from "@journal-apps/journal/components/TabBar/TabBar";
import "@/styles/globals.scss";
import styles from "./layout.module.scss";

export const metadata: Metadata = {
  title: "食事日記",
  description: "食べたものを写真で残し、食べすぎたかを○×で振り返る日記",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "食事日記", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // safe-area-inset を効かせるために画面端まで描画する
  viewportFit: "cover",
  themeColor: "#faf8f5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>
        <StoragePersistence />
        <main className={styles.main}>
          <InstallHint />
          {children}
        </main>
        {/* /day/[date] は動的ルートなので、usePathname を使うタブバーは Suspense の内側に置く */}
        <Suspense>
          <TabBar />
        </Suspense>
      </body>
    </html>
  );
}

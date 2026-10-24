import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { InstallHint } from "@journal-apps/journal/components/InstallHint/InstallHint";
import { StoragePersistence } from "@journal-apps/journal/components/StoragePersistence";
import { TabBar } from "@journal-apps/journal/components/TabBar/TabBar";
import "@/styles/globals.scss";
import styles from "./layout.module.scss";

export const metadata: Metadata = {
  title: "釣果ノート",
  description: "釣行ごとに釣果・釣り場・天気・潮・風・仕掛けを記録する釣りの日記",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "釣果ノート", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // safe-area-inset を効かせるために画面端まで描画する
  viewportFit: "cover",
  themeColor: "#f5f8fa",
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

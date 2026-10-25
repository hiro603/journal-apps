import type { MetadataRoute } from "next";

// ホーム画面に追加したときの名前・アイコン・表示方法。
// iOS はホーム画面から開いたアプリのデータを「7日間未使用で削除」の対象から外す
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "釣果ノート",
    short_name: "釣果ノート",
    description: "釣行ごとに釣果・釣り場・天気・潮・風・仕掛けを記録する釣りの日記",
    lang: "ja",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f8fa",
    theme_color: "#f5f8fa",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      // 絵は中央の安全領域に収めてあるので、円や角丸に切り抜かれても欠けない
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

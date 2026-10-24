import type { MetadataRoute } from "next";

// ホーム画面に追加したときの名前・アイコン・表示方法。
// iOS はホーム画面から開いたアプリのデータを「7日間未使用で削除」の対象から外す
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "食事日記",
    short_name: "食事日記",
    description: "食べたものを写真で残し、食べすぎたかを○×で振り返る日記",
    lang: "ja",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#faf8f5",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      // 絵は中央の安全領域に収めてあるので、円や角丸に切り抜かれても欠けない
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

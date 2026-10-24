import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 共通パッケージは TypeScript のまま読み込むので、アプリ側でまとめて変換する
  transpilePackages: ["@journal-apps/journal"],
  cacheComponents: true,
  partialPrefetching: true,
  // 同じ Wi-Fi のスマホから dev サーバーを開くための許可（本番には影響しない）
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // 同じ Wi-Fi のスマホから dev サーバーを開くための許可（本番には影響しない）
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;

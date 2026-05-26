import type { NextConfig } from 'next'

/**
 * ディレクトリ方針:
 * - app/ はプロジェクトルートに配置（標準 Next.js App Router）
 * - app/ の各ページは薄いアダプタとして agents/[feature]/ui/ から import
 * - agents/_shell/ui/ にグローバルレイアウトコンポーネントを配置
 * - 詳細: docs/ARCHITECTURE.md 参照
 */
const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
}

export default nextConfig

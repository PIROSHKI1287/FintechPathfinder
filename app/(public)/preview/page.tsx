import { getPreviewPage } from '@agents/game-level/logic/preview'
import PreviewViewer from '@agents/game-level/ui/PreviewViewer'
import Link from 'next/link'

export const metadata = { title: 'プレビュー | BPSP BizDev育成ゲーム' }

export default async function PreviewPage() {
  const data = await getPreviewPage()

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">プレビューコンテンツは現在準備中です</p>
          <Link href="/login" className="text-sm text-primary hover:underline">
            ログインはこちら
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <PreviewViewer
        levelNumber={data.levelNumber}
        title={data.title}
        heading={data.heading}
        body={data.body}
      />
    </main>
  )
}

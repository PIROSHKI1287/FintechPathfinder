import Link from 'next/link'

interface PreviewViewerProps {
  levelNumber: number
  title: string
  heading: string | null
  body: string | null
}

export default function PreviewViewer({ levelNumber, title, heading, body }: PreviewViewerProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Level {levelNumber} — プレビュー
        </p>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      <div className="min-h-64 rounded-xl border bg-card p-6 shadow-sm">
        {heading && <h2 className="mb-4 text-lg font-bold">{heading}</h2>}
        {body ? (
          <p className="leading-relaxed whitespace-pre-wrap text-sm">{body}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">（コンテンツ準備中）</p>
        )}
      </div>

      {/* 登録誘導バナー */}
      <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
        <p className="mb-1 font-bold">続きを読むには無料登録が必要です</p>
        <p className="mb-4 text-sm text-muted-foreground">
          全 5 レベル・クイズ・パラメータシステムを無料で体験できます
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            無料で始める
          </Link>
          <Link
            href="/login"
            className="rounded-md border px-6 py-2.5 text-sm font-medium hover:bg-muted"
          >
            ログイン
          </Link>
        </div>
      </div>
    </div>
  )
}

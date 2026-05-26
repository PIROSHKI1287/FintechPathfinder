'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PageContent {
  heading?: string
  body?: string
  imageUrl?: string
}

interface StoryPage {
  id: string
  pageNumber: number
  contentJson: unknown
  diagramUrl: string | null
}

interface StoryViewerProps {
  levelNumber: number
  levelId: string
  title: string
  pages: StoryPage[]
}

export default function StoryViewer({ levelNumber, title, pages }: StoryViewerProps) {
  const router = useRouter()
  const [current, setCurrent] = useState(0)

  const total = pages.length

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="mb-2 text-lg font-semibold">コンテンツ準備中</p>
        <p className="mb-6 text-sm text-muted-foreground">
          このレベルの座学コンテンツは現在準備中です。
        </p>
        <button
          onClick={() => router.push('/home')}
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          ホームへ戻る
        </button>
      </div>
    )
  }

  const page = pages[current]
  const content = page?.contentJson as PageContent | null

  return (
    <div className="mx-auto max-w-2xl">
      {/* ヘッダー */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Level {levelNumber}
          </p>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <span className="text-sm text-muted-foreground">
          {current + 1} / {total}
        </span>
      </div>

      {/* プログレスバー */}
      <div className="mb-6 h-1 rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* ページ本文 */}
      <div className="min-h-64 rounded-xl border bg-card p-6 shadow-sm">
        {content?.heading && (
          <h2 className="mb-4 text-lg font-bold">{content.heading}</h2>
        )}
        {content?.body ? (
          <p className="leading-relaxed whitespace-pre-wrap text-sm">{content.body}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">（このページにコンテンツはありません）</p>
        )}
        {(content?.imageUrl ?? page?.diagramUrl) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={content?.imageUrl ?? page?.diagramUrl ?? ''}
            alt="図解"
            className="mt-4 w-full rounded-md border"
          />
        )}
      </div>

      {/* ナビゲーション */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrent((c) => c - 1)}
          disabled={current === 0}
          className="rounded-md border px-5 py-2 text-sm font-medium hover:bg-muted disabled:opacity-40"
        >
          ← 前へ
        </button>

        {current < total - 1 ? (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            次へ →
          </button>
        ) : (
          <button
            onClick={() => router.push(`/game/${levelNumber}/quiz`)}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            クイズへ進む →
          </button>
        )}
      </div>
    </div>
  )
}

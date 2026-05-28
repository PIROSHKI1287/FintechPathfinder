'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface ScriptTurn {
  turn: number
  speaker: 'teacher' | 'student'
  text: string
}

interface ConversationViewerProps {
  levelNumber: number
  levelId: string
  title: string
  script: ScriptTurn[]
}

export default function ConversationViewer({ levelNumber, title, script }: ConversationViewerProps) {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  const total = script.length
  const visibleTurns = script.slice(0, current + 1)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [current])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        setCurrent((c) => Math.min(c + 1, total - 1))
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCurrent((c) => Math.max(c - 1, 0))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [total])

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="mb-2 text-lg font-semibold">コンテンツ準備中</p>
        <button
          onClick={() => router.push('/home')}
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          ホームへ戻る
        </button>
      </div>
    )
  }

  const isLast = current === total - 1

  return (
    <div className="mx-auto max-w-2xl">
      {/* ヘッダー */}
      <div className="mb-4 flex items-center justify-between">
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

      {/* 会話エリア（自然に伸びる） */}
      <div className="space-y-4 pb-6">
        {visibleTurns.map((turn) => (
          <div
            key={turn.turn}
            className={`flex items-end gap-2 ${turn.speaker === 'student' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* スピーカーラベル */}
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold">
                {turn.speaker === 'teacher' ? '先' : '生'}
              </div>
            </div>

            {/* 吹き出し */}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                turn.speaker === 'teacher'
                  ? 'rounded-tl-sm bg-primary text-primary-foreground'
                  : 'rounded-tr-sm bg-muted text-foreground'
              }`}
            >
              {turn.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ナビゲーション（ページ末尾固定） */}
      <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <button
          onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
          disabled={current === 0}
          className="rounded-md border px-5 py-2 text-sm font-medium hover:bg-muted disabled:opacity-40"
        >
          ← 前へ
        </button>

        {isLast ? (
          <button
            onClick={() => router.push(`/game/${levelNumber}/quiz`)}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            クイズへ進む →
          </button>
        ) : (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            次へ →
          </button>
        )}
      </div>
    </div>
  )
}

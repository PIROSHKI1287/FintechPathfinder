'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AttemptEntry {
  id: string
  answeredAt: string
  questionText: string
  chosenChoiceText: string | null
  isCorrect: boolean | null
  complianceAfter: number
  gmvAfter: number
  uxAfter: number
  levelNumber: number
  levelTitle: string
}

interface HistoryByLevel {
  levelNumber: number
  levelTitle: string
  attempts: AttemptEntry[]
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryByLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/history')
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`)
        return r.json()
      })
      .then((data: { history: HistoryByLevel[] }) => setHistory(data.history ?? []))
      .catch(() => setError('履歴の取得に失敗しました'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="py-20 text-center text-muted-foreground">読み込み中…</div>
  }
  if (error) {
    return <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
  }
  if (history.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-muted-foreground">まだクイズを回答していません</p>
        <Link href="/home" className="text-sm text-primary hover:underline">
          レベル選択に戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {history.map((group) => (
        <section key={group.levelNumber}>
          <h2 className="mb-3 text-base font-bold">
            Level {group.levelNumber} — {group.levelTitle}
          </h2>
          <div className="space-y-3">
            {group.attempts.map((a) => (
              <AttemptCard key={a.id} attempt={a} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function AttemptCard({ attempt: a }: { attempt: AttemptEntry }) {
  const date = new Date(a.answeredAt).toLocaleString('ja-JP', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-relaxed">{a.questionText}</p>
        <span className="shrink-0 text-xs text-muted-foreground">{date}</span>
      </div>

      {a.chosenChoiceText && (
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              a.isCorrect === true
                ? 'bg-green-100 text-green-700'
                : a.isCorrect === false
                  ? 'bg-red-100 text-red-700'
                  : 'bg-muted text-muted-foreground'
            }`}
          >
            {a.isCorrect === true ? '正解' : a.isCorrect === false ? '不正解' : '?'}
          </span>
          <p className="text-sm text-muted-foreground">{a.chosenChoiceText}</p>
        </div>
      )}

      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>コンプライアンス: <strong className="text-foreground">{a.complianceAfter}</strong></span>
        <span>GMV: <strong className="text-foreground">{a.gmvAfter}</strong></span>
        <span>UX: <strong className="text-foreground">{a.uxAfter}</strong></span>
      </div>
    </div>
  )
}

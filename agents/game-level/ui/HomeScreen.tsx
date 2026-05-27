'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface LevelItem {
  id: string
  levelNumber: number
  title: string
  description: string
  isPublished: boolean
  isUnlocked: boolean
  progress: {
    status: string
    complianceScore: number
    gmvScore: number
    uxScore: number
    clearedAt: string | null
  } | null
}

const STATUS_LABEL: Record<string, string> = {
  cleared: 'クリア',
  in_progress: '進行中',
  game_over: 'ゲームオーバー',
}

const STATUS_COLOR: Record<string, string> = {
  cleared: 'text-green-600 bg-green-50',
  in_progress: 'text-blue-600 bg-blue-50',
  game_over: 'text-red-600 bg-red-50',
}

export default function HomeScreen() {
  const router = useRouter()
  const [levels, setLevels] = useState<LevelItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/levels')
      .then((r) => r.json())
      .then((data: { levels: LevelItem[] }) => setLevels(data.levels))
      .catch(() => setError('レベル情報の取得に失敗しました'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        読み込み中…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {levels.map((level) => (
        <LevelCard
          key={level.id}
          level={level}
          onStart={() => router.push(`/game/${level.levelNumber}/learn`)}
          onContinue={() => router.push(`/game/${level.levelNumber}/learn`)}
        />
      ))}
      {levels.length === 0 && (
        <p className="col-span-full text-center text-muted-foreground">
          レベルコンテンツは準備中です。もうしばらくお待ちください。
        </p>
      )}
    </div>
  )
}

function LevelCard({
  level,
  onStart,
  onContinue,
}: {
  level: LevelItem
  onStart: () => void
  onContinue: () => void
}) {
  const statusKey = level.progress?.status
  const isCleared = statusKey === 'cleared'
  const isInProgress = statusKey === 'in_progress'

  return (
    <div
      className={`rounded-xl border p-5 transition-shadow ${
        level.isUnlocked && level.isPublished
          ? 'bg-card shadow-sm hover:shadow-md'
          : 'bg-muted/40 opacity-60'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Level {level.levelNumber}
        </span>
        {statusKey && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[statusKey] ?? ''}`}
          >
            {STATUS_LABEL[statusKey] ?? statusKey}
          </span>
        )}
        {!level.isUnlocked && (
          <span className="text-xs text-muted-foreground">🔒 ロック中</span>
        )}
      </div>

      <h3 className="mb-1 font-bold">{level.title}</h3>
      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{level.description}</p>

      {level.progress && (
        <div className="mb-3 space-y-1">
          <ParameterBar label="コンプライアンス" value={level.progress.complianceScore} max={100} color="bg-blue-500" />
          <ParameterBar label="UX" value={level.progress.uxScore} max={100} color="bg-purple-500" />
        </div>
      )}

      {level.isUnlocked && level.isPublished && (
        <button
          onClick={isInProgress ? onContinue : onStart}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {isCleared ? '復習する' : isInProgress ? '続きから' : '開始する'}
        </button>
      )}

      {level.isUnlocked && !level.isPublished && (
        <p className="text-center text-xs text-muted-foreground">コンテンツ準備中</p>
      )}
    </div>
  )
}

function ParameterBar({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
      <div className="h-1.5 flex-1 rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right tabular-nums">{value}</span>
    </div>
  )
}

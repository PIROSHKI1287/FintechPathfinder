import Link from 'next/link'
import ParameterGauges from './ParameterGauges'

interface FinalProgress {
  complianceScore: number
  gmvScore: number
  uxScore: number
  clearedAt: Date | null
}

interface ResultScreenProps {
  levelNumber: number
  title: string
  progress: FinalProgress
  hasNextLevel: boolean
}

export default function ResultScreen({
  levelNumber,
  title,
  progress,
  hasNextLevel,
}: ResultScreenProps) {
  return (
    <div className="mx-auto max-w-md text-center space-y-6">
      <div className="rounded-xl border bg-card p-8 shadow-sm">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Level {levelNumber} — {title}
        </p>
        <h1 className="mb-2 text-3xl font-bold text-green-600">クリア！</h1>
        {progress.clearedAt && (
          <p className="text-xs text-muted-foreground">
            クリア日時:{' '}
            {new Date(progress.clearedAt).toLocaleString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>

      <ParameterGauges
        params={{
          compliance: progress.complianceScore,
          gmv: progress.gmvScore,
          ux: progress.uxScore,
        }}
      />

      <div className="flex flex-col gap-3">
        {hasNextLevel && (
          <Link
            href={`/game/${levelNumber + 1}/learn`}
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Level {levelNumber + 1} へ進む →
          </Link>
        )}
        <Link
          href="/home"
          className="rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  )
}

'use client'

interface Params {
  compliance: number
  gmv: number
  ux: number
}

interface ParameterGaugesProps {
  params: Params
  prev?: Params
}

function GaugeBar({
  label,
  value,
  max,
  prev,
  dangerThreshold,
}: {
  label: string
  value: number
  max: number
  prev?: number
  dangerThreshold?: number
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const delta = prev !== undefined ? value - prev : 0

  const isDanger = dangerThreshold !== undefined && value <= dangerThreshold
  const color = isDanger
    ? 'bg-red-500'
    : pct >= 60
      ? 'bg-green-500'
      : pct >= 30
        ? 'bg-yellow-500'
        : 'bg-red-500'

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2">
          {delta !== 0 && (
            <span
              className={`text-xs font-semibold ${delta > 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {delta > 0 ? `+${delta}` : delta}
            </span>
          )}
          <span className="tabular-nums">{value}</span>
        </div>
      </div>
      <div className="h-3 rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function ParameterGauges({ params, prev }: ParameterGaugesProps) {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        パラメータ
      </p>
      <GaugeBar
        label="コンプライアンス"
        value={params.compliance}
        max={100}
        prev={prev?.compliance}
        dangerThreshold={20}
      />
      <GaugeBar
        label="UX スコア"
        value={params.ux}
        max={100}
        prev={prev?.ux}
      />
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">GMV</span>
        <div className="flex items-center gap-2">
          {prev !== undefined && params.gmv - prev.gmv !== 0 && (
            <span
              className={`text-xs font-semibold ${
                params.gmv - prev.gmv > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {params.gmv - prev.gmv > 0 ? `+${params.gmv - prev.gmv}` : params.gmv - prev.gmv}
            </span>
          )}
          <span className="tabular-nums">¥{params.gmv.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

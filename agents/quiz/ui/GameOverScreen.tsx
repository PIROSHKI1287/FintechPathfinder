'use client'

import { useSearchParams, useRouter } from 'next/navigation'

export default function GameOverScreen() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const level = searchParams.get('level') ?? '1'

  return (
    <div className="mx-auto max-w-md text-center space-y-6">
      <div className="rounded-xl border border-red-200 bg-red-50 p-8">
        <p className="mb-2 text-5xl">⚠</p>
        <h1 className="mb-3 text-2xl font-bold text-red-700">ゲームオーバー</h1>
        <p className="text-sm text-red-600 leading-relaxed">
          コンプライアンススコアが 0 になりました。
          <br />
          BPSP として重大な法令違反・信用失墜が発生しました。
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Level {level} の座学に戻ってコンプライアンスを見直しましょう。
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push(`/game/${level}/learn`)}
          className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          座学を見直す
        </button>
        <button
          onClick={() => router.push(`/game/${level}/quiz`)}
          className="rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
        >
          クイズをやり直す
        </button>
        <button
          onClick={() => router.push('/home')}
          className="text-sm text-muted-foreground hover:underline"
        >
          ホームへ戻る
        </button>
      </div>
    </div>
  )
}

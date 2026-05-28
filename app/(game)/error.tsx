'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GameError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-bold">エラーが発生しました</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          再試行
        </button>
        <button
          onClick={() => router.push('/home')}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          ホームへ戻る
        </button>
      </div>
    </div>
  )
}

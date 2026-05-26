import { Suspense } from 'react'
import GameOverScreen from '@agents/quiz/ui/GameOverScreen'

export const metadata = { title: 'ゲームオーバー | BPSP BizDev育成ゲーム' }

export default function GameOverPage() {
  return (
    <main className="min-h-screen p-8">
      <Suspense fallback={<div className="text-center text-muted-foreground">読み込み中…</div>}>
        <GameOverScreen />
      </Suspense>
    </main>
  )
}

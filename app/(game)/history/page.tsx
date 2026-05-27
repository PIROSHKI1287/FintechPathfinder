import { redirect } from 'next/navigation'
import { auth } from '@/core/auth/auth'
import HistoryPage from '@agents/game-level/ui/HistoryPage'

export const metadata = { title: '学習履歴 | BPSP BizDev育成ゲーム' }

export default async function HistoryPageRoute() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-2 text-2xl font-bold">学習履歴</h1>
      <p className="mb-8 text-sm text-muted-foreground">クイズの回答履歴とパラメータ変化を確認できます</p>
      <HistoryPage />
    </main>
  )
}

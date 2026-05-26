import { cookies } from 'next/headers'
import ConsentGate from '@agents/auth/ui/ConsentGate'

export const metadata = { title: 'ホーム | BPSP BizDev育成ゲーム' }

export default async function HomePage() {
  const cookieStore = await cookies()
  const hasConsent = cookieStore.get('bpsp_consent')?.value === '1'

  return (
    <ConsentGate hasConsent={hasConsent}>
      <main className="min-h-screen p-8">
        <h1 className="text-xl font-bold mb-6">学習レベル選択</h1>
        {/* TODO: <HomeScreen /> */}
      </main>
    </ConsentGate>
  )
}

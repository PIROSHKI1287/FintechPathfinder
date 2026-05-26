import DictionaryPage from '@agents/dictionary/ui/DictionaryPage'

export const metadata = { title: '用語集 | BPSP BizDev育成ゲーム' }

export default function DictionaryPageRoute() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-2 text-2xl font-bold">用語集</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        BPSP関連の専門用語を検索・参照できます
      </p>
      <DictionaryPage />
    </main>
  )
}

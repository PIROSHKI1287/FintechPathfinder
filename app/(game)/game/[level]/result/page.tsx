// S009: 結果・フィードバック画面 (/game/[level]/result)
// TODO: import ResultScreen from '@agents/quiz/ui/ResultScreen'
export default function ResultPage({ params }: { params: { level: string } }) {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-xl font-bold mb-6">Level {params.level} — 結果</h1>
      {/* TODO: <ResultScreen level={params.level} /> */}
    </main>
  )
}

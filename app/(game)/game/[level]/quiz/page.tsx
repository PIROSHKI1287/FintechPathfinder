// S008: クイズ画面 (/game/[level]/quiz)
// TODO: import QuizScreen from '@agents/quiz/ui/QuizScreen'
export default function QuizPage({ params }: { params: { level: string } }) {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-xl font-bold mb-6">Level {params.level} — クイズ</h1>
      {/* TODO: <QuizScreen level={params.level} /> */}
    </main>
  )
}

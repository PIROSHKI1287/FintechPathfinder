// S007: 座学ビューア (/game/[level]/learn)
// TODO: import LearnViewer from '@agents/game-level/ui/LearnViewer'
export default function LearnPage({ params }: { params: { level: string } }) {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-xl font-bold mb-6">Level {params.level} — 座学</h1>
      {/* TODO: <LearnViewer level={params.level} /> */}
    </main>
  )
}

// S006: ストーリー画面 (/game/[level]/story)
// TODO: import StoryScreen from '@agents/game-level/ui/StoryScreen'
export default function StoryPage({ params }: { params: { level: string } }) {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-xl font-bold mb-6">Level {params.level} — ストーリー</h1>
      {/* TODO: <StoryScreen level={params.level} /> */}
    </main>
  )
}

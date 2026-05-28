import { redirect } from 'next/navigation'
import { auth } from '@/core/auth/auth'
import { getLevelStory } from '@agents/game-level/logic/story'
import { getLevelScript } from '@agents/game-level/logic/script'
import StoryViewer from '@agents/game-level/ui/StoryViewer'
import ConversationViewer from '@agents/game-level/ui/ConversationViewer'

export default async function LearnPage({ params }: { params: { level: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const levelNumber = parseInt(params.level, 10)
  if (isNaN(levelNumber)) redirect('/home')

  // Try conversation format first (Unit.type === 'LECTURE' with script)
  const scriptData = await getLevelScript(session.user.id, levelNumber)
  if (scriptData) {
    return (
      <main className="min-h-screen p-8">
        <ConversationViewer
          levelNumber={scriptData.levelNumber}
          levelId={scriptData.levelId}
          title={scriptData.title}
          script={scriptData.script}
        />
      </main>
    )
  }

  // Fallback: existing page-based story viewer
  const data = await getLevelStory(session.user.id, levelNumber)
  if (!data) redirect('/home')

  return (
    <main className="min-h-screen p-8">
      <StoryViewer
        levelNumber={data.levelNumber}
        levelId={data.levelId}
        title={data.title}
        pages={data.pages}
      />
    </main>
  )
}

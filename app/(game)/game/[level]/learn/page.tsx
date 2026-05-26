import { redirect } from 'next/navigation'
import { auth } from '@/core/auth/auth'
import { getLevelStory } from '@agents/game-level/logic/story'
import StoryViewer from '@agents/game-level/ui/StoryViewer'

export default async function LearnPage({ params }: { params: { level: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const levelNumber = parseInt(params.level, 10)
  if (isNaN(levelNumber)) redirect('/home')

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

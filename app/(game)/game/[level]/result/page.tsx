import { redirect } from 'next/navigation'
import { auth } from '@/core/auth/auth'
import { prisma } from '@/core/db/prisma'
import { getProgressForLevel } from '@agents/game-level/logic/progress'
import ResultScreen from '@agents/quiz/ui/ResultScreen'

export default async function ResultPage({ params }: { params: { level: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const levelNumber = parseInt(params.level, 10)
  if (isNaN(levelNumber)) redirect('/home')

  const level = await prisma.module.findUnique({
    where: { levelNumber },
    select: { id: true, title: true },
  })
  if (!level) redirect('/home')

  const progress = await getProgressForLevel(session.user.id, level.id)
  if (!progress || progress.status !== 'cleared') {
    redirect(`/game/${levelNumber}/quiz`)
  }

  const nextLevel = await prisma.module.findUnique({
    where: { levelNumber: levelNumber + 1 },
    select: { id: true },
  })

  return (
    <main className="min-h-screen p-8">
      <ResultScreen
        levelNumber={levelNumber}
        title={level.title}
        progress={{
          complianceScore: progress.complianceScore,
          gmvScore: progress.gmvScore,
          uxScore: progress.uxScore,
          clearedAt: null,
        }}
        hasNextLevel={!!nextLevel}
      />
    </main>
  )
}

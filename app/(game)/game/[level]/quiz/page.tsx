import { redirect } from 'next/navigation'
import { auth } from '@/core/auth/auth'
import { getQuizSetup } from '@agents/quiz/logic/quiz'
import { getProgressForLevel } from '@agents/game-level/logic/progress'
import QuizScreen from '@agents/quiz/ui/QuizScreen'

export default async function QuizPage({ params }: { params: { level: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const levelNumber = parseInt(params.level, 10)
  if (isNaN(levelNumber)) redirect('/home')

  const setup = await getQuizSetup(session.user.id, levelNumber)
  if (!setup) redirect('/home')

  const current = await getProgressForLevel(session.user.id, setup.levelId)
  const initialParams = {
    compliance: current?.complianceScore ?? 100,
    gmv: current?.gmvScore ?? 0,
    ux: current?.uxScore ?? 100,
  }

  return (
    <main className="min-h-screen p-8">
      <QuizScreen
        levelId={setup.levelId}
        levelNumber={setup.levelNumber}
        title={setup.title}
        questions={setup.questions}
        initialParams={initialParams}
      />
    </main>
  )
}

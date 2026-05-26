'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ParameterGauges from './ParameterGauges'

interface Choice {
  id: string
  choiceText: string
}

interface Question {
  id: string
  questionText: string
  type: string
  sortOrder: number
  choices: Choice[]
}

interface Params {
  compliance: number
  gmv: number
  ux: number
}

interface AnswerResponse {
  isCorrect: boolean
  feedbackText: string | null
  params: Params
  isGameOver: boolean
  isLevelCleared: boolean
  answeredCount: number
  totalCount: number
}

interface QuizScreenProps {
  levelId: string
  levelNumber: number
  title: string
  questions: Question[]
  initialParams: Params
}

type Phase = 'answering' | 'feedback' | 'done'

export default function QuizScreen({
  levelId,
  levelNumber,
  title,
  questions,
  initialParams,
}: QuizScreenProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [params, setParams] = useState<Params>(initialParams)
  const [prevParams, setPrevParams] = useState<Params | undefined>(undefined)
  const [phase, setPhase] = useState<Phase>('answering')
  const [lastResult, setLastResult] = useState<AnswerResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = questions.length
  const currentQuestion = questions[currentIndex]

  if (total === 0) {
    return (
      <div className="mx-auto max-w-2xl text-center py-20">
        <p className="mb-2 text-lg font-semibold">クイズは準備中です</p>
        <p className="mb-6 text-sm text-muted-foreground">
          このレベルのクイズコンテンツは現在準備中です。
        </p>
        <button
          onClick={() => router.push('/home')}
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          ホームへ戻る
        </button>
      </div>
    )
  }

  async function handleChoiceSelect(choiceId: string) {
    if (!currentQuestion || phase !== 'answering' || loading) return
    setError('')
    setLoading(true)

    const res = await fetch('/api/quiz/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: currentQuestion.id,
        chosenChoiceId: choiceId,
        levelId,
      }),
    })
    setLoading(false)

    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? '回答の送信に失敗しました')
      return
    }

    const result = (await res.json()) as AnswerResponse
    setPrevParams(params)
    setParams(result.params)
    setLastResult(result)
    setPhase('feedback')
  }

  function handleNext() {
    if (!lastResult) return

    if (lastResult.isGameOver) {
      router.push(`/game/game-over?level=${levelNumber}`)
      return
    }
    if (lastResult.isLevelCleared) {
      router.push(`/game/${levelNumber}/result`)
      return
    }

    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1)
      setPhase('answering')
      setPrevParams(undefined)
      setLastResult(null)
    } else {
      // 全問表示済みだがまだクリアされていない（問題数 < DBの問題数の場合は起きないが安全弁）
      router.push('/home')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Level {levelNumber} — {title}
          </p>
          <p className="text-sm text-muted-foreground">
            問題 {currentIndex + 1} / {total}
          </p>
        </div>
        {/* プログレス */}
        <div className="w-32 h-1.5 rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((currentIndex + (phase === 'feedback' ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* パラメータゲージ */}
      <ParameterGauges params={params} prev={phase === 'feedback' ? prevParams : undefined} />

      {/* 問題文 */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-base font-medium leading-relaxed">{currentQuestion?.questionText}</p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</div>
      )}

      {/* 選択肢 */}
      {phase === 'answering' && (
        <div className="space-y-3">
          {currentQuestion?.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleChoiceSelect(choice.id)}
              disabled={loading}
              className="w-full rounded-xl border bg-card px-5 py-4 text-left text-sm hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
            >
              {choice.choiceText}
            </button>
          ))}
          {loading && (
            <p className="text-center text-sm text-muted-foreground">送信中…</p>
          )}
        </div>
      )}

      {/* フィードバック */}
      {phase === 'feedback' && lastResult && (
        <FeedbackPanel result={lastResult} onNext={handleNext} />
      )}
    </div>
  )
}

function FeedbackPanel({
  result,
  onNext,
}: {
  result: AnswerResponse
  onNext: () => void
}) {
  const { isCorrect, feedbackText, isGameOver, isLevelCleared, answeredCount, totalCount } = result

  return (
    <div
      className={`rounded-xl border p-5 ${
        isGameOver
          ? 'border-red-300 bg-red-50'
          : isCorrect
            ? 'border-green-300 bg-green-50'
            : 'border-yellow-300 bg-yellow-50'
      }`}
    >
      <p
        className={`mb-2 font-bold ${
          isGameOver ? 'text-red-700' : isCorrect ? 'text-green-700' : 'text-yellow-700'
        }`}
      >
        {isGameOver
          ? 'コンプライアンス違反 — ゲームオーバー'
          : isCorrect
            ? '正解！'
            : '不正解'}
      </p>
      {feedbackText && (
        <p className="mb-3 text-sm leading-relaxed">{feedbackText}</p>
      )}
      <p className="mb-4 text-xs text-muted-foreground">
        回答済み: {answeredCount} / {totalCount}
      </p>
      <button
        onClick={onNext}
        className={`w-full rounded-md px-4 py-2 text-sm font-medium text-white ${
          isGameOver
            ? 'bg-red-600 hover:bg-red-700'
            : isLevelCleared
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {isGameOver
          ? 'ゲームオーバー画面へ'
          : isLevelCleared
            ? 'レベルクリア！結果を見る'
            : '次の問題へ →'}
      </button>
    </div>
  )
}

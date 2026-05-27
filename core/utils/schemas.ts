import { z } from 'zod'

// 認証スキーマ
export const registerSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[a-zA-Z]/, '英字を含めてください')
    .regex(/[0-9]/, '数字を含めてください'),
})

export const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

// クイズ回答スキーマ
export const quizAnswerSchema = z.object({
  questionId: z.string().min(1),
  chosenChoiceId: z.string().min(1),
  levelId: z.string().min(1),
})

// 辞書検索スキーマ
export const dictionarySearchSchema = z.object({
  search: z.string().max(100).optional(),
})

// 進行度保存スキーマ
export const saveProgressSchema = z.object({
  levelId: z.string().min(1),
  status: z.enum(['in_progress', 'cleared', 'game_over']),
  complianceScore: z.number().int().min(0).max(100),
  gmvScore: z.number().int().min(0),
  uxScore: z.number().int().min(0).max(100),
})

// 型エクスポート
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type QuizAnswerInput = z.infer<typeof quizAnswerSchema>
export type SaveProgressInput = z.infer<typeof saveProgressSchema>

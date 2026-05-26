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
  questionId: z.string().cuid(),
  chosenChoiceId: z.string().cuid(),
  levelId: z.string().cuid(),
})

// 辞書検索スキーマ
export const dictionarySearchSchema = z.object({
  search: z.string().max(100).optional(),
})

// 型エクスポート
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type QuizAnswerInput = z.infer<typeof quizAnswerSchema>

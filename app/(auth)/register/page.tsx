import RegisterForm from '@agents/auth/ui/RegisterForm'

export const metadata = { title: '新規登録 | BPSP BizDev育成ゲーム' }

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">新規登録</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          アカウントを作成してゲームを始めましょう
        </p>
        <RegisterForm />
      </div>
    </main>
  )
}

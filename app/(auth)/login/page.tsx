import LoginForm from '@agents/auth/ui/LoginForm'

export const metadata = { title: 'ログイン | BPSP BizDev育成ゲーム' }

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">ログイン</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          BPSP BizDev育成ゲームへようこそ
        </p>
        <LoginForm />
      </div>
    </main>
  )
}

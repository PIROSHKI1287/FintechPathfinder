import { auth } from '@/core/auth/auth'
import GlobalNav from '@agents/_shell/ui/GlobalNav'

export default async function GameLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <>
      <GlobalNav userName={session?.user?.name ?? session?.user?.email ?? null} />
      {children}
    </>
  )
}

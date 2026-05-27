import { redirect } from 'next/navigation'
import { auth } from '@/core/auth/auth'

export default async function Page() {
  const session = await auth()
  if (session) {
    redirect('/home')
  } else {
    redirect('/login')
  }
}

import { redirect } from 'next/navigation'

export default function StoryPage({ params }: { params: { level: string } }) {
  redirect(`/game/${params.level}/learn`)
}

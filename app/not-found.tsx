import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-bold">ページが見つかりません</h2>
      <p className="text-sm text-muted-foreground">お探しのページは存在しないか、移動した可能性があります。</p>
      <Link
        href="/home"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        ホームへ戻る
      </Link>
    </div>
  )
}

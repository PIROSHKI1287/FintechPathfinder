'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ja">
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px', padding: '32px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>予期しないエラーが発生しました</h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{error.message}</p>
          <button
            onClick={reset}
            style={{ padding: '8px 16px', borderRadius: '6px', background: '#111827', color: 'white', fontSize: '0.875rem', cursor: 'pointer', border: 'none' }}
          >
            再試行
          </button>
        </div>
      </body>
    </html>
  )
}

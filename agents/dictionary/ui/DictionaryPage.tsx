'use client'

import { useEffect, useState, useCallback } from 'react'

interface Term {
  id: string
  term: string
  reading: string | null
  definition: string
  relatedLevelId: string | null
}

export default function DictionaryPage() {
  const [terms, setTerms] = useState<Term[]>([])
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Term | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTerms = useCallback((q: string) => {
    setLoading(true)
    const url = q.trim() ? `/api/dictionary?search=${encodeURIComponent(q)}` : '/api/dictionary'
    fetch(url)
      .then((r) => r.json())
      .then((data: { terms: Term[] }) => setTerms(data.terms))
      .catch(() => setError('用語の取得に失敗しました'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchTerms('')
  }, [fetchTerms])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setQuery(search)
    fetchTerms(search)
  }

  return (
    <div className="flex h-full gap-6">
      {/* 左パネル: 一覧 */}
      <div className="w-full max-w-sm shrink-0">
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="用語を検索…"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            検索
          </button>
        </form>

        {error && (
          <p className="mb-3 text-sm text-destructive">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">読み込み中…</p>
        ) : (
          <>
            {query && (
              <p className="mb-2 text-xs text-muted-foreground">
                「{query}」の検索結果: {terms.length}件
              </p>
            )}
            <ul className="space-y-1">
              {terms.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setSelected(t)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                      selected?.id === t.id ? 'bg-muted font-medium' : ''
                    }`}
                  >
                    <span className="font-medium">{t.term}</span>
                    {t.reading && (
                      <span className="ml-1 text-xs text-muted-foreground">（{t.reading}）</span>
                    )}
                  </button>
                </li>
              ))}
              {terms.length === 0 && (
                <li className="py-4 text-center text-sm text-muted-foreground">
                  {query ? '該当する用語が見つかりませんでした' : '用語はまだ登録されていません'}
                </li>
              )}
            </ul>
          </>
        )}
      </div>

      {/* 右パネル: 詳細 */}
      <div className="flex-1">
        {selected ? (
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-1 flex items-baseline gap-2">
              <h2 className="text-xl font-bold">{selected.term}</h2>
              {selected.reading && (
                <span className="text-sm text-muted-foreground">（{selected.reading}）</span>
              )}
            </div>
            {selected.relatedLevelId && (
              <p className="mb-3 text-xs text-muted-foreground">関連レベルあり</p>
            )}
            <p className="leading-relaxed text-sm whitespace-pre-wrap">{selected.definition}</p>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-xl border bg-muted/20 text-sm text-muted-foreground">
            左の一覧から用語を選択してください
          </div>
        )}
      </div>
    </div>
  )
}

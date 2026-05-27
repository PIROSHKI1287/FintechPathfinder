'use client'

import { useState, useEffect } from 'react'

interface LevelOption {
  id: string
  levelNumber: number
  title: string
}

interface DictionaryTerm {
  id: string
  term: string
  reading: string | null
  definition: string
  relatedLevelId: string | null
  relatedLevel: { levelNumber: number; title: string } | null
}

interface TermFormState {
  term: string
  reading: string
  definition: string
  relatedLevelId: string
}

const emptyForm: TermFormState = { term: '', reading: '', definition: '', relatedLevelId: '' }

function TermForm({
  initial,
  levels,
  onSave,
  onCancel,
}: {
  initial: TermFormState
  levels: LevelOption[]
  onSave: (data: TermFormState) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!form.term.trim() || !form.definition.trim()) {
      setError('用語と定義は必須です')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave(form)
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失敗')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium">用語 *</label>
          <input
            value={form.term}
            onChange={(e) => setForm((f) => ({ ...f, term: e.target.value }))}
            className="mt-1 block w-full rounded border px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium">読み（ふりがな）</label>
          <input
            value={form.reading}
            onChange={(e) => setForm((f) => ({ ...f, reading: e.target.value }))}
            className="mt-1 block w-full rounded border px-2 py-1 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium">定義 *</label>
        <textarea
          value={form.definition}
          onChange={(e) => setForm((f) => ({ ...f, definition: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded border px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-medium">関連レベル</label>
        <select
          value={form.relatedLevelId}
          onChange={(e) => setForm((f) => ({ ...f, relatedLevelId: e.target.value }))}
          className="mt-1 block rounded border px-2 py-1 text-sm"
        >
          <option value="">なし</option>
          {levels.map((l) => (
            <option key={l.id} value={l.id}>
              Level {l.levelNumber} — {l.title}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={saving}
          className="rounded bg-primary px-4 py-1.5 text-xs text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {saving ? '保存中…' : '保存'}
        </button>
        <button
          onClick={onCancel}
          className="rounded border px-4 py-1.5 text-xs hover:bg-muted"
        >
          キャンセル
        </button>
      </div>
    </div>
  )
}

export default function DictionaryTab() {
  const [terms, setTerms] = useState<DictionaryTerm[]>([])
  const [levels, setLevels] = useState<LevelOption[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const [tRes, lRes] = await Promise.all([
      fetch('/api/admin/dictionary'),
      fetch('/api/admin/levels'),
    ])
    if (!tRes.ok || !lRes.ok) {
      setLoading(false)
      return
    }
    const [tData, lData] = await Promise.all([tRes.json(), lRes.json()])
    setTerms(tData.terms ?? [])
    setLevels(lData.levels ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const createTerm = async (form: TermFormState) => {
    const r = await fetch('/api/admin/dictionary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        term: form.term,
        reading: form.reading || null,
        definition: form.definition,
        relatedLevelId: form.relatedLevelId || null,
      }),
    })
    if (!r.ok) throw new Error(await r.text())
    setAdding(false)
    await load()
  }

  const updateTerm = async (id: string, form: TermFormState) => {
    const r = await fetch(`/api/admin/dictionary/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        term: form.term,
        reading: form.reading || null,
        definition: form.definition,
        relatedLevelId: form.relatedLevelId || null,
      }),
    })
    if (!r.ok) throw new Error(await r.text())
    setEditingId(null)
    await load()
  }

  const deleteTerm = async (id: string, term: string) => {
    if (!confirm(`「${term}」を削除しますか？`)) return
    const r = await fetch(`/api/admin/dictionary/${id}`, { method: 'DELETE' })
    if (!r.ok) {
      alert('削除に失敗しました')
      return
    }
    await load()
  }

  if (loading) {
    return <p className="py-8 text-center text-muted-foreground">読み込み中…</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{terms.length} 件</p>
        {!adding && !editingId && (
          <button
            onClick={() => setAdding(true)}
            className="rounded bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:opacity-90"
          >
            + 用語追加
          </button>
        )}
      </div>

      {adding && (
        <TermForm
          initial={emptyForm}
          levels={levels}
          onSave={createTerm}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="space-y-2">
        {terms.map((t) =>
          editingId === t.id ? (
            <TermForm
              key={t.id}
              initial={{
                term: t.term,
                reading: t.reading ?? '',
                definition: t.definition,
                relatedLevelId: t.relatedLevelId ?? '',
              }}
              levels={levels}
              onSave={(form) => updateTerm(t.id, form)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div key={t.id} className="rounded-xl border bg-card px-4 py-3 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm">
                    {t.term}
                    {t.reading && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">（{t.reading}）</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{t.definition}</p>
                  {t.relatedLevel && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      関連: Level {t.relatedLevel.levelNumber} — {t.relatedLevel.title}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-3">
                  <button
                    onClick={() => { setEditingId(t.id); setAdding(false) }}
                    className="text-xs text-primary hover:underline"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => deleteTerm(t.id, t.term)}
                    className="text-xs text-destructive hover:underline"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ),
        )}
        {terms.length === 0 && !adding && (
          <p className="py-8 text-center text-muted-foreground">用語なし</p>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'

interface LevelSummary {
  id: string
  levelNumber: number
  title: string
  description: string
  isPublished: boolean
  _count: { storyPages: number; quizQuestions: number }
}

interface StoryPage {
  id: string
  pageNumber: number
  contentJson: unknown
  diagramUrl: string | null
}

interface QuizChoice {
  id: string
  choiceText: string
  isCorrect: boolean
  complianceDelta: number
  gmvDelta: number
  uxDelta: number
  feedbackText: string | null
}

interface QuizQuestion {
  id: string
  questionText: string
  type: string
  sortOrder: number
  choices: QuizChoice[]
}

function pageContent(json: unknown): { heading: string; body: string } {
  if (json !== null && typeof json === 'object' && !Array.isArray(json)) {
    const obj = json as Record<string, unknown>
    return {
      heading: typeof obj.heading === 'string' ? obj.heading : '',
      body: typeof obj.body === 'string' ? obj.body : '',
    }
  }
  return { heading: '', body: '' }
}

// ── Story Pages Section ────────────────────────────────────────────────────

function StoryPagesSection({ levelId }: { levelId: string }) {
  const [pages, setPages] = useState<StoryPage[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [addingNew, setAddingNew] = useState(false)
  const [form, setForm] = useState({ heading: '', body: '', diagramUrl: '', pageNumber: 1 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setLoadError('')
    const r = await fetch(`/api/admin/levels/${levelId}/pages`)
    if (!r.ok) {
      setLoadError('ページの取得に失敗しました')
      setLoading(false)
      return
    }
    const data = await r.json()
    setPages(data.pages ?? [])
    setLoading(false)
  }

  if (pages === null && !loading) {
    return (
      <button onClick={load} className="text-sm text-primary hover:underline">
        座学ページを読み込む
      </button>
    )
  }

  const openEdit = (p: StoryPage) => {
    const c = pageContent(p.contentJson)
    setForm({ heading: c.heading, body: c.body, diagramUrl: p.diagramUrl ?? '', pageNumber: p.pageNumber })
    setEditingId(p.id)
    setAddingNew(false)
  }

  const openNew = (currentPages: StoryPage[]) => {
    const nextNum = currentPages.length > 0 ? Math.max(...currentPages.map((p) => p.pageNumber)) + 1 : 1
    setForm({ heading: '', body: '', diagramUrl: '', pageNumber: nextNum })
    setAddingNew(true)
    setEditingId(null)
  }

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      if (addingNew) {
        const r = await fetch(`/api/admin/levels/${levelId}/pages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageNumber: form.pageNumber,
            heading: form.heading,
            body: form.body,
            diagramUrl: form.diagramUrl || null,
          }),
        })
        if (!r.ok) throw new Error(await r.text())
      } else if (editingId) {
        const r = await fetch(`/api/admin/levels/${levelId}/pages/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            heading: form.heading,
            body: form.body,
            diagramUrl: form.diagramUrl || null,
          }),
        })
        if (!r.ok) throw new Error(await r.text())
      }
      setEditingId(null)
      setAddingNew(false)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失敗')
    } finally {
      setSaving(false)
    }
  }

  const deletePage = async (pageId: string) => {
    if (!confirm('このページを削除しますか？')) return
    const r = await fetch(`/api/admin/levels/${levelId}/pages/${pageId}`, { method: 'DELETE' })
    if (!r.ok) {
      alert('削除に失敗しました')
      return
    }
    await load()
  }

  const isEditing = editingId !== null || addingNew

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-muted-foreground">座学ページ</h4>
        {!isEditing && (
          <button
            onClick={() => openNew(pages ?? [])}
            className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground hover:opacity-90"
          >
            + ページ追加
          </button>
        )}
      </div>

      {loading && <p className="text-xs text-muted-foreground">読み込み中…</p>}
      {loadError && <p className="text-xs text-destructive">{loadError}</p>}

      {isEditing && (
        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <div className="flex gap-4">
            <div>
              <label className="text-xs font-medium">ページ番号</label>
              <input
                type="number"
                value={form.pageNumber}
                onChange={(e) => setForm((f) => ({ ...f, pageNumber: parseInt(e.target.value) || 1 }))}
                disabled={!addingNew}
                className="mt-1 block w-20 rounded border px-2 py-1 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium">見出し</label>
            <input
              type="text"
              value={form.heading}
              onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
              className="mt-1 block w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium">本文</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={6}
              className="mt-1 block w-full rounded border px-2 py-1 text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-medium">図解URL（任意）</label>
            <input
              type="text"
              value={form.diagramUrl}
              onChange={(e) => setForm((f) => ({ ...f, diagramUrl: e.target.value }))}
              className="mt-1 block w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="rounded bg-primary px-4 py-1.5 text-xs text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {saving ? '保存中…' : '保存'}
            </button>
            <button
              onClick={() => { setEditingId(null); setAddingNew(false) }}
              className="rounded border px-4 py-1.5 text-xs hover:bg-muted"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {(pages ?? []).map((p) => {
          const c = pageContent(p.contentJson)
          return (
            <div key={p.id} className="flex items-start justify-between rounded border bg-card px-3 py-2">
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  p.{p.pageNumber} — {c.heading || '（見出しなし）'}
                </p>
                <p className="truncate text-xs text-muted-foreground">{c.body.slice(0, 60)}{c.body.length > 60 ? '…' : ''}</p>
              </div>
              <div className="ml-4 flex shrink-0 gap-2">
                <button onClick={() => openEdit(p)} className="text-xs text-primary hover:underline">編集</button>
                <button onClick={() => deletePage(p.id)} className="text-xs text-destructive hover:underline">削除</button>
              </div>
            </div>
          )
        })}
        {pages?.length === 0 && (
          <p className="text-xs text-muted-foreground">ページなし</p>
        )}
      </div>
    </div>
  )
}

// ── Quiz Questions Section ─────────────────────────────────────────────────

function QuizSection({ levelId }: { levelId: string }) {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setLoadError('')
    const r = await fetch(`/api/admin/levels/${levelId}/questions`)
    if (!r.ok) {
      setLoadError('クイズの取得に失敗しました')
      setLoading(false)
      return
    }
    const data = await r.json()
    setQuestions(data.questions ?? [])
    setLoading(false)
  }

  if (questions === null && !loading) {
    return (
      <button onClick={load} className="text-sm text-primary hover:underline">
        クイズを読み込む
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-muted-foreground">クイズ問題</h4>
        <AddQuestionForm levelId={levelId} onSaved={load} />
      </div>
      {loading && <p className="text-xs text-muted-foreground">読み込み中…</p>}
      {loadError && <p className="text-xs text-destructive">{loadError}</p>}
      <div className="space-y-2">
        {(questions ?? []).map((q) => (
          <QuestionRow
            key={q.id}
            question={q}
            expanded={expandedId === q.id}
            onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
            onDeleted={load}
            onUpdated={load}
          />
        ))}
        {questions?.length === 0 && <p className="text-xs text-muted-foreground">問題なし</p>}
      </div>
    </div>
  )
}

function AddQuestionForm({ levelId, onSaved }: { levelId: string; onSaved: () => void }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
    if (!text.trim()) return
    setSaving(true)
    setError('')
    try {
      const r = await fetch(`/api/admin/levels/${levelId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionText: text, type: 'single_choice', sortOrder: 0 }),
      })
      if (!r.ok) throw new Error(await r.text())
      setText('')
      setOpen(false)
      onSaved()
    } catch (e) {
      setError(e instanceof Error ? e.message : '追加失敗')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground hover:opacity-90"
      >
        + 問題追加
      </button>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="問題文"
          className="flex-1 rounded border px-2 py-1 text-sm"
        />
        <button
          onClick={save}
          disabled={saving}
          className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          追加
        </button>
        <button onClick={() => { setOpen(false); setError('') }} className="text-xs hover:underline">閉じる</button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function QuestionRow({
  question,
  expanded,
  onToggle,
  onDeleted,
  onUpdated,
}: {
  question: QuizQuestion
  expanded: boolean
  onToggle: () => void
  onDeleted: () => void
  onUpdated: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(question.questionText)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const saveQuestion = async () => {
    setSaving(true)
    setError('')
    try {
      const r = await fetch(`/api/admin/questions/${question.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionText: text }),
      })
      if (!r.ok) throw new Error(await r.text())
      setEditing(false)
      onUpdated()
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失敗')
    } finally {
      setSaving(false)
    }
  }

  const deleteQuestion = async () => {
    if (!confirm('この問題と関連する選択肢・回答履歴を全て削除しますか？')) return
    const r = await fetch(`/api/admin/questions/${question.id}`, { method: 'DELETE' })
    if (!r.ok) {
      alert('削除に失敗しました')
      return
    }
    onDeleted()
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-start justify-between px-3 py-2">
        {editing ? (
          <div className="flex-1 space-y-1">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 rounded border px-2 py-1 text-sm"
              />
              <button
                onClick={saveQuestion}
                disabled={saving}
                className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground disabled:opacity-50"
              >
                保存
              </button>
              <button onClick={() => { setEditing(false); setError('') }} className="text-xs hover:underline">閉じる</button>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        ) : (
          <p className="flex-1 text-sm">{question.questionText}</p>
        )}
        <div className="ml-4 flex shrink-0 gap-2">
          {!editing && <button onClick={() => setEditing(true)} className="text-xs text-primary hover:underline">編集</button>}
          <button onClick={onToggle} className="text-xs text-muted-foreground hover:underline">
            選択肢({question.choices.length}) {expanded ? '▲' : '▼'}
          </button>
          <button onClick={deleteQuestion} className="text-xs text-destructive hover:underline">削除</button>
        </div>
      </div>
      {expanded && (
        <ChoicesSection questionId={question.id} choices={question.choices} onChanged={onUpdated} />
      )}
    </div>
  )
}

function ChoicesSection({
  questionId,
  choices,
  onChanged,
}: {
  questionId: string
  choices: QuizChoice[]
  onChanged: () => void
}) {
  const [adding, setAdding] = useState(false)
  const [newChoice, setNewChoice] = useState({
    choiceText: '',
    isCorrect: false,
    complianceDelta: 0,
    gmvDelta: 0,
    uxDelta: 0,
    feedbackText: '',
  })
  const [saving, setSaving] = useState(false)
  const [addError, setAddError] = useState('')

  const addChoice = async () => {
    if (!newChoice.choiceText.trim()) return
    setSaving(true)
    setAddError('')
    try {
      const r = await fetch(`/api/admin/questions/${questionId}/choices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newChoice, feedbackText: newChoice.feedbackText || null }),
      })
      if (!r.ok) throw new Error(await r.text())
      setNewChoice({ choiceText: '', isCorrect: false, complianceDelta: 0, gmvDelta: 0, uxDelta: 0, feedbackText: '' })
      setAdding(false)
      onChanged()
    } catch (e) {
      setAddError(e instanceof Error ? e.message : '追加失敗')
    } finally {
      setSaving(false)
    }
  }

  const deleteChoice = async (id: string) => {
    if (!confirm('この選択肢を削除しますか？')) return
    const r = await fetch(`/api/admin/questions/${questionId}/choices/${id}`, { method: 'DELETE' })
    if (!r.ok) {
      alert('削除に失敗しました')
      return
    }
    onChanged()
  }

  return (
    <div className="border-t px-3 py-3 space-y-2 bg-muted/20">
      {choices.map((c) => (
        <ChoiceRow key={c.id} choice={c} questionId={questionId} onChanged={onChanged} onDeleted={() => deleteChoice(c.id)} />
      ))}
      {choices.length === 0 && <p className="text-xs text-muted-foreground">選択肢なし</p>}

      {adding ? (
        <div className="rounded border bg-card p-3 space-y-2">
          <input
            placeholder="選択肢テキスト"
            value={newChoice.choiceText}
            onChange={(e) => setNewChoice((f) => ({ ...f, choiceText: e.target.value }))}
            className="block w-full rounded border px-2 py-1 text-sm"
          />
          <div className="flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={newChoice.isCorrect}
                onChange={(e) => setNewChoice((f) => ({ ...f, isCorrect: e.target.checked }))}
              />
              正解
            </label>
            {(['complianceDelta', 'gmvDelta', 'uxDelta'] as const).map((k) => (
              <label key={k} className="flex items-center gap-1">
                {k.replace('Delta', '')}:
                <input
                  type="number"
                  value={newChoice[k]}
                  onChange={(e) => setNewChoice((f) => ({ ...f, [k]: parseInt(e.target.value) || 0 }))}
                  className="w-16 rounded border px-1 py-0.5"
                />
              </label>
            ))}
          </div>
          <input
            placeholder="フィードバック（任意）"
            value={newChoice.feedbackText}
            onChange={(e) => setNewChoice((f) => ({ ...f, feedbackText: e.target.value }))}
            className="block w-full rounded border px-2 py-1 text-sm"
          />
          {addError && <p className="text-xs text-destructive">{addError}</p>}
          <div className="flex gap-2">
            <button
              onClick={addChoice}
              disabled={saving}
              className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground disabled:opacity-50"
            >
              追加
            </button>
            <button onClick={() => { setAdding(false); setAddError('') }} className="text-xs hover:underline">閉じる</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="text-xs text-primary hover:underline"
        >
          + 選択肢追加
        </button>
      )}
    </div>
  )
}

function ChoiceRow({
  choice,
  questionId,
  onChanged,
  onDeleted,
}: {
  choice: QuizChoice
  questionId: string
  onChanged: () => void
  onDeleted: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    choiceText: choice.choiceText,
    isCorrect: choice.isCorrect,
    complianceDelta: choice.complianceDelta,
    gmvDelta: choice.gmvDelta,
    uxDelta: choice.uxDelta,
    feedbackText: choice.feedbackText ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const save = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const r = await fetch(`/api/admin/questions/${questionId}/choices/${choice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, feedbackText: form.feedbackText || null }),
      })
      if (!r.ok) throw new Error(await r.text())
      setEditing(false)
      onChanged()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : '保存失敗')
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="flex items-center justify-between rounded border bg-card px-2 py-1">
        <div className="min-w-0 flex items-center gap-2">
          <span className={`shrink-0 text-xs ${choice.isCorrect ? 'text-green-600 font-bold' : 'text-muted-foreground'}`}>
            {choice.isCorrect ? '◎' : '○'}
          </span>
          <span className="text-sm">{choice.choiceText}</span>
          <span className="text-xs text-muted-foreground ml-2">
            C:{choice.complianceDelta} G:{choice.gmvDelta} U:{choice.uxDelta}
          </span>
        </div>
        <div className="flex gap-2 ml-2">
          <button onClick={() => setEditing(true)} className="text-xs text-primary hover:underline">編集</button>
          <button onClick={onDeleted} className="text-xs text-destructive hover:underline">削除</button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded border bg-card p-2 space-y-2">
      <input
        value={form.choiceText}
        onChange={(e) => setForm((f) => ({ ...f, choiceText: e.target.value }))}
        className="block w-full rounded border px-2 py-1 text-sm"
      />
      <div className="flex flex-wrap gap-4 text-xs">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={form.isCorrect}
            onChange={(e) => setForm((f) => ({ ...f, isCorrect: e.target.checked }))}
          />
          正解
        </label>
        {(['complianceDelta', 'gmvDelta', 'uxDelta'] as const).map((k) => (
          <label key={k} className="flex items-center gap-1">
            {k.replace('Delta', '')}:
            <input
              type="number"
              value={form[k]}
              onChange={(e) => setForm((f) => ({ ...f, [k]: parseInt(e.target.value) || 0 }))}
              className="w-16 rounded border px-1 py-0.5"
            />
          </label>
        ))}
      </div>
      <input
        placeholder="フィードバック（任意）"
        value={form.feedbackText}
        onChange={(e) => setForm((f) => ({ ...f, feedbackText: e.target.value }))}
        className="block w-full rounded border px-2 py-1 text-sm"
      />
      {saveError && <p className="text-xs text-destructive">{saveError}</p>}
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground disabled:opacity-50"
        >
          {saving ? '保存中…' : '保存'}
        </button>
        <button onClick={() => { setEditing(false); setSaveError('') }} className="text-xs hover:underline">閉じる</button>
      </div>
    </div>
  )
}

// ── Level Row ───────────────────────────────────────────────────────────────

function LevelRow({
  level,
  onPublishToggled,
}: {
  level: LevelSummary
  onPublishToggled: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [toggleError, setToggleError] = useState('')

  const togglePublish = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Level ${level.levelNumber} を${level.isPublished ? '非公開' : '公開'}に変更しますか？`)) return
    setToggling(true)
    setToggleError('')
    try {
      const r = await fetch(`/api/admin/levels/${level.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !level.isPublished }),
      })
      if (!r.ok) throw new Error(await r.text())
      onPublishToggled()
    } catch (e) {
      setToggleError(e instanceof Error ? e.message : '更新失敗')
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div
        className="flex cursor-pointer items-center gap-4 px-4 py-3 hover:bg-muted/30"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {level.levelNumber}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{level.title}</p>
          <p className="text-xs text-muted-foreground">
            座学 {level._count.storyPages}p / クイズ {level._count.quizQuestions}問
          </p>
          {toggleError && <p className="text-xs text-destructive">{toggleError}</p>}
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            level.isPublished ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
          }`}
        >
          {level.isPublished ? '公開中' : '非公開'}
        </span>
        <button
          onClick={togglePublish}
          disabled={toggling}
          className="shrink-0 rounded border px-3 py-1 text-xs hover:bg-muted disabled:opacity-50"
        >
          {toggling ? '…' : level.isPublished ? '非公開にする' : '公開する'}
        </button>
        <span className="text-muted-foreground">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="border-t bg-muted/10 px-4 py-4 space-y-6">
          <StoryPagesSection levelId={level.id} />
          <hr />
          <QuizSection levelId={level.id} />
        </div>
      )}
    </div>
  )
}

// ── Main Export ────────────────────────────────────────────────────────────

export default function LevelTab() {
  const [levels, setLevels] = useState<LevelSummary[]>([])
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  const load = async () => {
    setLoading(true)
    setLoadError('')
    const r = await fetch('/api/admin/levels')
    if (!r.ok) {
      setLoadError('レベルの取得に失敗しました')
      setLoading(false)
      return
    }
    const data = await r.json()
    setLevels(data.levels ?? [])
    setLoaded(true)
    setLoading(false)
  }

  if (!loaded) {
    return (
      <div>
        <button
          onClick={load}
          disabled={loading}
          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading ? '読み込み中…' : 'レベル一覧を読み込む'}
        </button>
        {loadError && <p className="mt-2 text-sm text-destructive">{loadError}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={load} className="text-xs text-muted-foreground hover:underline">
          更新
        </button>
      </div>
      {loadError && <p className="text-sm text-destructive">{loadError}</p>}
      {levels.map((level) => (
        <LevelRow key={level.id} level={level} onPublishToggled={load} />
      ))}
      {levels.length === 0 && (
        <p className="text-center text-muted-foreground py-8">レベルなし</p>
      )}
    </div>
  )
}

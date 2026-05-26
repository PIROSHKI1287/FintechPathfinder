'use client'

import { useState } from 'react'

interface DisclaimerModalProps {
  onConsented: () => void
}

export default function DisclaimerModal({ onConsented }: DisclaimerModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAgree() {
    setError('')
    setLoading(true)
    const res = await fetch('/api/consent', { method: 'POST' })
    setLoading(false)

    if (!res.ok) {
      setError('同意の記録に失敗しました。再度お試しください。')
      return
    }
    onConsented()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="mx-4 w-full max-w-lg rounded-xl bg-card p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-bold">免責事項</h2>

        <div className="mb-6 h-64 overflow-y-auto rounded-md border border-border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
          <p className="mb-3 font-semibold text-foreground">本ゲームのご利用にあたって</p>

          <p className="mb-2">
            本ゲーム「BPSP BizDev育成ゲーム」は、Business Payment Service
            Provider（BPSP）に関するドメイン知識およびBizDevスキルを学習することを目的とした教育用シミュレーションゲームです。
          </p>

          <p className="mb-2 font-medium text-foreground">【コンテンツに関する免責事項】</p>
          <p className="mb-2">
            本ゲームに含まれる情報は、教育目的での参考情報として提供されるものであり、法律的・会計的・その他専門的な助言を構成するものではありません。資金決済法・割賦販売法その他の法規制に関する最新・正確な情報については、必ず公的機関または専門家にご確認ください。
          </p>

          <p className="mb-2 font-medium text-foreground">【利用データに関して】</p>
          <p className="mb-2">
            本ゲームでは、学習進行状況・クイズ回答結果・ゲームパラメータを記録します。記録されたデータはゲーム機能の提供のみに使用し、第三者への提供は行いません。
          </p>

          <p className="mb-2 font-medium text-foreground">【免責】</p>
          <p>
            本ゲームのご利用により生じた一切の損害について、開発者は責任を負いません。ゲーム内のシナリオはフィクションであり、実在の企業・人物・事案とは関係ありません。
          </p>
        </div>

        {error && (
          <p className="mb-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={handleAgree}
            disabled={loading}
            className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? '処理中…' : '上記に同意してゲームを開始する'}
          </button>
        </div>
      </div>
    </div>
  )
}

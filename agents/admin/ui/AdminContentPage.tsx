'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const LevelTab = dynamic(() => import('./LevelTab'), { ssr: false })
const DictionaryTab = dynamic(() => import('./DictionaryTab'), { ssr: false })

type Tab = 'levels' | 'dictionary'

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<Tab>('levels')

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold">コンテンツ管理（管理者）</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          座学ページ・クイズ・辞書の追加・編集・公開設定を行います
        </p>
      </div>

      <div className="flex gap-1 rounded-lg border bg-muted p-1 w-fit">
        {(
          [
            { key: 'levels', label: 'レベル管理' },
            { key: 'dictionary', label: '辞書管理' },
          ] as { key: Tab; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'levels' && <LevelTab />}
        {activeTab === 'dictionary' && <DictionaryTab />}
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { Route } from 'next'

interface GlobalNavProps {
  userName?: string | null
}

interface RouteInfo {
  back: string | null
  crumbs: { label: string; href?: string }[]
}

function getRouteInfo(pathname: string): RouteInfo {
  // /game/[level]/learn|quiz|result
  const levelLearn = pathname.match(/^\/game\/(\d+)\/learn$/)
  const levelQuiz = pathname.match(/^\/game\/(\d+)\/quiz$/)
  const levelResult = pathname.match(/^\/game\/(\d+)\/result$/)

  if (levelLearn) {
    const n = levelLearn[1]
    return {
      back: '/home',
      crumbs: [
        { label: 'ホーム', href: '/home' },
        { label: `Level ${n}` },
        { label: '座学' },
      ],
    }
  }
  if (levelQuiz) {
    const n = levelQuiz[1]
    return {
      back: `/game/${n}/learn`,
      crumbs: [
        { label: 'ホーム', href: '/home' },
        { label: `Level ${n}` },
        { label: 'クイズ' },
      ],
    }
  }
  if (levelResult) {
    const n = levelResult[1]
    return {
      back: '/home',
      crumbs: [
        { label: 'ホーム', href: '/home' },
        { label: `Level ${n}` },
        { label: '結果' },
      ],
    }
  }
  if (pathname === '/game/game-over') {
    return {
      back: '/home',
      crumbs: [{ label: 'ホーム', href: '/home' }, { label: 'ゲームオーバー' }],
    }
  }
  if (pathname === '/dictionary') {
    return {
      back: '/home',
      crumbs: [{ label: 'ホーム', href: '/home' }, { label: '用語辞典' }],
    }
  }
  if (pathname === '/history') {
    return {
      back: '/home',
      crumbs: [{ label: 'ホーム', href: '/home' }, { label: '学習履歴' }],
    }
  }
  if (pathname === '/settings') {
    return {
      back: '/home',
      crumbs: [{ label: 'ホーム', href: '/home' }, { label: '設定' }],
    }
  }
  // /home or unknown
  return { back: null, crumbs: [{ label: 'ホーム' }] }
}

export default function GlobalNav({ userName }: GlobalNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { back, crumbs } = getRouteInfo(pathname)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* メインナビバー */}
      <div className="flex h-14 items-center gap-2 px-4">
        {/* 戻るボタン */}
        {back ? (
          <button
            onClick={() => router.push(back as Route)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="前の画面に戻る"
          >
            ←
          </button>
        ) : (
          <div className="w-7" />
        )}

        {/* アプリタイトル */}
        <Link
          href="/home"
          className="mr-auto text-sm font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          BPSP育成ゲーム
        </Link>

        {/* グローバルナビリンク */}
        <nav className="flex items-center gap-1 text-sm">
          <NavLink href="/home" current={pathname === '/home'}>
            ホーム
          </NavLink>
          <NavLink href="/dictionary" current={pathname === '/dictionary'}>
            辞書
          </NavLink>
          <NavLink href="/history" current={pathname === '/history'}>
            履歴
          </NavLink>
        </nav>

        {userName && (
          <span className="hidden text-xs text-muted-foreground sm:block">
            {userName}
          </span>
        )}
      </div>

      {/* パンくずバー（ホーム以外） */}
      {crumbs.length > 1 && (
        <div className="flex items-center gap-1 border-t px-4 py-1.5 text-xs text-muted-foreground">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <Link href={crumb.href as Route} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      )}
    </header>
  )
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string
  current: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href as Route}
      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
        current
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {children}
    </Link>
  )
}

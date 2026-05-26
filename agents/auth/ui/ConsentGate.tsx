'use client'

import { useState } from 'react'
import DisclaimerModal from './DisclaimerModal'

interface ConsentGateProps {
  hasConsent: boolean
  children: React.ReactNode
}

export default function ConsentGate({ hasConsent, children }: ConsentGateProps) {
  const [consented, setConsented] = useState(hasConsent)

  if (!consented) {
    return (
      <>
        {/* コンテンツは背後に描画するが操作不可 */}
        <div className="pointer-events-none select-none blur-sm">{children}</div>
        <DisclaimerModal onConsented={() => setConsented(true)} />
      </>
    )
  }

  return <>{children}</>
}

import type { ReactNode } from 'react'

export function PageContent({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-12 py-8 flex flex-col gap-8">
      {children}
    </div>
  )
}

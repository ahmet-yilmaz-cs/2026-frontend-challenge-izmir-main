import type { ReactNode } from 'react'

type SectionState = {
  isLoading: boolean
  isError: boolean
  count?: number
}

export function FormSection({
  title,
  state,
  children,
}: {
  title?: string
  state: SectionState
  children: ReactNode
}) {
  const showHeader = title !== undefined || state.count !== undefined

  return (
    <section>
      {showHeader && (
        <header className="flex items-center justify-between mb-3 px-1">
          {title ? (
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          ) : (
            <span />
          )}
          {state.count !== undefined && (
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
              {state.count} kayıt
            </span>
          )}
        </header>
      )}

      {state.isLoading && (
        <p className="text-gray-500 text-sm">Yükleniyor...</p>
      )}
      {state.isError && (
        <p className="text-red-600 text-sm">Veri çekilemedi.</p>
      )}

      {!state.isLoading && !state.isError && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">{children}</table>
        </div>
      )}
    </section>
  )
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase text-[11px] tracking-wider bg-gray-50 border-b border-gray-200">
      {children}
    </th>
  )
}

export function Td({
  children,
  mono = false,
}: {
  children: ReactNode
  mono?: boolean
}) {
  return (
    <td
      className={`px-4 py-3 border-b border-gray-100 align-top ${
        mono ? 'font-mono text-xs text-gray-500' : 'text-gray-700'
      }`}
    >
      {children}
    </td>
  )
}

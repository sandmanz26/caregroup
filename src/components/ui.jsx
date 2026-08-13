export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg border border-ink-200 bg-white p-4 ${className}`}>
      {children}
    </div>
  )
}

export function SectionTitle({ children, action }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">{children}</h2>
      {action}
    </div>
  )
}

const badgeColors = {
  brand: 'bg-brand-100 text-brand-700',
  good: 'bg-good-100 text-good-500',
  warn: 'bg-warn-100 text-ink-700',
  ink: 'bg-ink-200 text-ink-700',
}

export function Badge({ children, color = 'ink' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badgeColors[color] || badgeColors.ink}`}>
      {children}
    </span>
  )
}

export function Avatar({ initials, size = 'md' }) {
  const sizes = { sm: 'size-7 text-[10px]', md: 'size-9 text-xs', lg: 'size-12 text-sm' }
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-ink-200 font-semibold text-ink-700 ${sizes[size]}`}>
      {initials}
    </span>
  )
}

export function EmptyState({ title, body }) {
  return (
    <div className="rounded-lg border border-dashed border-ink-300 p-6 text-center">
      <p className="text-sm font-medium text-ink-600">{title}</p>
      {body && <p className="mt-1 text-sm text-ink-400">{body}</p>}
    </div>
  )
}

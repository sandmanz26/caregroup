export function Card({ children, className = '', ...rest }) {
  return (
    <div className={`rounded-lg border border-ink-200/80 bg-white p-4 shadow-sm ${className}`} {...rest}>
      {children}
    </div>
  )
}

export function SectionTitle({ children, action }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-2 text-[15px] font-bold tracking-tight text-ink-900">
        <span className="h-4 w-1 rounded-full bg-brand-500" aria-hidden />
        {children}
      </h2>
      {action}
    </div>
  )
}

const badgeColors = {
  brand: 'bg-brand-100 text-brand-700',
  good: 'bg-good-100 text-good-500',
  warn: 'bg-warn-100 text-[#8A5300]',
  ink: 'bg-ink-100 text-ink-600',
  coklat: 'bg-tier-coklat-100 text-tier-coklat',
  merah: 'bg-tier-merah-100 text-tier-merah',
  hijaumuda: 'bg-hijau-muda-100 text-hijau-muda',
  lead: 'bg-lead-100 text-lead-500',
  info: 'bg-info-100 text-info-500',
}

export function Badge({ children, color = 'ink' }) {
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${badgeColors[color] || badgeColors.ink}`}>
      {children}
    </span>
  )
}

// Avatar diwarnai dari lima warna logo, dipilih dari inisial supaya stabil.
const avatarTones = ['g-blue', 'g-green', 'g-orange', 'g-red', 'g-purple', 'g-teal']
const gradients = {
  'g-blue': 'var(--g-blue)',
  'g-green': 'var(--g-green)',
  'g-orange': 'var(--g-orange)',
  'g-red': 'var(--g-red)',
  'g-purple': 'var(--g-purple)',
  'g-teal': 'var(--g-teal)',
}

export function Avatar({ initials = '', size = 'md' }) {
  const sizes = { sm: 'size-8 text-[10px]', md: 'size-10 text-xs', lg: 'size-14 text-base' }
  const seed = [...initials].reduce((n, ch) => n + ch.charCodeAt(0), 0)
  const tone = avatarTones[seed % avatarTones.length]
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-[32%] font-bold text-white shadow-xs ${sizes[size]}`}
      style={{ backgroundImage: gradients[tone] }}
    >
      {initials}
    </span>
  )
}

// Kotak ikon bergradien — satu warna = satu fungsi (lihat design-system.html).
export function IconTile({ icon: Icon, tone = 'g-blue', size = 40, iconSize = 19, round = false }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center text-white shadow-xs ${round ? 'rounded-full' : 'rounded-[30%]'}`}
      style={{ width: size, height: size, backgroundImage: gradients[tone] || `var(--${tone})` }}
    >
      <Icon size={iconSize} />
    </span>
  )
}

export function EmptyState({ title, body }) {
  return (
    <div className="rounded-lg border border-dashed border-ink-300 bg-white/60 p-6 text-center">
      <p className="text-sm font-semibold text-ink-700">{title}</p>
      {body && <p className="mt-1 text-sm text-ink-400">{body}</p>}
    </div>
  )
}

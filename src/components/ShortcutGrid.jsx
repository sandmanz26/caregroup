import { Link } from 'react-router-dom'

// Deretan ikon bulat berlabel. Item punya `to` (pindah halaman) atau `onClick` (buka penjelasan lengkap).
export default function ShortcutGrid({ items, cols = 4 }) {
  const colClass = cols === 3 ? 'grid-cols-3' : cols === 5 ? 'grid-cols-5' : 'grid-cols-4'
  return (
    <div className={`grid ${colClass} gap-x-2 gap-y-4`}>
      {items.map(({ label, icon: Icon, to, onClick, badge }) => {
        const inner = (
          <>
            <span className="relative flex size-14 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition-colors group-hover:bg-brand-200">
              <Icon size={24} />
              {badge > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-brand-500 text-[11px] font-semibold text-white">
                  {badge}
                </span>
              )}
            </span>
            <span className="text-center text-xs font-medium leading-tight text-ink-700">{label}</span>
          </>
        )
        const cls = 'group flex flex-col items-center gap-1.5'
        return to ? (
          <Link key={label} to={to} className={cls}>{inner}</Link>
        ) : (
          <button key={label} type="button" onClick={onClick} className={cls}>{inner}</button>
        )
      })}
    </div>
  )
}

import { Link } from 'react-router-dom'

// Satu warna = satu fungsi tetap (selaras design-system v3.1).
const TONES = {
  'Temu Firman': 'g-green',
  'Care Group': 'g-blue',
  Presensi: 'g-orange',
  Pelayanan: 'g-red',
  Jadwal: 'g-teal',
  Doa: 'g-magenta',
  Profil: 'g-navy',
  'Panel Admin': 'g-purple',
  'Panel Pembinaan': 'g-purple',
  'Q&A': 'g-amber',
  Pengaturan: 'g-slate',
  'Tentang SDA': 'g-teal',
  'Info Umum': 'g-teal',
  'Jobdesk Peran': 'g-purple',
  Anggota: 'g-blue',
  Kehadiran: 'g-orange',
  Pertumbuhanku: 'g-green',
  Materi: 'g-magenta',
}
const CYCLE = ['g-blue', 'g-green', 'g-orange', 'g-red', 'g-purple', 'g-teal']

// Deretan ikon berlabel. Item punya `to` (pindah halaman) atau `onClick` (buka penjelasan lengkap).
export default function ShortcutGrid({ items, cols = 4 }) {
  const colClass = cols === 3 ? 'grid-cols-3' : cols === 5 ? 'grid-cols-5' : 'grid-cols-4'
  return (
    <div className={`grid ${colClass} gap-x-2 gap-y-5`}>
      {items.map(({ label, icon: Icon, to, onClick, badge }, i) => {
        const tone = TONES[label] || CYCLE[i % CYCLE.length]
        const inner = (
          <>
            <span
              className="relative flex size-14 items-center justify-center rounded-[30%] text-white shadow-md transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-95"
              style={{ backgroundImage: `var(--${tone})` }}
            >
              <Icon size={24} />
              {badge > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-warn-500 text-[11px] font-bold text-[#3A2400]">
                  {badge}
                </span>
              )}
            </span>
            <span className="text-center text-xs font-semibold leading-tight text-ink-700">{label}</span>
          </>
        )
        const cls = 'group flex flex-col items-center gap-2'
        return to ? (
          <Link key={label} to={to} className={cls}>{inner}</Link>
        ) : (
          <button key={label} type="button" onClick={onClick} className={cls}>{inner}</button>
        )
      })}
    </div>
  )
}

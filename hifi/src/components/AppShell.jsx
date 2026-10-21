import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Home, Users, BookOpenText, CalendarDays, HeartHandshake, HandHelping, CircleUser, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { roleLabels } from '../data/mockData'
import { Avatar } from './ui'

const BASE_NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/komsel', label: 'Program CG', short: 'CG', icon: Users },
  { to: '/temu-firman', label: 'Temu Firman', short: 'Firman', icon: BookOpenText },
  { to: '/presensi', label: 'Presensi', icon: HandHelping },
  { to: '/jadwal', label: 'Jadwal', icon: CalendarDays },
  { to: '/doa', label: 'Doa', icon: HeartHandshake },
  { to: '/profil', label: 'Profil', icon: CircleUser },
]

// Hidden from the jemaat/member nav for now — see PRD decision log.
const HIDDEN_FOR_MEMBER = ['/jadwal', '/doa']

// Doa is hidden from Ketua Komsel (Leader) too, per explicit request — Super Admin keeps it.
const HIDDEN_FOR_LEADER = ['/doa']

const ADMIN_NAV_ITEM = { to: '/admin', label: 'Admin', icon: ShieldCheck }

function NavIcon({ Icon, active }) {
  return <Icon size={21} strokeWidth={active ? 2.25 : 1.85} />
}

export default function AppShell() {
  const { user } = useApp()
  const location = useLocation()
  let navItems
  if (user.role === 'admin') {
    navItems = [...BASE_NAV_ITEMS.filter((item) => !HIDDEN_FOR_LEADER.includes(item.to)), ADMIN_NAV_ITEM]
  } else if (user.role === 'super_admin' || user.role === 'coach') {
    navItems = [...BASE_NAV_ITEMS, ADMIN_NAV_ITEM]
  } else {
    navItems = BASE_NAV_ITEMS.filter((item) => !HIDDEN_FOR_MEMBER.includes(item.to))
  }

  return (
    <div className="min-h-screen bg-ink-50 text-ink-800 md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden bg-white md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:border-r md:border-ink-200 md:px-4 md:py-6 md:shrink-0">
        <div className="relative mb-4 px-2 pb-5">
          <img src="/logo-shema.png" alt="Shema · GKI Gejayan" className="h-14 w-14 object-contain" />
          <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-full" style={{ background: 'var(--ribbon)' }} />
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-100/70 text-brand-600'
                    : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute -left-4 bottom-2.5 top-2.5 w-1 rounded-r-full bg-brand-500" />}
                  <NavIcon Icon={Icon} active={isActive} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <NavLink
          to="/profil"
          className="flex items-center gap-3 rounded-md border border-ink-200 bg-ink-50 px-3 py-2.5 transition-colors hover:bg-ink-100"
        >
          <Avatar initials={user.initials} size="sm" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-ink-900">{user.name}</span>
            <span className="block truncate text-xs text-ink-400">{roleLabels[user.role]}</span>
          </span>
        </NavLink>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-200 bg-white/90 px-4 py-2.5 backdrop-blur md:hidden">
        <img src="/logo-shema.png" alt="Shema · GKI Gejayan" className="h-10 w-10 object-contain" />
        <NavLink to="/profil" aria-label="Profil">
          <Avatar initials={user.initials} size="sm" />
        </NavLink>
      </header>

      {/* Main content */}
      <main className="min-w-0 flex-1 pb-24 md:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-9">
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-ink-200 bg-white/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        {navItems.map(({ to, label, short, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 pb-2 pt-2.5 text-[10.5px] font-semibold ${
                isActive ? 'text-brand-600' : 'text-ink-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex h-7 w-11 items-center justify-center rounded-full transition-colors ${isActive ? 'bg-brand-100' : ''}`}>
                  <NavIcon Icon={Icon} active={isActive} />
                </span>
                {short || label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

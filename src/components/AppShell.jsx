import { NavLink, Outlet } from 'react-router-dom'
import { Home, Users, CalendarDays, HeartHandshake, CircleUser, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { roleLabels } from '../data/mockData'

const BASE_NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/komsel', label: 'Komsel', icon: Users },
  { to: '/jadwal', label: 'Jadwal', icon: CalendarDays },
  { to: '/doa', label: 'Doa', icon: HeartHandshake },
  { to: '/profil', label: 'Profil', icon: CircleUser },
]

const ADMIN_NAV_ITEM = { to: '/admin', label: 'Admin', icon: ShieldCheck }

function NavIcon({ Icon, active }) {
  return <Icon size={22} strokeWidth={active ? 2.25 : 1.75} />
}

export default function AppShell() {
  const { user } = useApp()
  const isAdminRole = user.role === 'admin' || user.role === 'super_admin'
  const navItems = isAdminRole ? [...BASE_NAV_ITEMS, ADMIN_NAV_ITEM] : BASE_NAV_ITEMS

  return (
    <div className="min-h-screen bg-ink-50 text-ink-800 md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-60 md:flex-col md:border-r md:border-ink-200 md:px-4 md:py-6 md:shrink-0">
        <div className="px-2 pb-6">
          <p className="text-[11px] uppercase tracking-wide text-ink-400">Care Group</p>
          <p className="text-lg font-semibold text-ink-900 leading-tight">GKI Gejayan</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-100 text-brand-700'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <NavIcon Icon={Icon} active={isActive} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <NavLink
          to="/profil"
          className="flex items-center gap-3 rounded-md border border-ink-200 px-3 py-2.5 hover:bg-ink-100"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
            {user.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-ink-900">{user.name}</span>
            <span className="block truncate text-xs text-ink-400">{roleLabels[user.role]}</span>
          </span>
        </NavLink>
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-ink-200 bg-ink-50 px-4 py-3 md:hidden">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ink-400">Care Group</p>
          <p className="text-base font-semibold text-ink-900 leading-tight">GKI Gejayan</p>
        </div>
        <NavLink to="/profil" className="flex size-9 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
          {user.initials}
        </NavLink>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-ink-200 bg-ink-50/95 backdrop-blur md:hidden">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] ${
                isActive ? 'text-brand-600' : 'text-ink-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <NavIcon Icon={Icon} active={isActive} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

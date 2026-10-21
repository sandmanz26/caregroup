import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, BookOpenText, HandHelping, CircleUser, ShieldCheck, ChevronLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'

// Tab bar maksimal 5 menu (konvensi aplikasi mobile / React Navigation).
// Menu lain (Jadwal, Doa, Presensi untuk non-anggota, Pengaturan, Tentang) dibuka dari ikon di Home/Profil
// sebagai layar bertumpuk dengan tombol kembali — lihat prd.md Decision Log.
const TAB = {
  home: { to: '/', label: 'Home', icon: Home },
  cg: { to: '/komsel', label: 'Care Group', icon: Users },
  firman: { to: '/temu-firman', label: 'Firman', icon: BookOpenText },
  presensi: { to: '/presensi', label: 'Presensi', icon: HandHelping },
  admin: { to: '/admin', label: 'Admin', icon: ShieldCheck },
  profil: { to: '/profil', label: 'Profil', icon: CircleUser },
}

const STACK_TITLES = {
  '/pengaturan': 'Pengaturan',
  '/tentang': 'Tentang SDA',
  '/jadwal': 'Jadwal',
  '/doa': 'Pokok Doa',
  '/presensi': 'Presensi',
}

export default function AppShell() {
  const { user } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const isMember = user.role === 'jemaat'
  const tabs = isMember
    ? [TAB.home, TAB.cg, TAB.firman, TAB.presensi, TAB.profil]
    : [TAB.home, TAB.cg, TAB.firman, TAB.admin, TAB.profil]
  const isTab = tabs.some((t) => t.to === location.pathname)
  const stackTitle = !isTab ? STACK_TITLES[location.pathname] : null

  // Pindah layar → mulai dari atas, seperti aplikasi native.
  useEffect(() => {
    document.getElementById('app-scroll')?.scrollTo(0, 0)
    window.scrollTo(0, 0)
  }, [location.pathname])

  function goBack() {
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }

  return (
    <div className="app-screen min-h-screen bg-ink-50 text-ink-800">
      {stackTitle && (
        <header className="nav-bar">
          <button type="button" onClick={goBack} className="nav-back" aria-label="Kembali">
            <ChevronLeft size={26} strokeWidth={2.4} />
            <span>Kembali</span>
          </button>
          <span className="nav-title">{stackTitle}</span>
          <span />
        </header>
      )}

      <main className={`screen-body ${stackTitle ? 'has-nav' : ''}`}>
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>

      <nav className="tab-bar">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `tab-item ${isActive ? 'is-active' : ''}`}>
            {({ isActive }) => (
              <>
                <span className="tab-icon">
                  <Icon size={23} strokeWidth={isActive ? 2.3 : 1.8} />
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

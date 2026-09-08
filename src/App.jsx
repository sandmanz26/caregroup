import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/AppShell'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Komsel from './pages/Komsel'
import PresensiPelayanan from './pages/PresensiPelayanan'
import ProgramBacaAlkitab from './pages/ProgramBacaAlkitab'
import Jadwal from './pages/Jadwal'
import Doa from './pages/Doa'
import Profil from './pages/Profil'
import Tentang from './pages/Tentang'
import Admin from './pages/Admin'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/komsel" element={<Komsel />} />
            <Route path="/baca-alkitab" element={<ProgramBacaAlkitab />} />
            <Route path="/presensi" element={<PresensiPelayanan />} />
            <Route path="/jadwal" element={<Jadwal />} />
            <Route path="/doa" element={<Doa />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/tentang" element={<Tentang />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Routes>
    </AppProvider>
  )
}

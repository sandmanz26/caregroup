import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/AppShell'
import Login from './pages/Login'
import Home from './pages/Home'
import Komsel from './pages/Komsel'
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
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/komsel" element={<Komsel />} />
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

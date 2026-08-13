import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import SuperAdminPanel from './admin/SuperAdminPanel'
import KetuaKomselPanel from './admin/KetuaKomselPanel'

export default function Admin() {
  const { user } = useApp()

  if (user.role === 'super_admin') return <SuperAdminPanel />
  if (user.role === 'admin') return <KetuaKomselPanel />
  return <Navigate to="/" replace />
}

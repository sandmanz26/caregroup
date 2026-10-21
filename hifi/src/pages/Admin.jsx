import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import SuperAdminPanel from './admin/SuperAdminPanel'
import KetuaKomselPanel from './admin/KetuaKomselPanel'
import CoachPanel from './admin/CoachPanel'

export default function Admin() {
  const { user } = useApp()

  if (user.role === 'super_admin') return <SuperAdminPanel />
  if (user.role === 'admin') return <KetuaKomselPanel />
  if (user.role === 'coach') return <CoachPanel />
  return <Navigate to="/" replace />
}

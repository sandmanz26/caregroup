import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Phone, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, SectionTitle } from '../components/ui'
import JourneyStepper from '../components/JourneyStepper'
import { roleLabels, journeyStages } from '../data/mockData'

export default function Profil() {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const stageLabel = journeyStages.find((s) => s.id === user.journeyStageId)?.label

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-500 text-lg font-semibold text-white">
          {user.initials}
        </span>
        <div>
          <h1 className="text-xl font-semibold text-ink-900">{user.name}</h1>
          <p className="text-sm text-ink-500">{roleLabels[user.role]}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-400">
            <Phone size={12} /> {user.phone}
          </p>
        </div>
      </div>

      {user.journeyStageId && (
        <Card>
          <SectionTitle>Perjalanan Pelayanan</SectionTitle>
          <JourneyStepper currentStageId={user.journeyStageId} />
          <p className="mt-3 text-sm text-ink-500">
            Tahap saat ini: <span className="font-medium text-ink-800">{stageLabel}</span>
          </p>
        </Card>
      )}

      <Link
        to="/tentang"
        className="flex items-center justify-between rounded-lg border border-ink-200 bg-white p-4 hover:bg-ink-100"
      >
        <div>
          <p className="text-sm font-medium text-ink-900">Tentang Tim SDA &amp; Care Group</p>
          <p className="text-xs text-ink-400">Peran pelayanan &amp; ajukan pelayananmu</p>
        </div>
        <ChevronRight size={18} className="text-ink-400" />
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center justify-between rounded-lg border border-ink-200 bg-white p-4 text-left hover:bg-ink-100"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-ink-200 text-ink-600">
            <LogOut size={16} />
          </span>
          <span className="text-sm font-medium text-ink-800">Keluar</span>
        </div>
      </button>

      <Card className="text-sm text-ink-400">
        <p>GKI Gejayan &middot; Tim Sumber Daya Aktifis (SDA)</p>
        <p className="mt-0.5">Care Group App &middot; v0.1 (prototype)</p>
      </Card>
    </div>
  )
}

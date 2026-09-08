import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Phone, LogOut, Camera, Check, HandHelping, Eye, EyeOff } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, SectionTitle } from '../components/ui'
import JourneyStepper from '../components/JourneyStepper'
import { roleLabels, journeyStages, growthMilestones } from '../data/mockData'
import { formatShortDate, formatBirthDate, TODAY } from '../utils/date'

function ProfilePhoto({ user }) {
  const [photoUrl, setPhotoUrl] = useState(null)
  const fileRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoUrl(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <button
      type="button"
      onClick={() => fileRef.current?.click()}
      className="group relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-500 text-lg font-semibold text-white"
    >
      {photoUrl ? (
        <img src={photoUrl} alt="" className="size-full object-cover" />
      ) : (
        user.initials
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <Camera size={18} className="text-white" />
      </span>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </button>
  )
}

function FullInfoPanel({ user, myCareGroup }) {
  const myMember = myCareGroup?.members.find((m) => m.id === user.memberId)
  const rows = [
    ['Nama Lengkap', user.name],
    ['Nomor WA', user.phone],
    ['Peran', roleLabels[user.role]],
    ['Care Group', myCareGroup?.name || '-'],
    ['Alamat', myMember?.address || '-'],
    ['Universitas', myMember?.university || '-'],
    ['Tanggal Lahir', myMember?.birthDate ? formatBirthDate(myMember.birthDate) : '-'],
  ]

  return (
    <Card>
      <SectionTitle>Informasi Lengkap</SectionTitle>
      <ul className="flex flex-col divide-y divide-ink-100 text-sm">
        {rows.map(([label, value]) => (
          <li key={label} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
            <span className="text-ink-500">{label}</span>
            <span className="text-right font-medium text-ink-900">{value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink-400">Ingin mengubah data di atas? Hubungi admin/Ketua Komsel.</p>
    </Card>
  )
}

function GrowthSection({ user, events }) {
  const { growthDates } = useApp()
  const myDates = growthDates[user.id] || {}

  return (
    <Card>
      <SectionTitle>Shema Growth</SectionTitle>
      <ul className="flex flex-col divide-y divide-ink-100">
        {growthMilestones.map((m) => {
          const date = myDates[m.id]
          const nextEvent = !date
            ? events.filter((e) => e.milestoneId === m.id && e.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date))[0]
            : null
          return (
            <li key={m.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <span className="flex items-center gap-2 text-sm text-ink-800">
                {date ? (
                  <span className="flex size-5 items-center justify-center rounded-full bg-good-100 text-good-500">
                    <Check size={12} />
                  </span>
                ) : (
                  <span className="size-5 shrink-0 rounded-full border border-dashed border-ink-300" />
                )}
                {m.label}
              </span>
              {date ? (
                <span className="text-xs text-ink-500">Selesai {formatShortDate(date)}</span>
              ) : nextEvent ? (
                <span className="text-xs text-ink-400">Berikutnya {formatShortDate(nextEvent.date)}</span>
              ) : (
                <span className="text-xs text-ink-300">Belum ada jadwal</span>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function OtherTrainingSection({ user }) {
  const { otherTrainings } = useApp()
  const mine = otherTrainings[user.id] || []

  if (mine.length === 0) return null

  return (
    <Card>
      <SectionTitle>Training Gerejawi Lainnya</SectionTitle>
      <ul className="flex flex-col divide-y divide-ink-100">
        {mine.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0">
            <p className="text-sm text-ink-800">{t.name}</p>
            {t.date && <p className="text-xs text-ink-400">{formatShortDate(t.date)}</p>}
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default function Profil() {
  const { user, logout, pelayananCheckins, myCareGroup, events } = useApp()
  const navigate = useNavigate()
  const [showFullInfo, setShowFullInfo] = useState(false)
  const stageLabel = journeyStages.find((s) => s.id === user.journeyStageId)?.label
  const myCheckinCount = pelayananCheckins.filter((c) => c.memberId === user.memberId).length

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <ProfilePhoto user={user} />
            <div>
              <h1 className="text-xl font-semibold text-ink-900">{user.name}</h1>
              <p className="text-sm text-ink-500">{roleLabels[user.role]}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-400">
                <Phone size={12} /> {user.phone}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowFullInfo((v) => !v)}
            aria-pressed={showFullInfo}
            aria-label="Lihat informasi lengkap"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-500 hover:bg-ink-100"
          >
            {showFullInfo ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="mt-2 text-xs text-ink-400">Foto pratinjau untuk sesi ini saja.</p>
      </div>

      {showFullInfo && <FullInfoPanel user={user} myCareGroup={myCareGroup} />}

      {user.journeyStageId && (
        <Card>
          <SectionTitle>Perjalanan Pelayanan</SectionTitle>
          <JourneyStepper currentStageId={user.journeyStageId} />
          <p className="mt-3 text-sm text-ink-500">
            Tahap saat ini: <span className="font-medium text-ink-800">{stageLabel}</span>
          </p>
        </Card>
      )}

      <GrowthSection user={user} events={events} />
      <OtherTrainingSection user={user} />

      <Link
        to="/presensi"
        className="flex items-center justify-between rounded-lg border border-ink-200 bg-white p-4 hover:bg-ink-100"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <HandHelping size={18} />
          </span>
          <div>
            <p className="text-sm font-medium text-ink-900">Presensi Pelayanan</p>
            <p className="text-xs text-ink-400">{myCheckinCount} kali tercatat &middot; diisi sendiri</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-ink-400" />
      </Link>

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
        <p className="mt-0.5">Shema App &middot; v0.1 (prototype)</p>
      </Card>
    </div>
  )
}

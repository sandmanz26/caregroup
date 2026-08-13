import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Lock, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, SectionTitle, Badge } from '../components/ui'
import { sdaRoles, pelayananRoles, journeyStages } from '../data/mockData'
import { formatShortDate } from '../utils/date'

const inputClass = 'w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400'

function ApplyForm() {
  const { user, submitServiceApplication, serviceApplications } = useApp()
  const [roleId, setRoleId] = useState('')
  const [reason, setReason] = useState('')
  const [availability, setAvailability] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const myApplications = serviceApplications.filter((a) => a.memberId === user.memberId)

  function handleSubmit(e) {
    e.preventDefault()
    const role = pelayananRoles.find((r) => r.id === roleId)
    if (!role || !reason.trim() || !availability.trim()) return
    submitServiceApplication({ roleId: role.id, roleName: role.name, reason, availability })
    setRoleId('')
    setReason('')
    setAvailability('')
    setSubmitted(true)
  }

  return (
    <>
      <Card>
        <SectionTitle>Ajukan Pelayanan</SectionTitle>
        <p className="mb-3 text-sm text-ink-500">Pilih pelayanan yang ingin kamu ambil, lalu ceritakan alasanmu.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {pelayananRoles.map((r) => (
              <label
                key={r.id}
                className="flex cursor-pointer items-start gap-3 rounded-md border border-ink-200 p-3 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
              >
                <input
                  type="radio"
                  name="pelayanan"
                  value={r.id}
                  checked={roleId === r.id}
                  onChange={() => {
                    setRoleId(r.id)
                    setSubmitted(false)
                  }}
                  className="mt-1"
                  required
                />
                <span>
                  <span className="block text-sm font-medium text-ink-900">{r.name}</span>
                  <span className="block text-xs text-ink-500">{r.desc}</span>
                </span>
              </label>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink-500">Alasan &amp; Motivasi</label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setSubmitted(false)
              }}
              required
              rows={3}
              placeholder="Mengapa kamu ingin mengambil pelayanan ini?"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink-500">Kesibukan Saat Ini</label>
            <textarea
              value={availability}
              onChange={(e) => {
                setAvailability(e.target.value)
                setSubmitted(false)
              }}
              required
              rows={2}
              placeholder="Ceritakan jadwal/kesibukanmu supaya Leader bisa menyesuaikan."
              className={inputClass}
            />
          </div>

          <div className="flex items-center justify-between">
            {submitted ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-good-500">
                <CheckCircle2 size={16} /> Pengajuan terkirim
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Kirim Pengajuan
            </button>
          </div>
        </form>
      </Card>

      {myApplications.length > 0 && (
        <Card>
          <SectionTitle>Riwayat Pengajuanmu</SectionTitle>
          <ul className="flex flex-col divide-y divide-ink-100">
            {myApplications.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-ink-900">{a.roleName}</p>
                  <p className="text-xs text-ink-400">{formatShortDate(a.date)}</p>
                </div>
                <Badge color={a.reviewed ? 'good' : 'ink'}>{a.reviewed ? 'Sudah ditinjau' : 'Menunggu'}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}

export default function Tentang() {
  const { user } = useApp()
  const stageIndex = journeyStages.findIndex((s) => s.id === user.journeyStageId)
  const memberIndex = journeyStages.findIndex((s) => s.id === 'active')
  const isMember = stageIndex >= memberIndex

  return (
    <div className="flex flex-col gap-6">
      <Link to="/profil" className="flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-800">
        <ChevronLeft size={16} /> Kembali
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Tim Sumber Daya Aktifis (SDA)</h1>
        <p className="mt-1 text-sm text-ink-500">
          Sistem pemberdayaan, penggembalaan &amp; peningkatan peran aktifis GKI Gejayan — "1 orang, 1 Care Group, 1 pelayanan."
        </p>
      </div>

      <Card>
        <SectionTitle>Peran Pelayanan</SectionTitle>
        <ul className="flex flex-col divide-y divide-ink-100">
          {sdaRoles.map((r) => (
            <li key={r.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2">
                <Badge color={r.color}>{r.name}</Badge>
              </div>
              <p className="text-sm text-ink-600">{r.desc}</p>
            </li>
          ))}
        </ul>
      </Card>

      {user.role === 'jemaat' && (isMember ? (
        <ApplyForm />
      ) : (
        <Card>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-ink-200 text-ink-600">
              <Lock size={18} />
            </span>
            <div>
              <p className="font-medium text-ink-900">Pelayanan Belum Terbuka</p>
              <p className="mt-1 text-sm text-ink-500">
                Selesaikan proses menjadi member Care Group dulu untuk bisa mengajukan pelayanan. Cek progresmu di halaman Home.
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

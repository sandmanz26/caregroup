import { useState } from 'react'
import { CheckCircle2, HandHelping } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, SectionTitle, Badge, EmptyState } from '../components/ui'
import { pelayananRoles } from '../data/mockData'
import { formatLongDate, TODAY } from '../utils/date'

const inputClass = 'w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400'

export default function PresensiPelayanan() {
  const { user, myCareGroup, pelayananCheckins, checkInPelayanan } = useApp()
  const [roleName, setRoleName] = useState('')
  const [date, setDate] = useState(TODAY)
  const [note, setNote] = useState('')
  const [justCheckedIn, setJustCheckedIn] = useState(false)

  const myCheckins = pelayananCheckins
    .filter((c) => c.memberId === user.memberId)
    .sort((a, b) => b.date.localeCompare(a.date))

  function handleSubmit(e) {
    e.preventDefault()
    if (!roleName || !date) return
    checkInPelayanan({ roleName, note, date })
    setRoleName('')
    setDate(TODAY)
    setNote('')
    setJustCheckedIn(true)
  }

  if (!myCareGroup) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Presensi Pelayanan</h1>
          <p className="mt-1 text-sm text-ink-500">Catat kehadiranmu saat bertugas melayani.</p>
        </div>
        <EmptyState
          title="Belum tergabung dengan Care Group"
          body="Presensi pelayanan bisa diisi setelah kamu tergabung dalam salah satu Care Group."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Presensi Pelayanan</h1>
        <p className="mt-1 text-sm text-ink-500">Tandai kehadiranmu setiap kali bertugas melayani.</p>
      </div>

      <Card>
        <SectionTitle>Hadir Melayani</SectionTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-500">Pelayanan</label>
            <select
              value={roleName}
              onChange={(e) => {
                setRoleName(e.target.value)
                setJustCheckedIn(false)
              }}
              required
              className={inputClass}
            >
              <option value="" disabled>Pilih pelayanan yang kamu jalani</option>
              {pelayananRoles.map((r) => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-500">Tanggal</label>
            <input
              type="date"
              value={date}
              max={TODAY}
              onChange={(e) => {
                setDate(e.target.value)
                setJustCheckedIn(false)
              }}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-500">Catatan (opsional)</label>
            <input
              value={note}
              onChange={(e) => {
                setNote(e.target.value)
                setJustCheckedIn(false)
              }}
              placeholder="Ibadah Minggu pagi, dst."
              className={inputClass}
            />
          </div>
          <div className="flex items-center justify-between">
            {justCheckedIn ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-good-500">
                <CheckCircle2 size={16} /> Presensi tercatat
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              <HandHelping size={16} /> Tandai Hadir
            </button>
          </div>
        </form>
      </Card>

      <Card>
        <SectionTitle>Riwayat Presensimu</SectionTitle>
        {myCheckins.length === 0 ? (
          <EmptyState title="Belum ada riwayat" body="Presensi pelayananmu akan muncul di sini." />
        ) : (
          <ul className="flex flex-col divide-y divide-ink-100">
            {myCheckins.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-ink-900">{c.roleName}</p>
                  <p className="text-xs text-ink-400">{formatLongDate(c.date)}{c.note ? ` · ${c.note}` : ''}</p>
                </div>
                <Badge color="good">Hadir</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

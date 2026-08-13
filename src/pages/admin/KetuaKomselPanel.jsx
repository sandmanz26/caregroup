import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Check, X, Plus, MapPin, Phone, GraduationCap } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, SectionTitle, Badge, Avatar, EmptyState } from '../../components/ui'
import { formatLongDate, isWithinLastWeek } from '../../utils/date'

const TABS = [
  { id: 'peserta', label: 'Peserta Komsel' },
  { id: 'kehadiran', label: 'Kehadiran' },
  { id: 'pengajuan', label: 'Pengajuan Pelayanan' },
  { id: 'jadwal', label: 'Jadwal Komsel' },
  { id: 'khusus', label: 'Jadwal Khusus' },
]

const inputClass = 'w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400'

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-500">{label}</label>
      {children}
    </div>
  )
}

function PesertaTab({ group }) {
  const { addMemberToGroup } = useApp()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [university, setUniversity] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    addMemberToGroup(group.id, { name, phone, address, university })
    setName('')
    setPhone('')
    setAddress('')
    setUniversity('')
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>Tambah Peserta</SectionTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Nama">
              <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
            </FormField>
            <FormField label="No. HP (opsional)">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Alamat (opsional)">
              <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
            </FormField>
            <FormField label="Universitas (opsional)">
              <input value={university} onChange={(e) => setUniversity(e.target.value)} className={inputClass} />
            </FormField>
          </div>
          <button type="submit" className="flex items-center justify-center gap-1.5 self-end rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Plus size={16} /> Tambah
          </button>
        </form>
      </Card>

      <Card>
        <SectionTitle>{group.members.length} Anggota</SectionTitle>
        <p className="mb-2 text-xs text-ink-400">Sentuh nama untuk melihat data kontak.</p>
        <ul className="flex flex-col divide-y divide-ink-100">
          {group.members.map((m) => (
            <li key={m.id} className="py-1 first:pt-0 last:pb-0">
              <details>
                <summary className="flex cursor-pointer list-none items-center gap-3 py-2">
                  <Avatar initials={m.initials} />
                  <span className="flex-1 text-sm font-medium text-ink-900">{m.name}</span>
                  <Badge color={m.role === 'Leader' ? 'brand' : m.role === 'Pengurus CG' ? 'good' : 'ink'}>{m.role}</Badge>
                </summary>
                <div className="ml-12 flex flex-col gap-1.5 pb-3 text-sm text-ink-500">
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} className="text-ink-400" /> {m.phone || '-'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-ink-400" /> {m.address || '-'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-ink-400" /> {m.university || '-'}
                  </span>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function KehadiranTab({ group }) {
  const { toggleAttendance } = useApp()
  const recentMeetings = [...group.meetings]
    .filter((m) => isWithinLastWeek(m.date))
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-400">
        Menampilkan kehadiran 1 minggu terakhir. Sentuh nama anggota untuk menandai kehadiran.
      </p>
      {recentMeetings.length === 0 && (
        <EmptyState title="Belum ada pertemuan minggu ini" body="Buat jadwal komsel dulu di tab Jadwal Komsel." />
      )}
      {recentMeetings.map((meeting) => {
        const hadirCount = Object.values(meeting.attendance).filter(Boolean).length
        return (
          <Card key={meeting.id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink-900">{meeting.topic}</p>
                <p className="text-xs text-ink-400">{formatLongDate(meeting.date)}</p>
              </div>
              <Badge color="ink">{hadirCount}/{group.members.length} hadir</Badge>
            </div>
            <ul className="mt-3 flex flex-col divide-y divide-ink-100">
              {group.members.map((m) => {
                const present = !!meeting.attendance[m.id]
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => toggleAttendance(group.id, meeting.id, m.id)}
                      className="flex w-full items-center gap-3 rounded-md px-1 py-2.5 -mx-1 text-left first:pt-0 last:pb-0 hover:bg-ink-50"
                    >
                      <Avatar initials={m.initials} size="sm" />
                      <span className="flex-1 text-sm text-ink-800">{m.name}</span>
                      {present ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-good-500">
                          <Check size={14} /> Hadir
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-ink-400">
                          <X size={14} /> Tidak hadir
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>
        )
      })}
    </div>
  )
}

function PengajuanTab({ group }) {
  const { serviceApplications, toggleApplicationReviewed } = useApp()
  const applications = serviceApplications
    .filter((a) => a.careGroupId === group.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (applications.length === 0) {
    return <EmptyState title="Belum ada pengajuan" body="Pengajuan pelayanan dari anggota komsel akan muncul di sini." />
  }

  return (
    <div className="flex flex-col gap-3">
      {applications.map((a) => (
        <Card key={a.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-ink-900">{a.memberName}</p>
              <p className="text-xs text-ink-400">Mengajukan {a.roleName} &middot; {formatLongDate(a.date)}</p>
            </div>
            <Badge color={a.reviewed ? 'good' : 'brand'}>{a.reviewed ? 'Sudah ditinjau' : 'Baru'}</Badge>
          </div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink-600">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Alasan &amp; Motivasi</p>
              <p className="mt-0.5">{a.reason}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Kesibukan Saat Ini</p>
              <p className="mt-0.5">{a.availability}</p>
            </div>
          </div>
          <button
            onClick={() => toggleApplicationReviewed(a.id)}
            className="mt-3 rounded-md border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-100"
          >
            {a.reviewed ? 'Tandai belum ditinjau' : 'Tandai sudah ditinjau'}
          </button>
        </Card>
      ))}
    </div>
  )
}

function JadwalKomselTab({ group }) {
  const { addMeetingToGroup } = useApp()
  const [date, setDate] = useState('')
  const [topic, setTopic] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!date || !topic.trim()) return
    addMeetingToGroup(group.id, { date, topic })
    setDate('')
    setTopic('')
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>Buat Jadwal Pertemuan Komsel</SectionTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField label="Tanggal">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
          </FormField>
          <FormField label="Topik / Renungan">
            <input value={topic} onChange={(e) => setTopic(e.target.value)} required className={inputClass} />
          </FormField>
          <p className="text-xs text-ink-400">Jam &amp; lokasi otomatis memakai jadwal rutin komsel: {group.meetingTime}, {group.meetingLocation}.</p>
          <button type="submit" className="flex items-center gap-1.5 self-end rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Plus size={16} /> Tambah Jadwal
          </button>
        </form>
      </Card>

      <div className="flex flex-col gap-2">
        {[...group.meetings].reverse().map((m) => (
          <Card key={m.id}>
            <p className="font-medium text-ink-900">{m.topic}</p>
            <p className="text-xs text-ink-500">{formatLongDate(m.date)}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function JadwalKhususTab() {
  const { addEvent, events } = useApp()
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', note: '' })

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.date) return
    addEvent({ ...form, category: 'Acara Khusus' })
    setForm({ title: '', date: '', time: '', location: '', note: '' })
  }

  const khusus = events.filter((e) => e.category === 'Acara Khusus')

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>Buat Jadwal Khusus</SectionTitle>
        <p className="mb-3 text-sm text-ink-500">Untuk acara yang tidak terkait pertemuan komsel rutin, misalnya makan bersama.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField label="Nama Acara">
            <input value={form.title} onChange={set('title')} required placeholder="Makan Bersama Komsel" className={inputClass} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tanggal">
              <input type="date" value={form.date} onChange={set('date')} required className={inputClass} />
            </FormField>
            <FormField label="Jam">
              <input value={form.time} onChange={set('time')} placeholder="12:00" className={inputClass} />
            </FormField>
          </div>
          <FormField label="Lokasi">
            <input value={form.location} onChange={set('location')} className={inputClass} />
          </FormField>
          <FormField label="Catatan (opsional)">
            <input value={form.note} onChange={set('note')} className={inputClass} />
          </FormField>
          <button type="submit" className="flex items-center gap-1.5 self-end rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Plus size={16} /> Tambah
          </button>
        </form>
      </Card>

      <div className="flex flex-col gap-2">
        {khusus.map((e) => (
          <Card key={e.id}>
            <p className="font-medium text-ink-900">{e.title}</p>
            <p className="text-xs text-ink-500">{formatLongDate(e.date)}, {e.time} &middot; {e.location}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function KetuaKomselPanel() {
  const { myCareGroup, serviceApplications } = useApp()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'peserta'

  if (!myCareGroup) {
    return <EmptyState title="Belum terhubung ke Care Group" body="Hubungi Super Admin untuk ditetapkan sebagai ketua komsel." />
  }

  const pendingCount = serviceApplications.filter((a) => a.careGroupId === myCareGroup.id && !a.reviewed).length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">Ketua Komsel</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">{myCareGroup.name}</h1>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-lg border border-ink-200 bg-white p-1 scrollbar-thin">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setParams({ tab: t.id })}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-brand-500 text-white' : 'text-ink-500 hover:bg-ink-100'
            }`}
          >
            {t.label}
            {t.id === 'pengajuan' && pendingCount > 0 && (
              <span className={`flex size-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                tab === t.id ? 'bg-white text-brand-600' : 'bg-brand-500 text-white'
              }`}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'peserta' && <PesertaTab group={myCareGroup} />}
      {tab === 'kehadiran' && <KehadiranTab group={myCareGroup} />}
      {tab === 'pengajuan' && <PengajuanTab group={myCareGroup} />}
      {tab === 'jadwal' && <JadwalKomselTab group={myCareGroup} />}
      {tab === 'khusus' && <JadwalKhususTab />}
    </div>
  )
}

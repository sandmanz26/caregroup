import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Phone, MapPin, GraduationCap, ArrowRightLeft } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, SectionTitle, Badge, Avatar, EmptyState } from '../../components/ui'
import { careGroupCategories, eventCategories } from '../../data/mockData'
import { formatShortDate, formatLongDate } from '../../utils/date'

const TABS = [
  { id: 'renungan', label: 'Renungan' },
  { id: 'komsel', label: 'Komsel' },
  { id: 'peserta', label: 'Peserta' },
  { id: 'pengajuan', label: 'Pengajuan Pelayanan' },
  { id: 'event', label: 'Event' },
  { id: 'coaching', label: 'Jadwal Coaching' },
]

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-500">{label}</label>
      {children}
    </div>
  )
}

const inputClass = 'w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400'

function RenunganTab() {
  const { materi, addMateri } = useApp()
  const [form, setForm] = useState({ week: '', title: '', verse: '', summary: '', questions: '' })

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.summary.trim()) return
    addMateri(form)
    setForm({ week: '', title: '', verse: '', summary: '', questions: '' })
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>Tambah Renungan</SectionTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Minggu">
              <input value={form.week} onChange={set('week')} placeholder="Minggu ke-2 Agustus" className={inputClass} />
            </FormField>
            <FormField label="Ayat">
              <input value={form.verse} onChange={set('verse')} placeholder="Yohanes 3:16" className={inputClass} />
            </FormField>
          </div>
          <FormField label="Judul">
            <input value={form.title} onChange={set('title')} required className={inputClass} />
          </FormField>
          <FormField label="Ringkasan">
            <textarea value={form.summary} onChange={set('summary')} required rows={2} className={inputClass} />
          </FormField>
          <FormField label="Pertanyaan diskusi (satu per baris)">
            <textarea value={form.questions} onChange={set('questions')} rows={3} className={inputClass} />
          </FormField>
          <button type="submit" className="flex items-center gap-1.5 self-end rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Plus size={16} /> Tambah
          </button>
        </form>
      </Card>

      <div className="flex flex-col gap-3">
        {materi.map((m) => (
          <Card key={m.id}>
            <p className="text-xs text-ink-400">{m.week}</p>
            <p className="font-medium text-ink-900">{m.title}</p>
            <p className="text-xs text-brand-600">{m.verse}</p>
            <p className="mt-1 text-sm text-ink-600">{m.summary}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function KomselTab() {
  const { careGroups, addCareGroup, setCareGroupLeader } = useApp()
  const [form, setForm] = useState({
    name: '',
    category: careGroupCategories[0],
    leaderName: '',
    meetingDay: '',
    meetingTime: '',
    meetingLocation: '',
    frequency: '',
  })

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.leaderName.trim()) return
    addCareGroup(form)
    setForm({ name: '', category: careGroupCategories[0], leaderName: '', meetingDay: '', meetingTime: '', meetingLocation: '', frequency: '' })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {careGroups.map((g) => (
          <Card key={g.id}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-medium text-ink-900">{g.name}</p>
                <p className="text-xs text-ink-400">{g.category} &middot; {g.members.length} anggota</p>
              </div>
              <Badge color="ink">{g.meetingDay}, {g.meetingTime}</Badge>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <label className="text-xs font-medium text-ink-500">Ketua Komsel</label>
              <select
                value={g.leaderId}
                onChange={(e) => setCareGroupLeader(g.id, e.target.value)}
                className="rounded-md border border-ink-200 px-2 py-1.5 text-sm outline-none focus:border-brand-400"
              >
                {g.members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <SectionTitle>Buat Komsel Baru</SectionTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField label="Nama Komsel">
            <input value={form.name} onChange={set('name')} required placeholder='Care Group "..."' className={inputClass} />
          </FormField>
          <FormField label="Kategori">
            <select value={form.category} onChange={set('category')} className={inputClass}>
              {careGroupCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Nama Ketua Komsel">
            <input value={form.leaderName} onChange={set('leaderName')} required className={inputClass} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Hari">
              <input value={form.meetingDay} onChange={set('meetingDay')} placeholder="Rabu" className={inputClass} />
            </FormField>
            <FormField label="Jam">
              <input value={form.meetingTime} onChange={set('meetingTime')} placeholder="19:00" className={inputClass} />
            </FormField>
          </div>
          <FormField label="Lokasi">
            <input value={form.meetingLocation} onChange={set('meetingLocation')} className={inputClass} />
          </FormField>
          <FormField label="Frekuensi">
            <input value={form.frequency} onChange={set('frequency')} placeholder="2x per bulan" className={inputClass} />
          </FormField>
          <button type="submit" className="flex items-center gap-1.5 self-end rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Plus size={16} /> Buat Komsel
          </button>
        </form>
      </Card>
    </div>
  )
}

function PesertaTab() {
  const { careGroups, moveMember } = useApp()
  const allMembers = careGroups.flatMap((g) => g.members.map((m) => ({ ...m, groupId: g.id, groupName: g.name })))

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <p className="text-sm text-ink-500">Total peserta di semua Care Group</p>
        <p className="text-2xl font-semibold text-ink-900">{allMembers.length}</p>
      </Card>
      <Card>
        <SectionTitle>Data Peserta</SectionTitle>
        <p className="mb-2 text-xs text-ink-400">Sentuh nama untuk melihat data kontak &amp; memindahkan komsel.</p>
        <ul className="flex flex-col divide-y divide-ink-100">
          {allMembers.map((m) => (
            <li key={m.id} className="py-1 first:pt-0 last:pb-0">
              <details>
                <summary className="flex cursor-pointer list-none items-center gap-3 py-2">
                  <Avatar initials={m.initials} size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink-900">{m.name}</p>
                    <p className="text-xs text-ink-400">{m.groupName}</p>
                  </div>
                  <Badge color={m.role === 'Leader' ? 'brand' : 'ink'}>{m.role}</Badge>
                </summary>
                <div className="ml-11 flex flex-col gap-2 pb-3 text-sm text-ink-500">
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} className="text-ink-400" /> {m.phone || '-'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-ink-400" /> {m.address || '-'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-ink-400" /> {m.university || '-'}
                  </span>
                  <label className="flex items-center gap-1.5 pt-1">
                    <ArrowRightLeft size={14} className="text-ink-400" />
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) moveMember(m.id, m.groupId, e.target.value)
                      }}
                      className="rounded-md border border-ink-200 px-2 py-1.5 text-sm outline-none focus:border-brand-400"
                    >
                      <option value="">Pindahkan ke komsel lain...</option>
                      {careGroups.filter((g) => g.id !== m.groupId).map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function PengajuanTab() {
  const { serviceApplications, toggleApplicationReviewed } = useApp()
  const applications = [...serviceApplications].sort((a, b) => b.date.localeCompare(a.date))

  if (applications.length === 0) {
    return <EmptyState title="Belum ada pengajuan" body="Pengajuan pelayanan dari seluruh Care Group akan muncul di sini." />
  }

  return (
    <div className="flex flex-col gap-3">
      {applications.map((a) => (
        <Card key={a.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-ink-900">{a.memberName}</p>
              <p className="text-xs text-ink-400">
                Mengajukan {a.roleName} &middot; {a.careGroupName} &middot; {formatLongDate(a.date)}
              </p>
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

function EventTab({ fixedCategory, title }) {
  const { events, addEvent } = useApp()
  const categoryOptions = eventCategories.filter((c) => c !== 'Semua')
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    category: fixedCategory || categoryOptions[0],
    location: '',
    note: '',
  })

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.date) return
    addEvent(form)
    setForm({ title: '', date: '', time: '', category: fixedCategory || categoryOptions[0], location: '', note: '' })
  }

  const list = fixedCategory ? events.filter((e) => e.category === fixedCategory) : events

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>{title}</SectionTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField label="Judul">
            <input value={form.title} onChange={set('title')} required className={inputClass} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tanggal">
              <input type="date" value={form.date} onChange={set('date')} required className={inputClass} />
            </FormField>
            <FormField label="Jam">
              <input value={form.time} onChange={set('time')} placeholder="18:00" className={inputClass} />
            </FormField>
          </div>
          {!fixedCategory && (
            <FormField label="Kategori">
              <select value={form.category} onChange={set('category')} className={inputClass}>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>
          )}
          <FormField label="Lokasi">
            <input value={form.location} onChange={set('location')} className={inputClass} />
          </FormField>
          <FormField label="Catatan (opsional)">
            <input value={form.note} onChange={set('note')} placeholder="Tiap Selasa" className={inputClass} />
          </FormField>
          <button type="submit" className="flex items-center gap-1.5 self-end rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Plus size={16} /> Tambah
          </button>
        </form>
      </Card>

      <div className="flex flex-col gap-2">
        {list.map((e) => (
          <Card key={e.id}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-medium text-ink-900">{e.title}</p>
                <p className="text-xs text-ink-500">{formatShortDate(e.date)}, {e.time} &middot; {e.location}</p>
              </div>
              <Badge color="ink">{e.category}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function SuperAdminPanel() {
  const { serviceApplications } = useApp()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'renungan'
  const pendingCount = serviceApplications.filter((a) => !a.reviewed).length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">Super Admin</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">Panel Admin</h1>
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

      {tab === 'renungan' && <RenunganTab />}
      {tab === 'komsel' && <KomselTab />}
      {tab === 'peserta' && <PesertaTab />}
      {tab === 'pengajuan' && <PengajuanTab />}
      {tab === 'event' && <EventTab title="Tambah Event" />}
      {tab === 'coaching' && <EventTab fixedCategory="Coaching" title="Tambah Jadwal Coaching" />}
    </div>
  )
}

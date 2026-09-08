import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, TrendingUp, UserPlus, BookMarked, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, SectionTitle, Badge, Avatar, EmptyState } from '../../components/ui'
import { cgGrowthTiers, invitationTiers, readingTiers } from '../../data/mockData'
import { formatLongDate, isPastMeeting } from '../../utils/date'
import { computeTierStats } from '../../utils/tiers'

const TABS = [
  { id: 'cg', label: 'CG Binaan' },
  { id: 'jadwal', label: 'Jadwal Pembinaan' },
  { id: 'statistik', label: 'Statistik' },
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

function roleBadgeColor(role) {
  if (role === 'Leader' || role === 'Kandidat Leader') return 'brand'
  if (role === 'Calon Leader') return 'warn'
  if (role === 'Pengurus CG') return 'good'
  return 'ink'
}

function CgBinaanTab({ groups }) {
  if (groups.length === 0) {
    return <EmptyState title="Belum ada CG yang dibina" body="Hubungi Super Admin untuk ditugaskan membina satu atau lebih Care Group." />
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map((g) => (
        <Card key={g.id}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-medium text-ink-900">{g.code} &middot; {g.name}</p>
              <p className="text-xs text-ink-400">Leader: {g.leaderName} &middot; {g.members.length} anggota</p>
            </div>
            <Badge color="ink">{g.category}</Badge>
          </div>
          <details className="mt-3">
            <summary className="cursor-pointer text-xs font-medium text-brand-600">Lihat semua anggota &amp; peran</summary>
            <ul className="mt-2 flex flex-col divide-y divide-ink-100">
              {g.members.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                  <Avatar initials={m.initials} size="sm" />
                  <span className="flex-1 text-sm text-ink-800">{m.name}</span>
                  <Badge color={roleBadgeColor(m.role)}>{m.role}</Badge>
                </li>
              ))}
            </ul>
          </details>
        </Card>
      ))}
    </div>
  )
}

function JadwalPembinaanTab() {
  const { addEvent, events } = useApp()
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', audience: '', note: '' })

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.date) return
    const audienceNote = form.audience ? `Untuk: ${form.audience}` : ''
    addEvent({
      date: form.date,
      time: form.time,
      title: form.title,
      category: 'Coaching',
      location: form.location,
      note: [audienceNote, form.note].filter(Boolean).join(' — '),
    })
    setForm({ title: '', date: '', time: '', location: '', audience: '', note: '' })
  }

  const pembinaan = events.filter((e) => e.category === 'Coaching').sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>Buat Jadwal Pembinaan</SectionTitle>
        <p className="mb-3 text-sm text-ink-500">
          Untuk pertemuan pembinaan dengan Leader, Kandidat Leader, Calon Leader, atau Pengurus CG yang kamu bina.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField label="Judul">
            <input value={form.title} onChange={set('title')} required placeholder="Pembinaan Leader Triwulan" className={inputClass} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tanggal">
              <input type="date" value={form.date} onChange={set('date')} required className={inputClass} />
            </FormField>
            <FormField label="Jam">
              <input value={form.time} onChange={set('time')} placeholder="19:00" className={inputClass} />
            </FormField>
          </div>
          <FormField label="Lokasi">
            <input value={form.location} onChange={set('location')} className={inputClass} />
          </FormField>
          <FormField label="Untuk Siapa (opsional)">
            <input value={form.audience} onChange={set('audience')} placeholder="Leader &amp; Kandidat Leader CG Kasih Setia" className={inputClass} />
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
        {pembinaan.map((e) => (
          <Card key={e.id}>
            <p className="font-medium text-ink-900">{e.title}</p>
            <p className="text-xs text-ink-500">{formatLongDate(e.date)}, {e.time} &middot; {e.location}</p>
            {e.note && <p className="mt-1 text-sm text-ink-600">{e.note}</p>}
          </Card>
        ))}
      </div>
    </div>
  )
}

// Coverage-based summary, mirroring the same logic used per-CG in KetuaKomselPanel's Statistik
// tab, but here run once across every member of every CG this Coach oversees combined.
function summarizeTierCoverage(members, tiers, getDates) {
  let eligible = 0
  let atLeastOne = 0
  const counts = Object.fromEntries(tiers.map((t) => [t.id, 0]))
  members.forEach((m) => {
    const dates = getDates(m)
    if (dates === null) return
    eligible++
    const stats = computeTierStats(dates, tiers)
    if (stats.currentTier) {
      atLeastOne++
      counts[stats.currentTier.id]++
    }
  })
  return { eligible, atLeastOne, counts }
}

function TierCoverageCard({ icon: Icon, title, coverage, tiers, totalMembers, scopeNote }) {
  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <Icon size={18} />
        </span>
        <p className="text-sm text-ink-600">
          <span className="font-semibold text-ink-900">{coverage.atLeastOne}</span> dari {coverage.eligible} anggota
          {coverage.eligible < totalMembers ? ` (dari ${totalMembers} total)` : ''} sudah mencapai minimal satu tingkat.
        </p>
      </div>
      {coverage.atLeastOne > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tiers
            .filter((t) => coverage.counts[t.id] > 0)
            .map((t) => (
              <Badge key={t.id} color="ink">{t.label}: {coverage.counts[t.id]}</Badge>
            ))}
        </div>
      )}
      {scopeNote && <p className="mt-2 text-xs text-ink-400">{scopeNote}</p>}
    </Card>
  )
}

function StatistikTab({ groups }) {
  const { allUsers, bibleReadingCheckins, invitations } = useApp()

  const perGroupAttendance = groups.map((g) => {
    const past = g.meetings.filter((m) => isPastMeeting(m.date))
    const totalSlots = past.length * g.members.length
    const totalPresent = past.reduce((sum, m) => sum + Object.values(m.attendance).filter(Boolean).length, 0)
    return { id: g.id, name: g.name, pct: totalSlots > 0 ? Math.round((totalPresent / totalSlots) * 100) : null }
  })

  const allMembers = groups.flatMap((g) => g.members.map((m) => ({ ...m, groupId: g.id })))
  const totalMembers = allMembers.length

  const bertumbuh = summarizeTierCoverage(allMembers, cgGrowthTiers, (m) => {
    const g = groups.find((gr) => gr.id === m.groupId)
    return g.meetings.filter((meet) => meet.attendance[m.id]).map((meet) => meet.date)
  })
  const beranting = summarizeTierCoverage(allMembers, invitationTiers, (m) =>
    invitations.filter((i) => i.memberId === m.id).map((i) => i.date)
  )
  const membersWithAccount = allMembers.filter((m) => allUsers.some((u) => u.memberId === m.id))
  const berakar = summarizeTierCoverage(allMembers, readingTiers, (m) => {
    const account = allUsers.find((u) => u.memberId === m.id)
    if (!account) return null
    return bibleReadingCheckins.filter((c) => c.userId === account.id).map((c) => c.date)
  })

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>Ringkasan Semua CG Binaan</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="text-2xl font-semibold text-ink-900">{groups.length}</p>
            <p className="text-xs text-ink-400">Care Group</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-ink-900">{totalMembers}</p>
            <p className="text-xs text-ink-400">Total Anggota</p>
          </div>
        </div>
        <ul className="mt-3 flex flex-col divide-y divide-ink-100">
          {perGroupAttendance.map((g) => (
            <li key={g.id} className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2 text-sm text-ink-800">
                <Users size={14} className="text-ink-400" /> {g.name}
              </div>
              <Badge color="ink">{g.pct === null ? 'Belum ada data' : `Kehadiran ${g.pct}%`}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <TierCoverageCard
        icon={TrendingUp}
        title="Bertumbuh (Kehadiran CG) — Gabungan"
        coverage={bertumbuh}
        tiers={cgGrowthTiers}
        totalMembers={totalMembers}
      />
      <TierCoverageCard
        icon={UserPlus}
        title="Beranting (Mengajak Orang Baru) — Gabungan"
        coverage={beranting}
        tiers={invitationTiers}
        totalMembers={totalMembers}
      />
      <TierCoverageCard
        icon={BookMarked}
        title="Berakar (Baca Alkitab Harian) — Gabungan"
        coverage={berakar}
        tiers={readingTiers}
        totalMembers={totalMembers}
        scopeNote={`Hanya menghitung anggota yang sudah punya akun login (${membersWithAccount.length} dari ${totalMembers} anggota) — Baca Alkitab bersifat pribadi lewat akun masing-masing.`}
      />
    </div>
  )
}

export default function CoachPanel() {
  const { myCoachedGroups } = useApp()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'cg'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">Coach</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">Panel Pembinaan</h1>
        <p className="mt-1 text-sm text-ink-400">
          {myCoachedGroups.length === 0
            ? 'Belum ada Care Group yang ditugaskan padamu.'
            : `Membina ${myCoachedGroups.length} Care Group.`}
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-lg border border-ink-200 bg-white p-1 scrollbar-thin">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setParams({ tab: t.id })}
            className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-brand-500 text-white' : 'text-ink-500 hover:bg-ink-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'cg' && <CgBinaanTab groups={myCoachedGroups} />}
      {tab === 'jadwal' && <JadwalPembinaanTab />}
      {tab === 'statistik' && <StatistikTab groups={myCoachedGroups} />}
    </div>
  )
}

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Check, X, Plus, MapPin, Phone, GraduationCap, ArrowUpCircle, Lock, TrendingUp, UserPlus, BookMarked, Cake, Pencil, Save } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Card, SectionTitle, Badge, Avatar, EmptyState } from '../../components/ui'
import { nextPromotionRole, cgGrowthTiers, invitationTiers, readingTiers } from '../../data/mockData'
import {
  formatLongDate,
  formatShortDate,
  formatBirthDate,
  isPastMeeting,
  isAttendanceLocked,
  attendanceEditDeadline,
} from '../../utils/date'
import { computeTierStats } from '../../utils/tiers'

const TABS = [
  { id: 'peserta', label: 'Peserta Komsel' },
  { id: 'kehadiran', label: 'Kehadiran' },
  { id: 'profil', label: 'Profil CG' },
  { id: 'statistik', label: 'Statistik' },
  { id: 'pengajuan', label: 'Pengajuan Pelayanan' },
  { id: 'presensi', label: 'Presensi Pelayanan' },
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

function roleBadgeColor(role) {
  if (role === 'Leader') return 'brand'
  if (role === 'Kandidat Leader') return 'brand'
  if (role === 'Calon Leader') return 'warn'
  if (role === 'Pengurus CG') return 'good'
  return 'ink'
}

function PesertaTab({ group }) {
  const { addMemberToGroup, promoteMember } = useApp()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [university, setUniversity] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [notice, setNotice] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    addMemberToGroup(group.id, { name, phone, address, university, birthDate })
    setName('')
    setPhone('')
    setAddress('')
    setUniversity('')
    setBirthDate('')
  }

  function handlePromote(member) {
    const result = promoteMember(group.id, member.id)
    if (!result.ok) {
      setNotice({ type: 'error', text: result.error })
      return
    }
    if (result.grant && !result.grant.alreadyHadAccount) {
      setNotice({
        type: 'success',
        text: `${member.name} dinaikkan ke ${result.newRole}. Akun Ketua Komsel baru dibuat — Nomor WA: ${member.phone}, kata sandi: ${result.grant.password} (sampaikan ke yang bersangkutan).`,
      })
    } else if (result.grant) {
      setNotice({ type: 'success', text: `${member.name} dinaikkan ke ${result.newRole}. Akun yang sudah ada kini punya akses Panel Admin.` })
    } else {
      setNotice({ type: 'success', text: `${member.name} dinaikkan ke ${result.newRole}.` })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {notice && (
        <Card className={notice.type === 'error' ? 'border-red-200 bg-red-50' : 'border-good-100 bg-good-100'}>
          <div className="flex items-start justify-between gap-3">
            <p className={`text-sm ${notice.type === 'error' ? 'text-red-600' : 'text-good-500'}`}>{notice.text}</p>
            <button type="button" onClick={() => setNotice(null)} className="shrink-0 text-ink-400 hover:text-ink-600">
              <X size={16} />
            </button>
          </div>
        </Card>
      )}

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
          <FormField label="Tanggal Lahir (opsional, format BB-TT misal 08-20)">
            <input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="08-20" className={inputClass} />
          </FormField>
          <button type="submit" className="flex items-center justify-center gap-1.5 self-end rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Plus size={16} /> Tambah
          </button>
        </form>
      </Card>

      <Card>
        <SectionTitle>{group.members.length} Anggota</SectionTitle>
        <p className="mb-2 text-xs text-ink-400">Sentuh nama untuk melihat data kontak &amp; menaikkan status.</p>
        <ul className="flex flex-col divide-y divide-ink-100">
          {group.members.map((m) => {
            const next = nextPromotionRole(m.role)
            const isGroupLeader = m.role === 'Leader'
            return (
              <li key={m.id} className="py-1 first:pt-0 last:pb-0">
                <details>
                  <summary className="flex cursor-pointer list-none items-center gap-3 py-2">
                    <Avatar initials={m.initials} />
                    <span className="flex-1 text-sm font-medium text-ink-900">{m.name}</span>
                    <Badge color={roleBadgeColor(m.role)}>{m.role}</Badge>
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
                    <span className="flex items-center gap-1.5">
                      <Cake size={14} className="text-ink-400" /> {m.birthDate ? formatBirthDate(m.birthDate) : '-'}
                    </span>
                    {!isGroupLeader && next && (
                      <button
                        type="button"
                        onClick={() => handlePromote(m)}
                        className="mt-1 flex items-center gap-1.5 self-start rounded-md border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-100"
                      >
                        <ArrowUpCircle size={14} /> Naikkan ke {next}
                      </button>
                    )}
                    {!isGroupLeader && !next && m.role === 'Kandidat Leader' && (
                      <p className="mt-1 text-xs text-ink-400">Sudah Kandidat Leader — perubahan ke Leader dilakukan Super Admin.</p>
                    )}
                  </div>
                </details>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}

const KEHADIRAN_PAGE_SIZE = 2

function AbsentNote({ groupId, meetingId, memberId, note, locked }) {
  const { setAttendanceNote } = useApp()
  const [value, setValue] = useState(note || '')

  if (locked) {
    return note ? <p className="ml-12 -mt-1.5 mb-2 text-xs italic text-ink-400">Keterangan: {note}</p> : null
  }

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => setAttendanceNote(groupId, meetingId, memberId, value)}
      onClick={(e) => e.stopPropagation()}
      placeholder="Keterangan (opsional, misal: Sakit)"
      className="ml-12 -mt-1.5 mb-2 w-[calc(100%-3rem)] rounded-md border border-ink-200 px-2.5 py-1.5 text-xs outline-none focus:border-brand-400"
    />
  )
}

function KehadiranTab({ group }) {
  const { toggleAttendance } = useApp()
  const [visibleCount, setVisibleCount] = useState(KEHADIRAN_PAGE_SIZE)
  const [filterMemberId, setFilterMemberId] = useState('')
  const recentMeetings = [...group.meetings].sort((a, b) => b.date.localeCompare(a.date))
  const visibleMeetings = recentMeetings.slice(0, visibleCount)
  const visibleMembers = filterMemberId ? group.members.filter((m) => m.id === filterMemberId) : group.members

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink-400">Sentuh nama anggota untuk menandai kehadiran.</p>
        <select
          value={filterMemberId}
          onChange={(e) => setFilterMemberId(e.target.value)}
          className="rounded-md border border-ink-200 px-2 py-1.5 text-sm outline-none focus:border-brand-400"
        >
          <option value="">Semua anggota</option>
          {group.members.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
      {recentMeetings.length === 0 && (
        <EmptyState title="Belum ada pertemuan" body="Buat jadwal komsel dulu di tab Jadwal Komsel." />
      )}
      {visibleMeetings.map((meeting) => {
        const hadirCount = Object.values(meeting.attendance).filter(Boolean).length
        const locked = isAttendanceLocked(meeting.date)
        return (
          <Card key={meeting.id}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-medium text-ink-900">{meeting.topic}</p>
                <p className="text-xs text-ink-400">{formatLongDate(meeting.date)}</p>
                {meeting.description && <p className="mt-1 text-sm text-ink-500">{meeting.description}</p>}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge color="ink">{hadirCount}/{group.members.length} hadir</Badge>
                {locked && (
                  <span className="flex items-center gap-1 text-[11px] text-ink-400">
                    <Lock size={12} /> Terkunci
                  </span>
                )}
              </div>
            </div>
            {locked && (
              <p className="mt-2 text-xs text-ink-400">
                Batas edit kehadiran (14 hari) sudah lewat sejak {formatShortDate(attendanceEditDeadline(meeting.date))}.
              </p>
            )}
            <ul className="mt-3 flex flex-col divide-y divide-ink-100">
              {visibleMembers.map((m) => {
                const present = !!meeting.attendance[m.id]
                const Row = locked ? 'div' : 'button'
                return (
                  <li key={m.id}>
                    <Row
                      onClick={locked ? undefined : () => toggleAttendance(group.id, meeting.id, m.id)}
                      className={`flex w-full items-center gap-3 rounded-md px-1 py-2.5 -mx-1 text-left first:pt-0 last:pb-0 ${
                        locked ? '' : 'hover:bg-ink-50'
                      }`}
                    >
                      <Avatar initials={m.initials} size="sm" />
                      <span className="flex-1 text-sm text-ink-800">{m.name}</span>
                      {m.role === 'Leader' && <Badge color="brand">Leader</Badge>}
                      {present ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-good-500">
                          <Check size={14} /> Hadir
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-ink-400">
                          <X size={14} /> Tidak hadir
                        </span>
                      )}
                    </Row>
                    {!present && (
                      <AbsentNote
                        groupId={group.id}
                        meetingId={meeting.id}
                        memberId={m.id}
                        note={meeting.attendanceNotes?.[m.id]}
                        locked={locked}
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          </Card>
        )
      })}
      {visibleCount < recentMeetings.length && (
        <button
          type="button"
          onClick={() => setVisibleCount((v) => v + KEHADIRAN_PAGE_SIZE)}
          className="rounded-md border border-ink-200 bg-white py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-100"
        >
          Tampilkan lebih banyak
        </button>
      )}
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

function PresensiTab({ group }) {
  const { pelayananCheckins } = useApp()
  const checkins = pelayananCheckins
    .filter((c) => c.careGroupId === group.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (checkins.length === 0) {
    return <EmptyState title="Belum ada presensi" body="Presensi pelayanan mandiri dari anggota komsel akan muncul di sini." />
  }

  return (
    <div className="flex flex-col gap-3">
      {checkins.map((c) => (
        <Card key={c.id}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-medium text-ink-900">{c.memberName}</p>
              <p className="text-xs text-ink-400">
                {c.roleName} &middot; {formatLongDate(c.date)}{c.note ? ` · ${c.note}` : ''}
              </p>
            </div>
            <Badge color="good">Hadir</Badge>
          </div>
        </Card>
      ))}
    </div>
  )
}

function EditMeetingForm({ group, meeting, onDone }) {
  const { updateMeeting } = useApp()
  const [date, setDate] = useState(meeting.date)
  const [topic, setTopic] = useState(meeting.topic)
  const [description, setDescription] = useState(meeting.description || '')

  function handleSubmit(e) {
    e.preventDefault()
    if (!date || !topic.trim()) return
    updateMeeting(group.id, meeting.id, { date, topic, description })
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <FormField label="Tanggal">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
      </FormField>
      <FormField label="Topik / Renungan">
        <input value={topic} onChange={(e) => setTopic(e.target.value)} required className={inputClass} />
      </FormField>
      <FormField label="Deskripsi Acara (opsional)">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputClass} />
      </FormField>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-100">
          Batal
        </button>
        <button type="submit" className="flex items-center gap-1.5 rounded-md bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600">
          <Save size={14} /> Simpan
        </button>
      </div>
    </form>
  )
}

function JadwalKomselTab({ group }) {
  const { addMeetingToGroup } = useApp()
  const [date, setDate] = useState('')
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!date || !topic.trim()) return
    addMeetingToGroup(group.id, { date, topic, description })
    setDate('')
    setTopic('')
    setDescription('')
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
          <FormField label="Deskripsi Acara (opsional)">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputClass} />
          </FormField>
          <p className="text-xs text-ink-400">Jam &amp; lokasi otomatis memakai jadwal rutin komsel: {group.meetingTime}, {group.meetingLocation}.</p>
          <button type="submit" className="flex items-center gap-1.5 self-end rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Plus size={16} /> Tambah Jadwal
          </button>
        </form>
      </Card>

      <div className="flex flex-col gap-2">
        {[...group.meetings].reverse().map((m) => {
          const past = isPastMeeting(m.date)
          if (editingId === m.id) {
            return (
              <Card key={m.id}>
                <EditMeetingForm group={group} meeting={m} onDone={() => setEditingId(null)} />
              </Card>
            )
          }
          return (
            <Card key={m.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ink-900">{m.topic}</p>
                  <p className="text-xs text-ink-500">{formatLongDate(m.date)}</p>
                  {m.description && <p className="mt-1 text-sm text-ink-600">{m.description}</p>}
                </div>
                {past ? (
                  <Badge color="ink">Sudah berlalu</Badge>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingId(m.id)}
                    className="flex shrink-0 items-center gap-1 rounded-md border border-ink-200 px-2.5 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-100"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                )}
              </div>
            </Card>
          )
        })}
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

function ProfilCgTab({ group }) {
  const { setCgDescription } = useApp()
  const [description, setDescription] = useState(group.description || '')
  const [saved, setSaved] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setCgDescription(group.id, description)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <Card>
      <SectionTitle>Deskripsi Care Group</SectionTitle>
      <p className="mb-3 text-sm text-ink-500">
        Ceritakan singkat tentang CG-mu — tampil di halaman Program CG untuk anggota dan siapa pun yang melihat profil CG ini.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Contoh: Kami adalah CG yang fokus bertumbuh bersama lewat sharing dan doa tiap minggu..."
          className={inputClass}
        />
        <button type="submit" className="flex items-center gap-1.5 self-end rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
          <Save size={16} /> Simpan
        </button>
        {saved && <p className="text-right text-xs font-medium text-good-500">Tersimpan.</p>}
      </form>
    </Card>
  )
}

// Coverage-based summary: counts how many members currently hold each tier, plus how many
// have reached at least the lowest one. `getDates` returning null (not just []) means "no data
// source for this member" (used only for Berakar, where members without a login account have
// no daily-reading history at all) so they're excluded from the denominator, not counted as zero.
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

function StatistikTab({ group }) {
  const { allUsers, bibleReadingCheckins, invitations } = useApp()

  const pastMeetings = group.meetings.filter((m) => isPastMeeting(m.date))
  const totalSlots = pastMeetings.length * group.members.length
  const totalPresent = pastMeetings.reduce((sum, m) => sum + Object.values(m.attendance).filter(Boolean).length, 0)
  const avgAttendancePct = totalSlots > 0 ? Math.round((totalPresent / totalSlots) * 100) : null

  const bertumbuh = summarizeTierCoverage(group.members, cgGrowthTiers, (m) =>
    group.meetings.filter((meet) => meet.attendance[m.id]).map((meet) => meet.date)
  )
  const beranting = summarizeTierCoverage(group.members, invitationTiers, (m) =>
    invitations.filter((i) => i.memberId === m.id).map((i) => i.date)
  )
  const membersWithAccount = group.members.filter((m) => allUsers.some((u) => u.memberId === m.id))
  const berakar = summarizeTierCoverage(group.members, readingTiers, (m) => {
    const account = allUsers.find((u) => u.memberId === m.id)
    if (!account) return null
    return bibleReadingCheckins.filter((c) => c.userId === account.id).map((c) => c.date)
  })

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>Ringkasan</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="text-2xl font-semibold text-ink-900">{group.members.length}</p>
            <p className="text-xs text-ink-400">Anggota</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-ink-900">{avgAttendancePct === null ? '-' : `${avgAttendancePct}%`}</p>
            <p className="text-xs text-ink-400">Rata-rata kehadiran pertemuan</p>
          </div>
        </div>
      </Card>

      <TierCoverageCard
        icon={TrendingUp}
        title="Bertumbuh (Kehadiran CG)"
        coverage={bertumbuh}
        tiers={cgGrowthTiers}
        totalMembers={group.members.length}
      />
      <TierCoverageCard
        icon={UserPlus}
        title="Beranting (Mengajak Orang Baru)"
        coverage={beranting}
        tiers={invitationTiers}
        totalMembers={group.members.length}
      />
      <TierCoverageCard
        icon={BookMarked}
        title="Berakar (Baca Alkitab Harian)"
        coverage={berakar}
        tiers={readingTiers}
        totalMembers={group.members.length}
        scopeNote={`Hanya menghitung anggota yang sudah punya akun login (${membersWithAccount.length} dari ${group.members.length} anggota) — Baca Alkitab bersifat pribadi lewat akun masing-masing.`}
      />
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
      {tab === 'profil' && <ProfilCgTab group={myCareGroup} />}
      {tab === 'statistik' && <StatistikTab group={myCareGroup} />}
      {tab === 'pengajuan' && <PengajuanTab group={myCareGroup} />}
      {tab === 'presensi' && <PresensiTab group={myCareGroup} />}
      {tab === 'jadwal' && <JadwalKomselTab group={myCareGroup} />}
      {tab === 'khusus' && <JadwalKhususTab />}
    </div>
  )
}

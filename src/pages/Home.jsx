import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays, MapPin, BookOpenText, ChevronRight, Users, ShieldCheck, Lock, LockOpen, CheckCircle2,
  Newspaper, Phone, Image as ImageIcon, ClipboardList, HandHelping, HeartHandshake, CircleUser,
  Settings, CircleHelp, Info,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, SectionTitle, Badge } from '../components/ui'
import JourneyStepper from '../components/JourneyStepper'
import BottomSheet from '../components/BottomSheet'
import HomeHeader from '../components/HomeHeader'
import ShortcutGrid from '../components/ShortcutGrid'
import QASection from '../components/QASection'
import FaithfulJourneyGrid from '../components/FaithfulJourney'
import { announcements, journeyStages, MEMBERSHIP_ATTENDANCE_THRESHOLD, churchContacts } from '../data/mockData'
import { formatLongDate, formatShortDate, isAttendanceLocked, attendanceEditDeadline, TODAY } from '../utils/date'
import { computeAttendanceStats } from '../utils/attendance'
import { computeServiceRecap } from '../utils/pelayanan'

function AnnouncementGallery({ images }) {
  if (!images || images.length === 0) return null
  return (
    <div className="mb-3 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {images.map((img, i) => (
        <div
          key={img.id}
          className="flex h-40 w-56 shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-lg bg-ink-200 text-ink-500"
        >
          <ImageIcon size={28} />
          <span className="px-3 text-center text-xs">{img.caption}</span>
          {images.length > 1 && <span className="text-[11px] text-ink-400">{i + 1}/{images.length}</span>}
        </div>
      ))}
    </div>
  )
}

function AnnouncementsCard() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <Card>
        <SectionTitle>Pengumuman</SectionTitle>
        <ul className="flex flex-col divide-y divide-ink-100">
          {announcements.map((a) => (
            <li key={a.id} className="first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => setSelected(a)}
                className="w-full py-3 text-left first:pt-0 last:pb-0 hover:bg-ink-50"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-ink-900">{a.title}</p>
                  <Badge color="brand">{formatShortDate(a.date)}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-500">{a.body}</p>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <BottomSheet open={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <>
            <p className="mb-3 text-xs text-ink-400">{formatLongDate(selected.date)}</p>
            <AnnouncementGallery images={selected.images} />
            <p className="text-sm text-ink-600">{selected.body}</p>
          </>
        )}
      </BottomSheet>
    </>
  )
}

// Temu Firman (gabungan Saat Teduh + Baca Alkitab) — ditaruh sebelum info Care Group.
function TemuFirmanCard() {
  const { user, renunganList, bibleReadingCheckins } = useApp()
  const today = renunganList[0]
  if (!today) return null
  const done = bibleReadingCheckins.some((c) => c.userId === user.id && c.date === today.date)

  return (
    <Card>
      <SectionTitle
        action={
          <Link to="/temu-firman" className="flex items-center gap-1 text-xs font-medium text-brand-600">
            Buka <ChevronRight size={14} />
          </Link>
        }
      >
        Temu Firman · Word Encounter
      </SectionTitle>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <BookOpenText size={18} />
        </span>
        <div className="flex-1">
          <p className="font-medium text-ink-900">{today.title}</p>
          <p className="text-xs text-brand-600">{today.verse}</p>
          {today.verseText && <p className="mt-1.5 text-sm italic text-ink-600">&ldquo;{today.verseText}&rdquo;</p>}
          {done ? (
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-good-500">
              <CheckCircle2 size={14} /> Sudah selesai hari ini
            </p>
          ) : (
            <p className="mt-2 text-sm text-ink-500">Ketuk untuk membaca ayat &amp; renungan, lalu tandai selesai.</p>
          )}
        </div>
      </div>
    </Card>
  )
}

function scrollToQA() {
  document.getElementById('qa')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Shortcuts({ items, cols }) {
  return (
    <Card>
      <ShortcutGrid items={items} cols={cols} />
    </Card>
  )
}

function MembershipCard({ user, stats }) {
  const stageIndex = journeyStages.findIndex((s) => s.id === user.journeyStageId)
  const memberIndex = journeyStages.findIndex((s) => s.id === 'active')
  const isMember = stageIndex >= memberIndex

  if (isMember) {
    return (
      <Card>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-good-100 text-good-500">
            <LockOpen size={18} />
          </span>
          <div>
            <p className="font-medium text-ink-900">Pelayanan Terbuka</p>
            <p className="mt-1 text-sm text-ink-500">
              Kamu sudah menjadi member Care Group ini dan bisa mengambil pelayanan.{' '}
              <Link to="/tentang" className="font-medium text-brand-600">Lihat pilihan peran</Link>
            </p>
          </div>
        </div>
      </Card>
    )
  }

  const pct = Math.min(100, Math.round((stats.totalHadir / MEMBERSHIP_ATTENDANCE_THRESHOLD) * 100))

  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-ink-200 text-ink-600">
          <Lock size={18} />
        </span>
        <div className="flex-1">
          <p className="font-medium text-ink-900">Menuju Member Care Group</p>
          <p className="mt-1 text-sm text-ink-500">
            Hadir {stats.totalHadir} dari {MEMBERSHIP_ATTENDANCE_THRESHOLD} pertemuan untuk menjadi member dan bisa mengambil pelayanan.
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-200">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </Card>
  )
}

function AttendanceReminderCard() {
  const { myCareGroup } = useApp()
  if (!myCareGroup) return null

  const candidate = [...myCareGroup.meetings]
    .filter((m) => m.date <= TODAY && !isAttendanceLocked(m.date))
    .filter((m) => Object.keys(m.attendance).length < myCareGroup.members.length)
    .sort((a, b) => b.date.localeCompare(a.date))[0]

  if (!candidate) return null

  const filled = Object.keys(candidate.attendance).length

  return (
    <Card className="border-brand-200 bg-brand-100/40">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <ClipboardList size={18} />
        </span>
        <div className="flex-1">
          <p className="font-medium text-ink-900">Kehadiran Belum Lengkap</p>
          <p className="mt-1 text-sm text-ink-600">
            Pertemuan &ldquo;{candidate.topic}&rdquo; ({formatShortDate(candidate.date)}) baru diisi {filled} dari{' '}
            {myCareGroup.members.length} anggota. Bisa diedit sampai {formatShortDate(attendanceEditDeadline(candidate.date))}.
          </p>
          <Link to="/admin?tab=kehadiran" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
            Isi kehadiran <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </Card>
  )
}

// Warta Jemaat → Contact Us → Q&A (di bawah Contact Us) → Kegiatan CG Terbaru.
function ChurchInfoSection() {
  const { myCareGroup } = useApp()
  const leader = myCareGroup?.members.find((m) => m.role === 'Leader')
  const photos = myCareGroup?.activityPhotos || []

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-ink-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Newspaper size={18} />
          </span>
          <span className="text-sm font-medium text-ink-800">Warta Jemaat</span>
        </div>
        <Badge color="ink">Segera hadir</Badge>
      </div>

      <Card>
        <SectionTitle>Contact Us</SectionTitle>
        <ul className="flex flex-col divide-y divide-ink-100">
          {leader && (
            <li className="flex items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-ink-900">{leader.name}</p>
                <p className="text-xs text-ink-400">Leader Care Group Kamu</p>
              </div>
              <a href={`tel:${leader.phone}`} className="flex items-center gap-1.5 text-sm font-medium text-brand-600">
                <Phone size={14} /> {leader.phone}
              </a>
            </li>
          )}
          {churchContacts.map((c) => (
            <li key={c.name} className="flex items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-ink-900">{c.name}</p>
                <p className="text-xs text-ink-400">{c.role}</p>
              </div>
              <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-sm font-medium text-brand-600">
                <Phone size={14} /> {c.phone}
              </a>
            </li>
          ))}
        </ul>
      </Card>

      <QASection />

      {photos.length > 0 && (
        <Card>
          <SectionTitle>Kegiatan CG Terbaru</SectionTitle>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {photos.map((p) => (
              <div
                key={p.id}
                className="flex h-32 w-48 shrink-0 flex-col items-center justify-center gap-2 rounded-lg bg-ink-200 text-ink-500"
              >
                <ImageIcon size={24} />
                <span className="px-3 text-center text-xs">{p.caption}</span>
                <span className="text-[11px] text-ink-400">{formatShortDate(p.date)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  )
}

function SuperAdminHome() {
  const { careGroups, events, pelayananCheckins, transferRequests, pendingRegistrations } = useApp()
  const totalMembers = careGroups.reduce((sum, g) => sum + g.members.length, 0)
  const upcoming = events.filter((e) => e.date >= TODAY).length
  const recap = computeServiceRecap(pelayananCheckins)
  const waiting = transferRequests.filter((r) => r.status === 'menunggu').length

  return (
    <div className="flex flex-col gap-6">
      <HomeHeader />
      <TemuFirmanCard />

      <Shortcuts
        items={[
          { label: 'Panel Admin', icon: ShieldCheck, to: '/admin' },
          { label: 'Care Group', icon: Users, to: '/komsel' },
          { label: 'Temu Firman', icon: BookOpenText, to: '/temu-firman' },
          { label: 'Jadwal', icon: CalendarDays, to: '/jadwal' },
          { label: 'Doa', icon: HeartHandshake, to: '/doa' },
          { label: 'Profil', icon: CircleUser, to: '/profil' },
          { label: 'Pengaturan', icon: Settings, to: '/pengaturan' },
        ]}
      />

      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-semibold text-ink-900">{careGroups.length}</p>
          <p className="text-xs text-ink-400">Care Group</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-semibold text-ink-900">{totalMembers}</p>
          <p className="text-xs text-ink-400">Peserta</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-semibold text-ink-900">{upcoming}</p>
          <p className="text-xs text-ink-400">Agenda</p>
        </Card>
      </div>

      {(waiting > 0 || pendingRegistrations.length > 0) && (
        <Link to="/admin" className="flex items-center justify-between rounded-lg border border-brand-200 bg-brand-100/40 p-4 hover:bg-brand-100/70">
          <div>
            <p className="text-sm font-medium text-ink-900">Perlu tindakan</p>
            <p className="text-xs text-ink-500">
              {pendingRegistrations.length} pendaftar baru &middot; {waiting} permintaan pindah CG
            </p>
          </div>
          <ChevronRight size={18} className="text-ink-400" />
        </Link>
      )}

      <Card>
        <SectionTitle
          action={<Link to="/admin?tab=rekap" className="flex items-center gap-1 text-xs font-medium text-brand-600">Rekap lengkap <ChevronRight size={14} /></Link>}
        >
          Rekap Pelayanan Member
        </SectionTitle>
        {recap.length === 0 ? (
          <p className="text-sm text-ink-400">Belum ada presensi pelayanan.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-ink-100">
            {recap.slice(0, 4).map((r) => (
              <li key={r.roleName} className="flex items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0">
                <span className="text-sm font-medium text-ink-900">{r.roleName}</span>
                <Badge color="brand">{r.memberCount} anggota</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <SectionTitle>Semua Care Group</SectionTitle>
        <ul className="flex flex-col divide-y divide-ink-100">
          {careGroups.map((g) => (
            <li key={g.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink-200 text-ink-600">
                <Users size={16} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink-900">{g.name}</p>
                <p className="text-xs text-ink-400">Ketua: {g.leaderName}</p>
              </div>
              <Badge color="ink">{g.members.length} orang</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <AnnouncementsCard />
    </div>
  )
}

function CoachHome() {
  const { myCoachedGroups } = useApp()

  return (
    <div className="flex flex-col gap-6">
      <HomeHeader />
      <TemuFirmanCard />

      <Shortcuts
        items={[
          { label: 'Panel Pembinaan', icon: ShieldCheck, to: '/admin' },
          { label: 'Care Group', icon: Users, to: '/komsel' },
          { label: 'Temu Firman', icon: BookOpenText, to: '/temu-firman' },
          { label: 'Jadwal', icon: CalendarDays, to: '/jadwal' },
          { label: 'Doa', icon: HeartHandshake, to: '/doa' },
          { label: 'Profil', icon: CircleUser, to: '/profil' },
          { label: 'Pengaturan', icon: Settings, to: '/pengaturan' },
        ]}
      />

      <Card>
        <p className="font-medium text-ink-900">
          {myCoachedGroups.length === 0 ? 'Belum ada Care Group yang ditugaskan' : `Kamu membina ${myCoachedGroups.length} Care Group`}
        </p>
        <p className="mt-1 text-sm text-ink-500">
          Buka Panel Pembinaan untuk melihat CG binaan, jadwal pembinaan, dan statistik gabungan.
        </p>
      </Card>

      <AnnouncementsCard />
    </div>
  )
}

export default function Home() {
  const { user, myCareGroup } = useApp()

  if (user.role === 'super_admin') return <SuperAdminHome />
  if (user.role === 'coach') return <CoachHome />

  if (!myCareGroup) {
    return (
      <div className="flex flex-col gap-6">
        <HomeHeader />
        <TemuFirmanCard />

        <Card>
          <p className="font-medium text-ink-900">Selamat datang di GKI Gejayan!</p>
          <p className="mt-1 text-sm text-ink-500">
            Akunmu berhasil dibuat. Tim kami akan segera menghubungkanmu dengan salah satu Care Group —
            pantau halaman ini untuk info selanjutnya.
          </p>
        </Card>

        <Shortcuts
          cols={3}
          items={[
            { label: 'Temu Firman', icon: BookOpenText, to: '/temu-firman' },
            { label: 'Tentang SDA', icon: Info, to: '/tentang' },
            { label: 'Pengaturan', icon: Settings, to: '/pengaturan' },
          ]}
        />

        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">Faithful Journey</p>
          <FaithfulJourneyGrid />
        </div>

        <Card>
          <SectionTitle>Perjalanan Pelayananmu</SectionTitle>
          <JourneyStepper currentStageId={user.journeyStageId} />
        </Card>

        <AnnouncementsCard />
      </div>
    )
  }

  const nextMeeting = myCareGroup.meetings.find((m) => m.date >= TODAY) ?? myCareGroup.meetings[0]
  const stageLabel = journeyStages.find((s) => s.id === user.journeyStageId)?.label
  const stats = computeAttendanceStats(myCareGroup.meetings, user.memberId)
  const isLeader = user.role === 'admin'

  const shortcutItems = [
    { label: 'Temu Firman', icon: BookOpenText, to: '/temu-firman' },
    { label: 'Care Group', icon: Users, to: '/komsel' },
    { label: 'Presensi', icon: HandHelping, to: '/presensi' },
    isLeader
      ? { label: 'Jadwal', icon: CalendarDays, to: '/jadwal' }
      : { label: 'Pelayanan', icon: HeartHandshake, to: '/tentang' },
    isLeader
      ? { label: 'Panel Admin', icon: ShieldCheck, to: '/admin' }
      : { label: 'Profil', icon: CircleUser, to: '/profil' },
    { label: 'Q&A', icon: CircleHelp, onClick: scrollToQA },
    { label: 'Pengaturan', icon: Settings, to: '/pengaturan' },
    isLeader
      ? { label: 'Profil', icon: CircleUser, to: '/profil' }
      : { label: 'Tentang SDA', icon: Info, to: '/tentang' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <HomeHeader streak={stats.streak} streakDetail={`${stats.totalHadir} dari ${stats.totalPertemuan} pertemuan terakhir`} />

      {isLeader && <AttendanceReminderCard />}

      <TemuFirmanCard />

      <Shortcuts items={shortcutItems} />

      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">
          Faithful Journey <span className="font-normal normal-case tracking-normal text-ink-400">· ketuk untuk penjelasan</span>
        </p>
        <FaithfulJourneyGrid />
      </div>

      <Card>
        <SectionTitle>Perjalanan Pelayananmu</SectionTitle>
        <JourneyStepper currentStageId={user.journeyStageId} />
        <p className="mt-3 text-sm text-ink-500">
          Tahap saat ini: <span className="font-medium text-ink-800">{stageLabel}</span>
        </p>
      </Card>

      <MembershipCard user={user} stats={stats} />

      {nextMeeting && (
        <Card>
          <SectionTitle
            action={
              <Link to="/komsel" className="flex items-center gap-1 text-xs font-medium text-brand-600">
                Care Group <ChevronRight size={14} />
              </Link>
            }
          >
            Pertemuan Berikutnya
          </SectionTitle>
          <p className="font-medium text-ink-900">{myCareGroup.name}</p>
          <p className="mt-1 text-sm text-ink-500">{nextMeeting.topic}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-500">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={16} className="text-ink-400" />
              {formatShortDate(nextMeeting.date)}, {myCareGroup.meetingTime}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className="text-ink-400" />
              {myCareGroup.meetingLocation}
            </span>
          </div>
        </Card>
      )}

      <AnnouncementsCard />

      <ChurchInfoSection />
    </div>
  )
}


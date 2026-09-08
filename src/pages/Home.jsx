import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, BookMarked, ChevronRight, Users, ShieldCheck, Flame, Lock, LockOpen, CheckCircle2, Newspaper, Phone, Image as ImageIcon, ClipboardList } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, SectionTitle, Badge } from '../components/ui'
import JourneyStepper from '../components/JourneyStepper'
import BottomSheet from '../components/BottomSheet'
import { announcements, journeyStages, MEMBERSHIP_ATTENDANCE_THRESHOLD, churchContacts } from '../data/mockData'
import { formatLongDate, formatShortDate, greetingForHour, isAttendanceLocked, attendanceEditDeadline, TODAY } from '../utils/date'
import { computeAttendanceStats } from '../utils/attendance'

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

function SuperAdminHome({ user }) {
  const { careGroups, events } = useApp()
  const totalMembers = careGroups.reduce((sum, g) => sum + g.members.length, 0)
  const upcoming = events.filter((e) => e.date >= TODAY).length
  const today = new Date(`${TODAY}T09:00:00`)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-ink-400">{formatLongDate(today.toISOString())}</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">
          {greetingForHour(today.getHours())}, {user.name.split(' ')[0]}
        </h1>
      </div>

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

      <Link to="/admin" className="flex items-center justify-between rounded-lg border border-ink-200 bg-white p-4 hover:bg-ink-100">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <ShieldCheck size={18} />
          </span>
          <span className="text-sm font-medium text-ink-800">Buka Panel Admin</span>
        </div>
        <ChevronRight size={18} className="text-ink-400" />
      </Link>

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

function SaatTeduhCard() {
  const { user, renunganList, bibleReadingCheckins } = useApp()
  const todayRenungan = renunganList[0]
  if (!todayRenungan) return null
  const done = bibleReadingCheckins.some((c) => c.userId === user.id && c.date === todayRenungan.date)

  return (
    <Card>
      <SectionTitle
        action={
          <Link to="/baca-alkitab" className="flex items-center gap-1 text-xs font-medium text-brand-600">
            Buka <ChevronRight size={14} />
          </Link>
        }
      >
        Saat Teduh Hari Ini
      </SectionTitle>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <BookMarked size={18} />
        </span>
        <div className="flex-1">
          <p className="font-medium text-ink-900">{todayRenungan.title}</p>
          <p className="text-xs text-ink-400">{todayRenungan.verse}</p>
          {done ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-good-500">
              <CheckCircle2 size={14} /> Sudah selesai saat teduh hari ini
            </p>
          ) : (
            <p className="mt-1 text-sm text-ink-500">Ketuk untuk membaca dan menandai selesai saat teduh.</p>
          )}
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
                <p className="text-xs text-ink-400">Admin Care Group Kamu</p>
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

export default function Home() {
  const { user, myCareGroup } = useApp()

  if (user.role === 'super_admin') return <SuperAdminHome user={user} />

  const today = new Date(`${TODAY}T09:00:00`)

  if (!myCareGroup) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-ink-400">{formatLongDate(today.toISOString())}</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink-900">
            {greetingForHour(today.getHours())}, {user.name.split(' ')[0]}
          </h1>
        </div>

        <Card>
          <SectionTitle>Perjalanan Pelayananmu</SectionTitle>
          <JourneyStepper currentStageId={user.journeyStageId} />
        </Card>

        <Card>
          <p className="font-medium text-ink-900">Selamat datang di GKI Gejayan!</p>
          <p className="mt-1 text-sm text-ink-500">
            Akunmu berhasil dibuat. Tim kami akan segera menghubungkanmu dengan salah satu Care Group —
            pantau halaman ini untuk info selanjutnya.
          </p>
        </Card>

        <SaatTeduhCard />

        <AnnouncementsCard />
      </div>
    )
  }

  const nextMeeting = myCareGroup.meetings.find((m) => m.date >= TODAY) ?? myCareGroup.meetings[0]
  const stageLabel = journeyStages.find((s) => s.id === user.journeyStageId)?.label
  const stats = computeAttendanceStats(myCareGroup.meetings, user.memberId)
  // Jadwal & Doa are hidden from the jemaat nav for now — keep their Home shortcuts staff-only too.
  const isStaffRole = user.role === 'admin'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-ink-400">{formatLongDate(today.toISOString())}</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">
          {greetingForHour(today.getHours())}, {user.name.split(' ')[0]}
        </h1>
      </div>

      {isStaffRole && <AttendanceReminderCard />}

      <Card>
        <SectionTitle>Perjalanan Pelayananmu</SectionTitle>
        <JourneyStepper currentStageId={user.journeyStageId} />
        <p className="mt-3 text-sm text-ink-500">
          Tahap saat ini: <span className="font-medium text-ink-800">{stageLabel}</span>
        </p>
      </Card>

      <Card>
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <Flame size={22} />
          </span>
          <div>
            <p className="text-2xl font-semibold text-ink-900">
              {stats.streak} <span className="text-sm font-normal text-ink-400">kali berturut-turut</span>
            </p>
            <p className="text-sm text-ink-500">
              Streak kehadiran komsel &middot; {stats.totalHadir} dari {stats.totalPertemuan} pertemuan terakhir
            </p>
          </div>
        </div>
      </Card>

      <MembershipCard user={user} stats={stats} />

      {nextMeeting && (
        <Card>
          <SectionTitle
            action={
              isStaffRole && (
                <Link to="/jadwal" className="flex items-center gap-1 text-xs font-medium text-brand-600">
                  Lihat jadwal <ChevronRight size={14} />
                </Link>
              )
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

      <SaatTeduhCard />

      <div className="grid grid-cols-2 gap-3">
        <Link to="/baca-alkitab" className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white p-4 hover:bg-ink-100">
          <BookMarked size={18} className="text-brand-500" />
          <span className="text-sm font-medium text-ink-800">Baca Alkitab</span>
        </Link>
        <Link to="/komsel" className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white p-4 hover:bg-ink-100">
          <CalendarDays size={18} className="text-brand-500" />
          <span className="text-sm font-medium text-ink-800">Komsel Saya</span>
        </Link>
      </div>

      <AnnouncementsCard />

      <ChurchInfoSection />
    </div>
  )
}

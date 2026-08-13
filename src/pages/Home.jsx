import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, BookOpen, HeartHandshake, ChevronRight, Users, ShieldCheck, Flame, Lock, LockOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, SectionTitle, Badge } from '../components/ui'
import JourneyStepper from '../components/JourneyStepper'
import { announcements, journeyStages, MEMBERSHIP_ATTENDANCE_THRESHOLD } from '../data/mockData'
import { formatLongDate, formatShortDate, greetingForHour, TODAY } from '../utils/date'
import { computeAttendanceStats } from '../utils/attendance'

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

      <Card>
        <SectionTitle>Pengumuman</SectionTitle>
        <ul className="flex flex-col divide-y divide-ink-100">
          {announcements.map((a) => (
            <li key={a.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-ink-900">{a.title}</p>
                <Badge color="brand">{formatShortDate(a.date)}</Badge>
              </div>
              <p className="mt-1 text-sm text-ink-500">{a.body}</p>
            </li>
          ))}
        </ul>
      </Card>
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

export default function Home() {
  const { user, myCareGroup, materi } = useApp()

  if (user.role === 'super_admin') return <SuperAdminHome user={user} />

  const today = new Date(`${TODAY}T09:00:00`)
  const nextMeeting = myCareGroup.meetings.find((m) => m.date >= TODAY) ?? myCareGroup.meetings[0]
  const latestMateri = materi[0]
  const stageLabel = journeyStages.find((s) => s.id === user.journeyStageId)?.label
  const stats = computeAttendanceStats(myCareGroup.meetings, user.memberId)

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
              <Link to="/jadwal" className="flex items-center gap-1 text-xs font-medium text-brand-600">
                Lihat jadwal <ChevronRight size={14} />
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

      <Card>
        <SectionTitle
          action={
            <Link to="/komsel?tab=materi" className="flex items-center gap-1 text-xs font-medium text-brand-600">
              Semua materi <ChevronRight size={14} />
            </Link>
          }
        >
          Renungan Minggu Ini
        </SectionTitle>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <BookOpen size={18} />
          </span>
          <div>
            <p className="font-medium text-ink-900">{latestMateri.title}</p>
            <p className="text-xs text-ink-400">{latestMateri.verse}</p>
            <p className="mt-1 text-sm text-ink-500">{latestMateri.summary}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/doa" className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white p-4 hover:bg-ink-100">
          <HeartHandshake size={18} className="text-brand-500" />
          <span className="text-sm font-medium text-ink-800">Pokok Doa</span>
        </Link>
        <Link to="/komsel" className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white p-4 hover:bg-ink-100">
          <CalendarDays size={18} className="text-brand-500" />
          <span className="text-sm font-medium text-ink-800">Komsel Saya</span>
        </Link>
      </div>

      <Card>
        <SectionTitle>Pengumuman</SectionTitle>
        <ul className="flex flex-col divide-y divide-ink-100">
          {announcements.map((a) => (
            <li key={a.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-ink-900">{a.title}</p>
                <Badge color="brand">{formatShortDate(a.date)}</Badge>
              </div>
              <p className="mt-1 text-sm text-ink-500">{a.body}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

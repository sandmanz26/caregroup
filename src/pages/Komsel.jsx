import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Check, X, MapPin, CalendarDays, Users, Cake, UserPlus, TrendingUp, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, SectionTitle, Badge, Avatar, EmptyState } from '../components/ui'
import { TierStatusCard, TierLadderCard } from '../components/TierProgress'
import {
  cgGeneralInfo,
  cgRoleJobdesk,
  CG_MIN_MEMBERS,
  CG_MAX_MEMBERS,
  cgGrowthTiers,
  invitationTiers,
  roleProgressionStages,
  cgRoleToStageId,
} from '../data/mockData'
import {
  formatLongDate,
  formatShortDate,
  isPastMeeting,
  isAttendanceLocked,
  attendanceEditDeadline,
  daysUntilBirthday,
  TODAY,
} from '../utils/date'
import { computeTierStats } from '../utils/tiers'

const TABS = [
  { id: 'info', label: 'Info Umum' },
  { id: 'anggota', label: 'Anggota' },
  { id: 'kehadiran', label: 'Kehadiran' },
  { id: 'pertumbuhan', label: 'Pertumbuhanku' },
  { id: 'materi', label: 'Materi' },
]

function roleBadgeColor(role) {
  if (role === 'Leader' || role === 'Kandidat Leader') return 'brand'
  if (role === 'Calon Leader') return 'warn'
  if (role === 'Pengurus CG') return 'good'
  return 'ink'
}

function capacityStatus(count) {
  if (count < CG_MIN_MEMBERS) return { color: 'coklat', label: 'Kekurangan anggota' }
  if (count >= CG_MAX_MEMBERS) return { color: 'merah', label: 'Siap membelah' }
  return { color: 'good', label: 'Anggota cukup' }
}

function avgAttendanceStatus(group) {
  const past = group.meetings.filter((m) => isPastMeeting(m.date))
  if (past.length === 0 || group.members.length === 0) return null
  const totalSlots = past.length * group.members.length
  const totalPresent = past.reduce((sum, m) => sum + Object.values(m.attendance).filter(Boolean).length, 0)
  const pct = Math.round((totalPresent / totalSlots) * 100)
  const color = pct < 50 ? 'coklat' : pct < 80 ? 'hijaumuda' : 'good'
  return { pct, color }
}

function InfoUmumTab({ careGroups }) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>Apa itu Care Group?</SectionTitle>
        <p className="text-sm text-ink-600">{cgGeneralInfo.definition}</p>
      </Card>

      <Card>
        <SectionTitle>Aturan &amp; Penamaan</SectionTitle>
        <ul className="flex flex-col gap-2.5 text-sm text-ink-600">
          <li>{cgGeneralInfo.capacityRule}</li>
          <li>{cgGeneralInfo.namingRule}</li>
          <li>{cgGeneralInfo.trainingScheduleNote}</li>
        </ul>
      </Card>

      <Card>
        <SectionTitle>Cara Bergabung</SectionTitle>
        <ol className="flex flex-col gap-2 text-sm text-ink-600">
          {cgGeneralInfo.registrationSteps.map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-ink-400">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <SectionTitle>Jobdesk Peran</SectionTitle>
        <ul className="flex flex-col divide-y divide-ink-100">
          {cgRoleJobdesk.map((r) => (
            <li key={r.role} className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0">
              <span className="text-sm font-medium text-ink-900">{r.role}</span>
              <span className="text-sm text-ink-500">{r.desc}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionTitle>Daftar Care Group</SectionTitle>
        <ul className="flex flex-col divide-y divide-ink-100">
          {careGroups.map((g) => {
            const cap = capacityStatus(g.members.length)
            return (
              <li key={g.id} className="flex items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-ink-900">{g.code} &middot; {g.name}</p>
                  <p className="text-xs text-ink-400">Leader: {g.leaderName} &middot; {g.members.length} anggota</p>
                </div>
                <Badge color={cap.color}>{cap.label}</Badge>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}

function AnggotaTab({ careGroup }) {
  const upcoming = careGroup.members
    .filter((m) => m.birthDate)
    .map((m) => ({ ...m, daysUntil: daysUntilBirthday(m.birthDate) }))
    .filter((m) => m.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil)

  return (
    <div className="flex flex-col gap-4">
      {upcoming.length > 0 && (
        <Card>
          <SectionTitle>Ulang Tahun Terdekat</SectionTitle>
          <ul className="flex flex-col divide-y divide-ink-100">
            {upcoming.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <Avatar initials={m.initials} size="sm" />
                <span className="flex-1 text-sm text-ink-800">{m.name}</span>
                <span className="flex items-center gap-1 text-xs text-ink-400">
                  <Cake size={14} /> {m.daysUntil === 0 ? 'Hari ini' : `${m.daysUntil} hari lagi`}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Card>
        <SectionTitle>{careGroup.members.length} Anggota</SectionTitle>
        <ul className="flex flex-col divide-y divide-ink-100">
          {careGroup.members.map((m) => (
            <li key={m.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <Avatar initials={m.initials} />
              <span className="flex-1 text-sm font-medium text-ink-900">{m.name}</span>
              <Badge color={roleBadgeColor(m.role)}>{m.role}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

const KEHADIRAN_PAGE_SIZE = 2

function AbsentNote({ groupId, meetingId, memberId, note, canEdit }) {
  const { setAttendanceNote } = useApp()
  const [value, setValue] = useState(note || '')

  if (!canEdit) {
    return note ? <p className="ml-11 -mt-1.5 mb-2 text-xs italic text-ink-400">Keterangan: {note}</p> : null
  }

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => setAttendanceNote(groupId, meetingId, memberId, value)}
      onClick={(e) => e.stopPropagation()}
      placeholder="Keterangan (opsional, misal: Sakit)"
      className="ml-11 -mt-1.5 mb-2 w-[calc(100%-2.75rem)] rounded-md border border-ink-200 px-2.5 py-1.5 text-xs outline-none focus:border-brand-400"
    />
  )
}

function KehadiranTab({ careGroup, isLeader, toggleAttendance }) {
  const [visibleCount, setVisibleCount] = useState(KEHADIRAN_PAGE_SIZE)
  const [filterMemberId, setFilterMemberId] = useState('')
  const recentMeetings = [...careGroup.meetings].sort((a, b) => b.date.localeCompare(a.date))
  const visibleMeetings = recentMeetings.slice(0, visibleCount)
  const visibleMembers = filterMemberId ? careGroup.members.filter((m) => m.id === filterMemberId) : careGroup.members

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {isLeader && <p className="text-sm text-ink-400">Sentuh nama anggota untuk menandai kehadiran.</p>}
        <select
          value={filterMemberId}
          onChange={(e) => setFilterMemberId(e.target.value)}
          className="ml-auto rounded-md border border-ink-200 px-2 py-1.5 text-sm outline-none focus:border-brand-400"
        >
          <option value="">Semua anggota</option>
          {careGroup.members.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
      {recentMeetings.length === 0 && (
        <EmptyState title="Belum ada pertemuan" body="Pertemuan komsel akan muncul di sini." />
      )}
      {visibleMeetings.map((meeting) => {
        const hadirCount = Object.values(meeting.attendance).filter(Boolean).length
        const locked = isAttendanceLocked(meeting.date)
        const canEdit = isLeader && !locked
        return (
          <Card key={meeting.id}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-medium text-ink-900">{meeting.topic}</p>
                <p className="text-xs text-ink-400">{formatLongDate(meeting.date)}</p>
                {meeting.description && <p className="mt-1 text-sm text-ink-500">{meeting.description}</p>}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge color="ink">{hadirCount}/{careGroup.members.length} hadir</Badge>
                {isLeader && locked && (
                  <span className="flex items-center gap-1 text-[11px] text-ink-400">
                    <Lock size={12} /> Terkunci
                  </span>
                )}
              </div>
            </div>
            {isLeader && locked && (
              <p className="mt-2 text-xs text-ink-400">
                Batas edit kehadiran (14 hari) sudah lewat sejak {formatShortDate(attendanceEditDeadline(meeting.date))}.
              </p>
            )}
            <ul className="mt-3 flex flex-col divide-y divide-ink-100">
              {visibleMembers.map((m) => {
                const present = !!meeting.attendance[m.id]
                const Row = canEdit ? 'button' : 'div'
                return (
                  <li key={m.id}>
                    <Row
                      onClick={canEdit ? () => toggleAttendance(careGroup.id, meeting.id, m.id) : undefined}
                      className={`flex w-full items-center gap-3 py-2.5 text-left first:pt-0 last:pb-0 ${
                        canEdit ? 'cursor-pointer hover:bg-ink-50 rounded-md px-1 -mx-1' : ''
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
                        groupId={careGroup.id}
                        meetingId={meeting.id}
                        memberId={m.id}
                        note={meeting.attendanceNotes?.[m.id]}
                        canEdit={canEdit}
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

function PertumbuhanTab({ careGroup, user }) {
  const { invitations, addInvitation } = useApp()
  const [inviteName, setInviteName] = useState('')

  const attendedDates = careGroup.meetings.filter((m) => m.attendance[user.memberId]).map((m) => m.date)
  const growthStats = computeTierStats(attendedDates, cgGrowthTiers, TODAY)

  const myInvitations = invitations.filter((i) => i.memberId === user.memberId)
  const inviteStats = computeTierStats(myInvitations.map((i) => i.date), invitationTiers, TODAY)

  const myRole = careGroup.members.find((m) => m.id === user.memberId)?.role
  const myStageId = cgRoleToStageId[myRole] || 'member'
  const stageIndex = roleProgressionStages.findIndex((s) => s.id === myStageId)

  function handleInvite(e) {
    e.preventDefault()
    if (!inviteName.trim()) return
    addInvitation(inviteName)
    setInviteName('')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">Status Pertumbuhan</p>
        <div className="flex flex-col gap-4">
          <TierStatusCard
            icon={TrendingUp}
            total={growthStats.totalAllTime}
            unitLabel="kali hadir"
            caption="Total kehadiranmu di Care Group ini"
            stats={growthStats}
            tierUnit="x"
          />
          <TierLadderCard title="Tangga Pertumbuhan" tiers={cgGrowthTiers} stats={growthStats} unit="x" />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">Beranting</p>
        <div className="flex flex-col gap-4">
          <Card>
            <SectionTitle>Ajak Orang Baru</SectionTitle>
            <p className="mb-3 text-sm text-ink-500">Catat setiap orang yang berhasil kamu ajak bergabung ke Care Group.</p>
            <form onSubmit={handleInvite} className="flex gap-2">
              <input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Nama orang yang diajak"
                className="flex-1 rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                <UserPlus size={16} /> Tambah
              </button>
            </form>
            {myInvitations.length > 0 && (
              <ul className="mt-3 flex flex-col divide-y divide-ink-100">
                {myInvitations.map((i) => (
                  <li key={i.id} className="flex items-center justify-between py-2 text-sm first:pt-0">
                    <span className="text-ink-800">{i.invitedName}</span>
                    <span className="text-xs text-ink-400">{formatShortDate(i.date)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <TierStatusCard
            icon={UserPlus}
            total={inviteStats.totalAllTime}
            unitLabel="orang diajak"
            caption="Total orang yang sudah kamu ajak ikut Care Group"
            stats={inviteStats}
            tierUnit=" orang"
          />
          <TierLadderCard title="Tangga Beranting" tiers={invitationTiers} stats={inviteStats} unit=" orang" />
        </div>
      </div>

      <Card>
        <SectionTitle>Peningkatan Peran</SectionTitle>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
          {roleProgressionStages.map((s, i) => {
            const done = i < stageIndex
            const active = i === stageIndex
            return (
              <div key={s.id} className="flex min-w-[86px] flex-1 flex-col items-center gap-1.5 text-center">
                <div
                  className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                    done ? 'bg-good-500 text-white' : active ? 'bg-brand-500 text-white' : 'bg-ink-200 text-ink-500'
                  }`}
                >
                  {done ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-[11px] leading-tight ${active ? 'font-medium text-ink-900' : 'text-ink-400'}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-sm text-ink-500">
          Tahap saat ini: <span className="font-medium text-ink-800">{roleProgressionStages[stageIndex]?.label}</span>
        </p>
      </Card>
    </div>
  )
}

function MateriTab({ materi }) {
  return (
    <div className="flex flex-col gap-3">
      {materi.map((item) => (
        <Card key={item.id} className="p-0">
          <details className="group p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <div>
                <p className="text-xs text-ink-400">{item.week}</p>
                <p className="font-medium text-ink-900">{item.title}</p>
                <p className="text-xs text-brand-600">{item.verse}</p>
              </div>
              <span className="text-ink-400 transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-ink-600">{item.summary}</p>
            {item.questions.length > 0 && (
              <>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Pertanyaan diskusi
                </p>
                <ol className="mt-2 flex flex-col gap-2 text-sm text-ink-700">
                  {item.questions.map((q, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-ink-400">{i + 1}.</span>
                      {q}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </details>
        </Card>
      ))}
    </div>
  )
}

export default function Komsel() {
  const { myCareGroup, careGroups, user, toggleAttendance, materi } = useApp()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'info'
  const isLeader = user.role === 'admin' || user.role === 'super_admin'

  if (!myCareGroup) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Program Care Group</h1>
          <p className="mt-1 text-sm text-ink-400">
            {user.role === 'super_admin'
              ? 'Kelola komsel lewat Panel Admin.'
              : 'Kamu belum tergabung dengan Care Group. Berikut info umum sambil menunggu penempatan.'}
          </p>
        </div>
        <InfoUmumTab careGroups={careGroups} />
      </div>
    )
  }

  const careGroup = myCareGroup
  const capacity = capacityStatus(careGroup.members.length)
  const avgAtt = avgAttendanceStatus(careGroup)
  const pengurusCount = careGroup.members.filter((m) => m.role === 'Pengurus CG').length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{careGroup.category}</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">{careGroup.name}</h1>
      </div>

      <Card className="flex flex-col gap-2.5">
        {careGroup.quote && <p className="text-sm italic text-ink-600">&ldquo;{careGroup.quote}&rdquo;</p>}
        {careGroup.description && <p className="text-sm text-ink-600">{careGroup.description}</p>}
        <div className="flex items-center gap-2 text-sm text-ink-600">
          <Users size={16} className="text-ink-400" />
          Leader: <span className="font-medium text-ink-900">{careGroup.leaderName}</span>
          {pengurusCount > 0 && <span className="text-ink-400">&middot; {pengurusCount} pengurus</span>}
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-600">
          <CalendarDays size={16} className="text-ink-400" />
          {careGroup.meetingDay}, {careGroup.meetingTime} &middot; {careGroup.frequency}
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-600">
          <MapPin size={16} className="text-ink-400" />
          {careGroup.meetingLocation}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-ink-100 pt-2.5">
          <Badge color="ink">{careGroup.code}</Badge>
          <Badge color={capacity.color}>{capacity.label}</Badge>
          {avgAtt && <Badge color={avgAtt.color}>Kehadiran rata-rata {avgAtt.pct}%</Badge>}
        </div>
      </Card>

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

      {tab === 'info' && <InfoUmumTab careGroups={careGroups} />}
      {tab === 'anggota' && <AnggotaTab careGroup={careGroup} />}
      {tab === 'kehadiran' && (
        <KehadiranTab careGroup={careGroup} isLeader={isLeader} toggleAttendance={toggleAttendance} />
      )}
      {tab === 'pertumbuhan' && <PertumbuhanTab careGroup={careGroup} user={user} />}
      {tab === 'materi' && <MateriTab materi={materi} />}
    </div>
  )
}

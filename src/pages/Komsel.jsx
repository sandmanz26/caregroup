import { useSearchParams } from 'react-router-dom'
import { Check, X, MapPin, CalendarDays, Users } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, SectionTitle, Badge, Avatar, EmptyState } from '../components/ui'
import { formatLongDate, isWithinLastWeek } from '../utils/date'

const TABS = [
  { id: 'anggota', label: 'Anggota' },
  { id: 'kehadiran', label: 'Kehadiran' },
  { id: 'materi', label: 'Materi' },
]

function AllGroupsDirectory() {
  const { careGroups } = useApp()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Direktori Care Group</h1>
        <p className="mt-1 text-sm text-ink-400">Kelola komsel lewat Panel Admin.</p>
      </div>
      <div className="flex flex-col gap-3">
        {careGroups.map((g) => (
          <Card key={g.id}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-medium text-ink-900">{g.name}</p>
                <p className="text-xs text-ink-400">{g.category} &middot; Ketua: {g.leaderName}</p>
              </div>
              <Badge color="ink">{g.members.length} orang</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function Komsel() {
  const { myCareGroup, user, toggleAttendance, materi } = useApp()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'anggota'
  const isLeader = user.role === 'admin' || user.role === 'super_admin'

  if (!myCareGroup) return <AllGroupsDirectory />
  const careGroup = myCareGroup
  const recentMeetings = [...careGroup.meetings]
    .filter((m) => isWithinLastWeek(m.date))
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{careGroup.category}</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">{careGroup.name}</h1>
      </div>

      <Card className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-sm text-ink-600">
          <Users size={16} className="text-ink-400" />
          Leader: <span className="font-medium text-ink-900">{careGroup.leaderName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-600">
          <CalendarDays size={16} className="text-ink-400" />
          {careGroup.meetingDay}, {careGroup.meetingTime} &middot; {careGroup.frequency}
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-600">
          <MapPin size={16} className="text-ink-400" />
          {careGroup.meetingLocation}
        </div>
      </Card>

      <div className="flex gap-1 rounded-lg border border-ink-200 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setParams({ tab: t.id })}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-brand-500 text-white' : 'text-ink-500 hover:bg-ink-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'anggota' && (
        <Card>
          <SectionTitle>{careGroup.members.length} Anggota</SectionTitle>
          <ul className="flex flex-col divide-y divide-ink-100">
            {careGroup.members.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <Avatar initials={m.initials} />
                <span className="flex-1 text-sm font-medium text-ink-900">{m.name}</span>
                <Badge color={m.role === 'Leader' ? 'brand' : m.role === 'Pengurus CG' ? 'good' : 'ink'}>{m.role}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === 'kehadiran' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-400">
            Menampilkan kehadiran 1 minggu terakhir.
            {isLeader && ' Sentuh nama anggota untuk menandai kehadiran.'}
          </p>
          {recentMeetings.length === 0 && (
            <EmptyState title="Belum ada pertemuan minggu ini" body="Pertemuan komsel dalam 1 minggu terakhir akan muncul di sini." />
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
                  <Badge color="ink">{hadirCount}/{careGroup.members.length} hadir</Badge>
                </div>
                <ul className="mt-3 flex flex-col divide-y divide-ink-100">
                  {careGroup.members.map((m) => {
                    const present = !!meeting.attendance[m.id]
                    const Row = isLeader ? 'button' : 'div'
                    return (
                      <li key={m.id}>
                        <Row
                          onClick={isLeader ? () => toggleAttendance(careGroup.id, meeting.id, m.id) : undefined}
                          className={`flex w-full items-center gap-3 py-2.5 text-left first:pt-0 last:pb-0 ${
                            isLeader ? 'cursor-pointer hover:bg-ink-50 rounded-md px-1 -mx-1' : ''
                          }`}
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
                        </Row>
                      </li>
                    )
                  })}
                </ul>
              </Card>
            )
          })}
        </div>
      )}

      {tab === 'materi' && (
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
      )}
    </div>
  )
}

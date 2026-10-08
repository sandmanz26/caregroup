import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'
import BottomSheet from './BottomSheet'
import { RootIcon } from './icons'
import { announcements } from '../data/mockData'
import {
  TODAY,
  formatLongDate,
  formatShortDate,
  greetingForHour,
  daysUntilBirthday,
  isAttendanceLocked,
} from '../utils/date'

// Notifikasi diturunkan dari data yang sudah ada — tidak ada status "sudah dibaca".
function useNotifications() {
  const {
    user, myCareGroup, careGroups, renunganList, bibleReadingCheckins, serviceApplications,
    pendingRegistrations, transferRequests, events,
  } = useApp()
  const items = []

  if (user.role !== 'super_admin') {
    const today = renunganList[0]
    const done = today && bibleReadingCheckins.some((c) => c.userId === user.id && c.date === today.date)
    if (today && !done) {
      items.push({ id: 'tf', title: 'Temu Firman hari ini belum selesai', sub: `${today.title} · ${today.verse}`, to: '/temu-firman' })
    }
  }

  if (myCareGroup) {
    const next = myCareGroup.meetings.filter((m) => m.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date))[0]
    if (next) {
      items.push({ id: 'mt', title: `Pertemuan CG: ${next.topic}`, sub: `${formatShortDate(next.date)}, ${myCareGroup.meetingTime} · ${myCareGroup.meetingLocation}`, to: '/komsel' })
    }
    myCareGroup.members
      .filter((m) => m.birthDate && m.id !== user.memberId)
      .map((m) => ({ m, d: daysUntilBirthday(m.birthDate) }))
      .filter(({ d }) => d <= 7)
      .forEach(({ m, d }) => items.push({ id: `bd-${m.id}`, title: `${m.name} berulang tahun ${d === 0 ? 'hari ini' : `${d} hari lagi`}`, sub: 'Sampaikan ucapan di Care Group', to: '/komsel' }))
  }

  if (user.role === 'admin' && myCareGroup) {
    const incomplete = myCareGroup.meetings
      .filter((m) => m.date <= TODAY && !isAttendanceLocked(m.date))
      .filter((m) => Object.keys(m.attendance).length < myCareGroup.members.length)
      .sort((a, b) => b.date.localeCompare(a.date))[0]
    if (incomplete) {
      items.unshift({ id: 'att', title: 'Kehadiran belum lengkap', sub: `${incomplete.topic} (${formatShortDate(incomplete.date)}) — ${Object.keys(incomplete.attendance).length} dari ${myCareGroup.members.length} anggota`, to: '/admin?tab=kehadiran' })
    }
    const newApps = serviceApplications.filter((a) => a.careGroupId === myCareGroup.id && !a.reviewed).length
    if (newApps) items.push({ id: 'apps', title: `${newApps} pengajuan pelayanan baru`, sub: 'Tinjau di tab Pengajuan Pelayanan', to: '/admin?tab=pengajuan' })
    transferRequests
      .filter((r) => r.fromGroupId === myCareGroup.id && r.status !== 'menunggu')
      .forEach((r) => items.push({ id: `trl-${r.id}`, title: `Permintaan pindah ${r.memberName}: ${r.status}`, sub: `Ke ${r.toGroupName}`, to: '/admin' }))
  }

  if (user.role === 'jemaat') {
    transferRequests
      .filter((r) => r.memberId === user.memberId)
      .forEach((r) => items.push({ id: `tr-${r.id}`, title: r.status === 'menunggu' ? 'Permintaan pindah CG-mu sedang diproses Admin' : `Permintaan pindah CG-mu ${r.status}`, sub: `Ke ${r.toGroupName}` }))
  }

  if (user.role === 'super_admin') {
    if (pendingRegistrations.length) items.push({ id: 'reg', title: `${pendingRegistrations.length} pendaftar baru menunggu persetujuan`, sub: pendingRegistrations.map((p) => p.name).join(', '), to: '/admin?tab=user' })
    const waiting = transferRequests.filter((r) => r.status === 'menunggu')
    if (waiting.length) items.push({ id: 'trq', title: `${waiting.length} permintaan pindah CG dari Leader`, sub: waiting.map((r) => `${r.memberName} → ${r.toGroupName}`).join('; '), to: '/admin?tab=peserta' })
    const apps = serviceApplications.filter((a) => !a.reviewed).length
    if (apps) items.push({ id: 'apps', title: `${apps} pengajuan pelayanan belum ditinjau`, sub: 'Dari semua Care Group', to: '/admin?tab=pengajuan' })
  }

  if (user.role === 'coach') {
    events
      .filter((e) => e.category === 'Coaching' && e.date >= TODAY)
      .slice(0, 2)
      .forEach((e) => items.push({ id: `ev-${e.id}`, title: e.title, sub: `${formatShortDate(e.date)}, ${e.time} · ${e.location}`, to: '/jadwal' }))
    const mine = careGroups.filter((g) => g.coachId === user.id).length
    if (mine) items.push({ id: 'cg', title: `Kamu membina ${mine} Care Group`, sub: 'Buka Panel Pembinaan', to: '/admin' })
  }

  const a = announcements[0]
  if (a) items.push({ id: 'ann', title: `Pengumuman: ${a.title}`, sub: formatShortDate(a.date) })

  return items
}

// Sapaan di kiri atas; kanan atas: lonceng notifikasi, streak kehadiran komsel (logo akar), keluar.
// `streak` null → tombol streak disembunyikan (mis. Super Admin yang tidak punya Care Group).
export default function HomeHeader({ streak = null, streakDetail = '' }) {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const notifications = useNotifications()
  const [sheet, setSheet] = useState(null)
  const today = new Date(`${TODAY}T09:00:00`)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const iconBtn = 'relative flex size-10 shrink-0 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 hover:bg-ink-100'

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-ink-400">{formatLongDate(today.toISOString())}</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink-900">
            {greetingForHour(today.getHours())}, {user.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setSheet('notif')} aria-label="Notifikasi" className={iconBtn}>
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-brand-500 text-[11px] font-semibold text-white">
                {notifications.length}
              </span>
            )}
          </button>
          {streak != null && (
            <button
              type="button"
              onClick={() => setSheet('streak')}
              aria-label="Streak kehadiran komsel"
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 text-sm font-semibold text-brand-600 hover:bg-ink-100"
            >
              <RootIcon size={18} /> {streak}
            </button>
          )}
          <button type="button" onClick={() => setSheet('exit')} aria-label="Keluar aplikasi" className={iconBtn}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <BottomSheet open={sheet === 'notif'} onClose={() => setSheet(null)} title="Notifikasi">
        {notifications.length === 0 ? (
          <p className="text-sm text-ink-400">Belum ada notifikasi.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-ink-100">
            {notifications.map((n) => {
              const body = (
                <>
                  <p className="text-sm font-medium text-ink-900">{n.title}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{n.sub}</p>
                </>
              )
              return (
                <li key={n.id} className="py-3 first:pt-0 last:pb-0">
                  {n.to ? <Link to={n.to} onClick={() => setSheet(null)} className="block hover:opacity-80">{body}</Link> : body}
                </li>
              )
            })}
          </ul>
        )}
      </BottomSheet>

      <BottomSheet open={sheet === 'streak'} onClose={() => setSheet(null)} title="Streak kehadiran komsel">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <RootIcon size={26} />
          </span>
          <div>
            <p className="text-2xl font-semibold text-ink-900">
              {streak} <span className="text-sm font-normal text-ink-400">kali berturut-turut</span>
            </p>
            <p className="text-sm text-ink-500">{streakDetail}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-ink-600">
          Streak bertambah setiap kali kamu hadir di pertemuan Care Group secara berurutan, dan terputus kalau satu pertemuan terlewat.
        </p>
      </BottomSheet>

      <BottomSheet open={sheet === 'exit'} onClose={() => setSheet(null)} title="Keluar dari aplikasi?">
        <p className="text-sm text-ink-600">
          Kamu hanya keluar dari sesi ini. <strong>Data dan progresmu tetap tersimpan</strong> — masuk lagi kapan saja dengan Nomor WA dan kata sandimu.
        </p>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => setSheet(null)} className="flex-1 rounded-md border border-ink-200 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100">
            Batal
          </button>
          <button type="button" onClick={handleLogout} className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-brand-500 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <LogOut size={15} /> Keluar
          </button>
        </div>
      </BottomSheet>
    </>
  )
}


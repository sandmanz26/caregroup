// Shared helpers for the Shema hi-fi v3.1 generator. Data comes straight from src/ (copied via sed shim),
// so every number on the pages is computed by the same code the lo-fi app uses.
import * as D from './mockData.mjs'
import { TODAY, formatLongDate, formatShortDate, formatBirthDate, daysUntilBirthday, isPastMeeting, isAttendanceLocked, attendanceEditDeadline, greetingForHour } from './date.mjs'
import { computeTierStats } from './tiers.mjs'
import { computeReadingStats } from './reading.mjs'
import { computeAttendanceStats } from './attendance.mjs'
import { computeServiceRecap } from './pelayanan.mjs'

export { D, TODAY, formatLongDate, formatShortDate, formatBirthDate, daysUntilBirthday, isPastMeeting, isAttendanceLocked, attendanceEditDeadline, greetingForHour, computeTierStats, computeReadingStats, computeAttendanceStats, computeServiceRecap }

export const LUCIDE = 'https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js'

/* ---------- small primitives ---------- */
export const ic = (name, cls = '') => `<i data-lucide="${name}"${cls ? ` class="${cls}"` : ''}></i>`

export const ROOT_SVG = (size = 18) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 12V6"/><path d="M12 8c0-3 2-5 6-5 0 4-2 6-6 5z"/><path d="M12 9.5c0-2-1.5-3.5-4.5-3.5C7.5 9 9 10.5 12 9.5z"/><path d="M12 12c0 3-2 4.5-5 5.5"/><path d="M12 12c0 3 2 4.5 5 5.5"/><path d="M12 12v9"/><path d="M7 17.5 5 20M17 17.5l2 2.5"/></svg>`

const AV = ['blue', 'green', 'orange', 'purple', 'teal', 'red']
export function avColor(name) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997
  return AV[h % AV.length]
}
export const initialsOf = (name) => name.replace(/^Pdt\.\s*/, '').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
export const avatar = (name, size = 'md', initials) => `<span class="avatar av-${size} av-${avColor(name)}">${initials || initialsOf(name)}</span>`
export const badge = (color, text, icon) => `<span class="badge b-${color}">${icon ? ic(icon) : ''}${text}</span>`
export const card = (inner, cls = '') => `<div class="card ${cls}" data-reveal>${inner}</div>`
export const sectionTitle = (text, action = '') => `<div class="section-title"><span>${text}</span>${action}</div>`
export const icoSq = (icon, grad, sm = false) => `<span class="ico-sq g-${grad}${sm ? ' sm' : ''}">${ic(icon)}</span>`

// tier color name (from data) → badge color
export const tierBadge = { hijau: 'green', kuning: 'orange', merah: 'red', coklat: 'coklat' }
// lo-fi Badge color keys → hi-fi badge colors
export const mapColor = { brand: 'blue', good: 'green', warn: 'orange', ink: 'ink', merah: 'red', coklat: 'coklat', hijaumuda: 'green' }

export const windowLabel = (d) => ({ 30: 'sebulan', 90: '3 bulan', 180: '6 bulan', 365: '1 tahun', 1095: '3 tahun' }[d] || `${d} hari`)

/* ---------- accounts (same as demoUsers in src) ---------- */
export const U = {
  member: { ...D.demoUsers[0], first: 'Calvin', roleKey: 'jemaat' },
  leader: { ...D.demoUsers[1], first: 'Andra', roleKey: 'admin' },
  super: { ...D.demoUsers[2], first: 'Pdt.', roleKey: 'super_admin' },
  coach: { ...D.demoUsers[3], first: 'Pdt.', roleKey: 'coach' },
  // kondisi khusus: akun baru yang belum ditempatkan ke Care Group
  newbie: { id: 'u_new', name: 'Mira Anggraini', initials: 'MA', phone: '0812-5555-7777', role: 'jemaat', roleKey: 'jemaat', journeyStageId: 'newcomer', careGroupId: null, memberId: null, first: 'Mira' },
}
export const CG1 = D.careGroupsSeed[0]
export const homeHref = { member: 'member-home.html', leader: 'leader-home.html', super: 'super-admin-home.html', coach: 'coach-home.html', newbie: 'member-home-nogroup.html' }

/* ---------- navigation (mirrors AppShell.jsx) ---------- */
const BASE_NAV = [
  ['home', 'Home', 'house', null],
  ['komsel', 'Program CG', 'users', 'program-cg.html'],
  ['temu', 'Temu Firman', 'book-open-text', 'temu-firman.html'],
  ['presensi', 'Presensi', 'hand-helping', 'presensi.html'],
  ['jadwal', 'Jadwal', 'calendar-days', 'jadwal.html'],
  ['doa', 'Doa', 'heart-handshake', 'doa.html'],
  ['profil', 'Profil', 'circle-user', 'profil.html'],
]
export function navFor(role) {
  const home = homeHref[role === 'newbie' ? 'newbie' : role]
  const adminHref = { leader: 'leader-admin.html', super: 'super-admin-admin.html', coach: 'coach-admin.html' }[role]
  let list = BASE_NAV.map(([id, label, icon, href]) => ({ id, label, icon, href: href || home }))
  if (role === 'member' || role === 'newbie') list = list.filter((n) => !['jadwal', 'doa'].includes(n.id))
  if (role === 'leader') list = [...list.filter((n) => n.id !== 'doa'), { id: 'admin', label: 'Admin', icon: 'shield-check', href: adminHref }]
  if (role === 'super' || role === 'coach') list = [...list, { id: 'admin', label: 'Admin', icon: 'shield-check', href: adminHref }]
  if (role === 'leader') list = list.map((n) => (n.id === 'komsel' ? { ...n, href: 'program-cg-leader.html' } : n))
  // pages without a group-specific Program CG share the info-only page
  if (role === 'super' || role === 'coach' || role === 'newbie') list = list.map((n) => (n.id === 'komsel' ? { ...n, href: 'program-cg-info.html' } : n))
  return list
}
const roleName = { member: 'Anggota', leader: 'Ketua Komsel', super: 'Super Admin', coach: 'Coach', newbie: 'Anggota' }

/* ---------- tab bar: maksimal 5 tab (konvensi aplikasi mobile / React Navigation) ---------- */
export function tabsFor(role) {
  const all = navFor(role)
  const pick = (ids) => ids.map((id) => all.find((n) => n.id === id)).filter(Boolean)
  if (role === 'member' || role === 'newbie') return pick(['home', 'komsel', 'temu', 'presensi', 'profil'])
  return pick(['home', 'komsel', 'temu', 'admin', 'profil'])
}
const SHORT = { 'Program CG': 'Care Group', 'Temu Firman': 'Firman' }
const STATUS = `<div class="statusbar"><span class="sb-time">9:41</span><span class="sb-island"></span><span class="sb-icons"><svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="6" rx="1"/><rect x="10" y="2.5" width="3" height="8.5" rx="1"/><rect x="15" y="0" width="3" height="11" rx="1"/></svg><svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .4 10.4 10.4 0 0 0 .8 3.3L2 4.6a8.6 8.6 0 0 1 6-2.4zm0 3.6c1.3 0 2.5.5 3.4 1.3L12.6 6a6.6 6.6 0 0 0-9.2 0l1.2 1.1C5.5 6.3 6.7 5.8 8 5.8zm0 3.5 1.9-1.9a2.7 2.7 0 0 0-3.8 0z"/></svg><span class="sb-batt"><i></i></span></span></div>`
const head = (title) => `<!doctype html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="theme-color" content="#0A2766" />
<title>${title} · Shema</title>
<link rel="icon" type="image/png" href="assets/logo-shema.png" />
<link rel="stylesheet" href="assets/styles.css" />
<script src="${LUCIDE}"></script>
<script defer src="assets/app.js"></script>
</head>`
const stageAside = (title) => `<aside class="stage-info"><a href="index.html" class="stage-back">← Semua layar</a><img src="assets/logo-shema.png" alt="" /><div class="stage-title">${title}</div><p>Pratinjau aplikasi mobile Shema (target React Native). Ketuk elemen di dalam ponsel seperti di aplikasi asli.</p></aside>`

/* shell: layar aplikasi di dalam bingkai ponsel (desktop) — penuh layar di ponsel sungguhan.
   back = { href, label } → app bar native dengan tombol kembali (layar tumpukan, tanpa tab bar aktif). */
export function shell({ role, active, title, body, sheets = '', back = null, navTitle = '' }) {
  const tabs = tabsFor(role)
  const bar = tabs.map((n) => `<a class="tab${n.id === active ? ' active' : ''}" href="${n.href}">${ic(n.icon)}<span>${SHORT[n.label] || n.label}</span></a>`).join('')
  const appbar = back
    ? `<header class="appbar"><a class="appbar-back" href="${back.href}" aria-label="Kembali">${ic('chevron-left')}<span>${back.label}</span></a><div class="appbar-title">${navTitle || title}</div><span class="appbar-spacer"></span></header>`
    : ''
  return `${head(title)}
<body class="has-stage">
<div class="stage">
  ${stageAside(title)}
  <div class="device">
    ${STATUS}
    ${appbar}
    <main class="screen${back ? ' with-appbar' : ''}"><div class="main-inner">
${body}
    </div></main>
    <nav class="tabbar">${bar}</nav>
    <div class="home-indicator"></div>
    ${sheets}
  </div>
</div>
</body>
</html>
`
}

export function authShell({ title, body }) {
  return `${head(title)}
<body class="has-stage">
<div class="stage">
  ${stageAside(title)}
  <div class="device auth-device">
    ${STATUS}
    <main class="screen no-tabs">
${body}
    </main>
    <div class="home-indicator"></div>
  </div>
</div>
</body>
</html>
`
}

/* ---------- bottom sheet ---------- */
export const sheet = (id, title, body, lg = false) => `
<div class="sheet-overlay" id="${id}" style="display:none">
  <div class="sheet${lg ? ' lg' : ''}">
    <div class="sheet-handle"></div>
    <button class="icon-btn sheet-close" data-close-sheet aria-label="Tutup">${ic('x')}</button>
    <h3 style="font-size:19px;margin-bottom:16px;padding-right:44px">${title}</h3>
    ${body}
  </div>
</div>`

/* ---------- shortcut grid (ikon bulat berwarna) ---------- */
export function shortcuts(items, cols = 4) {
  return `<div class="card" data-reveal><div class="shortcuts${cols === 3 ? ' cols-3' : ''}">${items
    .map((i) => {
      const inner = `<span class="sc-ico g-${i.grad}">${ic(i.icon)}${i.pip ? `<span class="pip">${i.pip}</span>` : ''}</span><span>${i.label}</span>`
      if (i.sheet) return `<button type="button" class="shortcut" data-open-sheet="${i.sheet}">${inner}</button>`
      return `<a class="shortcut" href="${i.href}">${inner}</a>`
    })
    .join('')}</div>${cols === 3 && false ? '' : ''}</div>`
}

/* ---------- notifications (mirrors HomeHeader.useNotifications) ---------- */
const eventsAll = D.eventsSeed
const announcements = D.announcements
function todayDone(userId) {
  return D.bibleReadingCheckinSeed.some((c) => c.userId === userId && c.date === D.renunganHarianSeed[0].date)
}
export function notificationsFor(role) {
  const u = U[role]
  const items = []
  const today = D.renunganHarianSeed[0]
  const cg = role === 'member' || role === 'leader' ? CG1 : null
  if (role !== 'super' && !todayDone(u.id)) items.push({ title: 'Temu Firman hari ini belum selesai', sub: `${today.title} · ${today.verse}`, to: 'temu-firman.html' })
  if (cg) {
    const next = cg.meetings.filter((m) => m.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date))[0]
    if (next) items.push({ title: `Pertemuan CG: ${next.topic}`, sub: `${formatShortDate(next.date)}, ${cg.meetingTime} · ${cg.meetingLocation}`, to: role === 'leader' ? 'program-cg-leader.html' : 'program-cg.html' })
    cg.members
      .filter((m) => m.birthDate && m.id !== u.memberId)
      .map((m) => ({ m, d: daysUntilBirthday(m.birthDate) }))
      .filter(({ d }) => d <= 7)
      .forEach(({ m, d }) => items.push({ title: `${m.name} berulang tahun ${d === 0 ? 'hari ini' : `${d} hari lagi`}`, sub: 'Sampaikan ucapan di Care Group', to: role === 'leader' ? 'program-cg-leader.html' : 'program-cg.html' }))
  }
  if (role === 'leader') {
    const inc = CG1.meetings
      .filter((m) => m.date <= TODAY && !isAttendanceLocked(m.date))
      .filter((m) => Object.keys(m.attendance).length < CG1.members.length)
      .sort((a, b) => b.date.localeCompare(a.date))[0]
    if (inc) items.unshift({ title: 'Kehadiran belum lengkap', sub: `${inc.topic} (${formatShortDate(inc.date)}) — ${Object.keys(inc.attendance).length} dari ${CG1.members.length} anggota`, to: 'leader-admin.html#kehadiran' })
    const n = D.serviceApplicationSeed.filter((a) => a.careGroupId === CG1.id && !a.reviewed).length
    if (n) items.push({ title: `${n} pengajuan pelayanan baru`, sub: 'Tinjau di tab Pengajuan Pelayanan', to: 'leader-admin.html#pengajuan' })
  }
  if (role === 'super') {
    const pend = D.pendingRegistrationSeed
    if (pend.length) items.push({ title: `${pend.length} pendaftar baru menunggu persetujuan`, sub: pend.map((p) => p.name).join(', '), to: 'super-admin-admin.html#user' })
    const apps = D.serviceApplicationSeed.filter((a) => !a.reviewed).length
    if (apps) items.push({ title: `${apps} pengajuan pelayanan belum ditinjau`, sub: 'Dari semua Care Group', to: 'super-admin-admin.html#pengajuan' })
  }
  if (role === 'coach') {
    eventsAll.filter((e) => e.category === 'Coaching' && e.date >= TODAY).slice(0, 2).forEach((e) => items.push({ title: e.title, sub: `${formatShortDate(e.date)}, ${e.time} · ${e.location}`, to: 'jadwal.html' }))
    const mine = D.careGroupsSeed.filter((g) => g.coachId === u.id).length
    if (mine) items.push({ title: `Kamu membina ${mine} Care Group`, sub: 'Buka Panel Pembinaan', to: 'coach-admin.html' })
  }
  const a = announcements[0]
  if (a) items.push({ title: `Pengumuman: ${a.title}`, sub: formatShortDate(a.date) })
  return items
}

/* ---------- Home header (sapaan · lonceng · streak akar · keluar) ---------- */
export function homeHeader(role, streak = null, streakDetail = '') {
  const u = U[role]
  const n = notificationsFor(role).length
  const hh = 9
  return `
<div class="home-header" data-reveal>
  <div class="hh-top">
    <div class="hh-greet">
      <small>${formatLongDate(TODAY)}</small>
      <strong>${greetingForHour(hh)}, ${u.name.startsWith('Pdt.') ? 'Pdt. ' + u.name.split(' ')[1] : u.first}</strong>
      <span class="hh-meta">GKI Gejayan · Tim Sumber Daya Aktifis</span>
    </div>
    <div class="hh-actions">
      <button class="hh-btn" data-open-sheet="sh-notif" aria-label="Notifikasi">${ic('bell')}${n ? `<span class="count">${n}</span>` : ''}</button>
      ${streak != null ? `<button class="hh-btn streak" data-open-sheet="sh-streak" aria-label="Streak kehadiran komsel">${ROOT_SVG(18)}${streak}</button>` : ''}
      <button class="hh-btn" data-open-sheet="sh-exit" aria-label="Keluar aplikasi">${ic('log-out')}</button>
    </div>
  </div>
</div>`
}

export const exitSheet = () => sheet(
  'sh-exit',
  'Keluar dari aplikasi?',
  `<p class="text-sm">Kamu hanya keluar dari sesi ini. <strong>Data dan progresmu tetap tersimpan</strong> — masuk lagi kapan saja dengan Nomor WA dan kata sandimu.</p>
   <div class="flex gap-2" style="margin-top:18px"><button class="btn btn-ghost flex-1" data-close-sheet>Batal</button><a class="btn btn-primary flex-1" href="login.html">${ic('log-out')} Keluar</a></div>`
)

export function homeSheets(role, streak = null, streakDetail = '') {
  const items = notificationsFor(role)
  const notif = items.length
    ? items
        .map((i) => {
          const inner = `<div style="flex:1;min-width:0"><div class="n-title">${i.title}</div><div class="n-sub">${i.sub}</div></div>${i.to ? ic('chevron-right', 'chev') : ''}`
          return i.to ? `<a class="notif" href="${i.to}">${inner}</a>` : `<div class="notif">${inner}</div>`
        })
        .join('')
    : '<p class="muted text-sm">Belum ada notifikasi.</p>'
  return (
    sheet('sh-notif', 'Notifikasi', `<div>${notif}</div>`) +
    (streak != null
      ? sheet(
          'sh-streak',
          'Streak kehadiran komsel',
          `<div class="flex items-center gap-4"><span class="ico-sq g-orange" style="width:60px;height:60px;border-radius:50%">${ROOT_SVG(28)}</span><div><div style="font-size:30px;font-weight:800;color:var(--navy-900);line-height:1.1">${streak} <span class="text-sm muted" style="font-weight:600">kali berturut-turut</span></div><div class="text-sm muted">${streakDetail}</div></div></div>
           <p class="text-sm" style="margin-top:14px">Streak bertambah setiap kali kamu hadir di pertemuan Care Group secara berurutan, dan terputus kalau satu pertemuan terlewat.</p>`
        )
      : '') +
    exitSheet()
  )
}

/* ---------- Temu Firman card (Home) ---------- */
export function temuFirmanCard(role, { floating = true } = {}) {
  const t = D.renunganHarianSeed[0]
  const done = todayDone(U[role].id)
  return `
<div class="${floating ? 'float-card' : 'card'}" data-reveal${floating ? '' : ''}>
  <div class="tf-body">
    <div class="tf-label"><span class="dot">${ic('book-open-text')}</span>Temu Firman · Word Encounter</div>
    <div class="row-title" style="font-size:16px">${t.title}</div>
    <p class="scripture" style="font-size:16px;margin-top:6px">&ldquo;${t.verseText}&rdquo;</p>
    <div class="ref">${t.verse}</div>
  </div>
  <div class="tf-cta">
    ${done ? `<span class="status-ok">${ic('circle-check-big')} Sudah selesai hari ini</span>` : `<span class="text-sm muted" style="max-width:190px;text-align:right">Ketuk untuk membaca ayat &amp; renungan, lalu tandai selesai.</span>`}
    <a class="btn btn-primary btn-sm" href="temu-firman.html">Buka ${ic('chevron-right')}</a>
  </div>
</div>`
}

/* ---------- Faithful Journey ---------- */
const TIERS = { rooted: D.readingTiers, branching: D.invitationTiers, growing: D.cgGrowthTiers }
const UNIT = { rooted: 'hari', branching: 'orang', growing: 'kali hadir' }
export function journeyProgress(role) {
  const u = U[role]
  const reading = computeReadingStats(D.bibleReadingCheckinSeed, u.id)
  const cg = u.memberId ? CG1 : null
  const attended = cg ? cg.meetings.filter((m) => m.attendance[u.memberId]).map((m) => m.date) : []
  const growing = computeTierStats(attended, D.cgGrowthTiers)
  const branching = computeTierStats(D.invitationSeed.filter((i) => i.memberId === u.memberId).map((i) => i.date), D.invitationTiers)
  const myRole = cg?.members.find((m) => m.id === u.memberId)?.role
  const stageIndex = Math.max(0, D.roleProgressionStages.findIndex((s) => s.id === (D.cgRoleToStageId[myRole] || 'member')))
  const fromTier = (stats, unit) => {
    const next = stats.nextTier
    const label = stats.currentTier ? stats.currentTier.label : 'Belum dimulai'
    const pct = next ? Math.min(100, Math.round((stats.nextTierCount / next.threshold) * 100)) : 100
    return { stats, pct, meta: next ? `${label} · ${stats.nextTierCount}/${next.threshold} ${unit}` : `${label} ✓` }
  }
  return {
    rooted: fromTier(reading, UNIT.rooted),
    branching: fromTier(branching, UNIT.branching),
    growing: fromTier(growing, UNIT.growing),
    fruitful: { stageIndex, pct: Math.round((stageIndex / (D.roleProgressionStages.length - 1)) * 100), meta: `Tahap ${stageIndex + 1} dari ${D.roleProgressionStages.length} · ${D.roleProgressionStages[stageIndex].label}` },
  }
}
export function tierList(tiers, stats, unit) {
  return `<div class="ladder">${[...tiers].reverse().map((t) => {
    const ach = stats.currentTier && tiers.indexOf(t) >= tiers.indexOf(stats.currentTier)
    return `<div class="ladder-row${ach ? ' got' : ''}"><span class="nm">${t.label}</span><span class="flex items-center"><span class="th">${t.threshold} ${unit} / ${windowLabel(t.windowDays)}</span>${ach ? badge(tierBadge[t.color], 'Tercapai') : badge('ink', '–')}</span></div>`
  }).join('')}</div>`
}
export function journeyGrid(role, reveal = true) {
  const p = journeyProgress(role)
  return `<div class="journey-row"${reveal ? ' data-reveal' : ''}>${D.faithfulJourneys.map((j) => `
  <button type="button" class="j-card jc-${j.id}" data-open-sheet="sh-j-${j.id}">
    <img src="assets/journey-${j.id}.svg" alt="${j.en}" />
    <div class="j-name">${j.emoji} ${j.name.replace('Perjalanan ', '')}</div>
    <div class="j-en">${j.en}</div>
    <div class="progress-track"><div class="progress-fill" style="width:${p[j.id].pct}%"></div></div>
    <div class="j-meta">${p[j.id].meta}</div>
  </button>`).join('')}</div>`
}
export function journeySheets(role) {
  const p = journeyProgress(role)
  return D.faithfulJourneys.map((j) => {
    const pj = p[j.id]
    const ladder = j.id === 'fruitful'
      ? `<div class="ladder">${D.roleProgressionStages.map((s, i) => `<div class="ladder-row${i <= pj.stageIndex ? ' got' : ''}"><span class="nm">${s.label}</span>${i < pj.stageIndex ? badge('green', 'Terlewati') : i === pj.stageIndex ? badge('blue', 'Sekarang') : badge('ink', '–')}</div>`).join('')}</div>`
      : tierList(TIERS[j.id], pj.stats, UNIT[j.id])
    return sheet(`sh-j-${j.id}`, `${j.emoji} ${j.name}`, `
      <div class="journey-hero"><img src="assets/journey-${j.id}.svg" alt="${j.en}" /><div><div class="row-title" style="font-size:16px">${j.en}</div><div class="text-sm muted">Kesan: ${j.kesan}</div><div class="text-sm" style="margin-top:6px;font-weight:700;color:var(--blue-600)">${pj.meta}</div></div></div>
      <p class="text-sm">${j.source}</p>
      <div class="chip-title" style="margin-top:18px">Tangga perjalanan</div>
      ${ladder}`)
  }).join('')
}
export const journeySection = (role, hint = '') => `
<div data-reveal><div class="chip-title">Faithful Journey${hint ? ` <span style="text-transform:none;letter-spacing:0;font-weight:500;color:var(--ink-400)">· ${hint}</span>` : ''}</div>${journeyGrid(role)}</div>`

/* ---------- Journey stepper (Perjalanan Pelayanan) ---------- */
export function stepper(stageId) {
  const cur = D.journeyStages.findIndex((s) => s.id === stageId)
  return `<div class="stepper">${D.journeyStages.map((s, i) => `<div class="step${i < cur ? ' done' : i === cur ? ' active' : ''}"><div class="step-dot">${i < cur ? ic('check') : i + 1}</div><div class="step-label">${s.label}</div></div>`).join('')}</div>`
}
export function roleStepper(idx) {
  return `<div class="stepper">${D.roleProgressionStages.map((s, i) => `<div class="step${i < idx ? ' done' : i === idx ? ' active' : ''}"><div class="step-dot">${i < idx ? ic('check') : i + 1}</div><div class="step-label">${s.label}</div></div>`).join('')}</div>`
}

/* ---------- Pengumuman, Contact, Q&A, Kegiatan ---------- */
const picsum = (seed, w = 480, h = 320) => `https://picsum.photos/seed/${seed}/${w}/${h}`
export const gallery = (images, key) => images && images.length
  ? `<div class="hscroll" style="margin-bottom:14px">${images.map((im, i) => `<div class="photo-card" style="width:230px;height:160px"><img src="${picsum(`${key}${i}`)}" alt="" loading="lazy" onerror="this.remove()" /><div class="cap">${im.caption}${images.length > 1 ? ` · ${i + 1}/${images.length}` : ''}</div></div>`).join('')}</div>`
  : ''
export function announcementsCard() {
  const list = announcements.map((a) => `
    <button type="button" class="row row-clickable" data-open-sheet="sh-ann-${a.id}" style="width:100%;background:none;border:none;text-align:left;align-items:flex-start;font:inherit;color:inherit">
      <div class="flex-1"><div class="row-title">${a.title}</div><div class="row-sub" style="margin-top:3px">${a.body.length > 110 ? a.body.slice(0, 108) + '…' : a.body}</div></div>
      ${badge('blue', formatShortDate(a.date))}
    </button>`).join('')
  return `<div class="card" data-reveal>${sectionTitle('Pengumuman')}<div class="row-list">${list}</div></div>`
}
export const announcementSheets = () => announcements.map((a) => sheet(`sh-ann-${a.id}`, a.title, `<p class="text-sm muted" style="margin-bottom:12px">${formatLongDate(a.date)}</p>${gallery(a.images, a.id)}<p class="text-sm">${a.body}</p>`)).join('')

export const QA = [
  ['Bagaimana cara mengubah data diriku?', 'Nama, alamat, universitas, dan tanggal lahir bisa kamu ubah sendiri lewat Profil → ikon pengaturan. Untuk data yang tidak bisa diubah sendiri (misalnya Nomor WA yang dipakai masuk), sampaikan ke Leader CG-mu, lalu Leader menyampaikannya ke Admin.'],
  ['Bagaimana cara pindah Care Group?', 'Sampaikan keinginanmu kepada Leader CG-mu. Leader meneruskannya ke Admin Utama, lalu Admin yang mengubah keanggotaanmu ke CG yang baru.'],
]
export const qaCard = () => `<div class="card qa" id="qa" data-reveal>${sectionTitle('Q&amp;A')}${QA.map(([q, a]) => `<details><summary>${q}</summary><div class="ans">${a}</div></details>`).join('')}</div>`
const phoneRow = (name, role, phone) => `<div class="row"><div class="flex-1"><div class="row-title">${name}</div><div class="row-sub">${role}</div></div><a class="link flex items-center gap-1 text-sm" href="tel:${phone}">${ic('phone')} ${phone}</a></div>`
export function churchInfo() {
  const leader = CG1.members.find((m) => m.role === 'Leader')
  const photos = CG1.activityPhotos
  return `
<div class="card" data-reveal style="padding:16px 20px"><div class="flex items-center justify-between"><div class="flex items-center gap-3">${icoSq('newspaper', 'slate', true)}<span class="row-title">Warta Jemaat</span></div>${badge('ink', 'Segera hadir')}</div></div>
<div class="card" data-reveal>${sectionTitle('Contact Us')}<div class="row-list">${phoneRow(leader.name, 'Leader Care Group Kamu', leader.phone)}${D.churchContacts.map((c) => phoneRow(c.name, c.role, c.phone)).join('')}</div></div>
${qaCard()}
<div class="card" data-reveal>${sectionTitle('Kegiatan CG Terbaru')}<div class="hscroll">${photos.map((p) => `<div class="photo-card"><img src="${picsum(p.id)}" alt="" loading="lazy" onerror="this.remove()" /><div class="cap">${p.caption}<br><span style="opacity:.8">${formatShortDate(p.date)}</span></div></div>`).join('')}</div></div>`
}

/* ---------- page hero (halaman dalam) ---------- */
export const pageHero = ({ eyebrow, title, sub = '', right = '' }) => `
<div class="page-hero" data-reveal><div><div class="hero-eyebrow">${eyebrow}</div><h1>${title}</h1>${sub ? `<p class="hero-sub">${sub}</p>` : ''}</div>${right}</div>`

export const emptyState = (title, body) => `<div class="empty-state"><div class="title">${title}</div><div class="body">${body}</div></div>`
export const field = (label, control, hint = '') => `<div class="field"><label>${label}</label>${control}${hint ? `<span class="hint">${hint}</span>` : ''}</div>`
export const input = (value = '', ph = '', extra = '') => `<input class="input" value="${value}" placeholder="${ph}" ${extra} />`
export const textarea = (value = '', ph = '', rows = 3) => `<textarea class="input" rows="${rows}" placeholder="${ph}">${value}</textarea>`
export const select = (opts, selected = '', ph = '') => `<select class="input">${ph ? `<option value="" disabled ${selected ? '' : 'selected'}>${ph}</option>` : ''}${opts.map((o) => (Array.isArray(o) ? `<option value="${o[0]}"${o[0] === selected ? ' selected' : ''}>${o[1]}</option>` : `<option${o === selected ? ' selected' : ''}>${o}</option>`)).join('')}</select>`
export const tabs = (group, list, activeId, count = {}) => `<div class="tab-bar" data-tabs="${group}">${list.map(([id, label]) => `<button class="tab-btn${id === activeId ? ' active' : ''}" data-tab-btn="${id}">${label}${count[id] ? `<span class="b-count">${count[id]}</span>` : ''}</button>`).join('')}</div>`
export const panel = (group, id, inner, activeId) => `<div class="tab-panel${id === activeId ? ' active' : ''}" data-tab-panel="${id}" data-tabs-for="${group}">${inner}</div>`

export const roleBadge = (role) => badge(mapColor[{ Leader: 'brand', 'Kandidat Leader': 'brand', 'Calon Leader': 'warn', 'Pengurus CG': 'good' }[role] || 'ink'], role)
export const roleLabelsMap = D.roleLabels
export const sectionHeading = (t) => `<div class="chip-title" data-reveal>${t}</div>`

/* ---------- coverage cards (Statistik) ---------- */
export function summarizeTierCoverage(members, tiers, getDates) {
  let eligible = 0, atLeastOne = 0
  const counts = Object.fromEntries(tiers.map((t) => [t.id, 0]))
  members.forEach((m) => {
    const dates = getDates(m)
    if (dates === null) return
    eligible++
    const s = computeTierStats(dates, tiers)
    if (s.currentTier) { atLeastOne++; counts[s.currentTier.id]++ }
  })
  return { eligible, atLeastOne, counts }
}
export function coverageCard({ icon, grad, title, coverage, tiers, totalMembers, scopeNote }) {
  return card(`${sectionTitle(title)}
  <div class="flex items-center gap-3">${icoSq(icon, grad)}<p class="text-sm" style="color:var(--ink-700)"><strong style="color:var(--navy-900);font-size:18px">${coverage.atLeastOne}</strong> dari ${coverage.eligible} anggota${coverage.eligible < totalMembers ? ` (dari ${totalMembers} total)` : ''} sudah mencapai minimal satu tingkat.</p></div>
  ${coverage.atLeastOne > 0 ? `<div class="flex wrap gap-1" style="margin-top:12px">${tiers.filter((t) => coverage.counts[t.id] > 0).map((t) => badge(tierBadge[t.color], `${t.label}: ${coverage.counts[t.id]}`)).join('')}</div>` : ''}
  ${scopeNote ? `<p class="hint" style="margin-top:10px">${scopeNote}</p>` : ''}`)
}
export const accounts = D.demoUsers

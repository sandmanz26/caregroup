import {
  D, TODAY, U, CG1, ic, ROOT_SVG, avatar, badge, card, sectionTitle, icoSq, shell, authShell, sheet, shortcuts,
  homeHeader, homeSheets, temuFirmanCard, journeySection, journeySheets, journeyProgress, stepper, roleStepper, announcementsCard, announcementSheets,
  churchInfo, pageHero, emptyState, field, input, textarea, select, roleBadge, mapColor, tierBadge, formatLongDate, formatShortDate, formatBirthDate,
  daysUntilBirthday, isPastMeeting, isAttendanceLocked, attendanceEditDeadline, exitSheet, journeyGrid, computeAttendanceStats, notificationsFor, tierList, windowLabel, sectionHeading, homeHref,
} from './lib.mjs'

const cardN = (inner, cls = '') => `<div class="card ${cls}">${inner}</div>`
const picsum = (seed, w = 800, h = 360) => `https://picsum.photos/seed/${seed}/${w}/${h}`

/* =========================================================================
   Auth
   ========================================================================= */
export function login() {
  const demo = D.demoUsers.map((u, i) => {
    const stage = D.journeyStages.find((s) => s.id === u.journeyStageId)?.label
    const href = [homeHref.member, homeHref.leader, homeHref.super, homeHref.coach][i]
    const ico = ['users', 'shield-check', 'crown', 'compass'][i]
    const grad = ['blue', 'green', 'purple', 'orange'][i]
    return `<a class="demo-row" href="${href}">${icoSq(ico, grad, true)}<span class="flex-1"><span class="row-title" style="display:block">${u.name}</span><span class="row-sub">${D.roleLabels[u.role]}${stage ? ' · ' + stage : ''}</span></span>${ic('chevron-right')}</a>`
  }).join('')
  return authShell({
    title: 'Masuk',
    body: `<div class="auth-shell"><div class="auth-card">
  <div class="auth-logo"><img src="assets/logo-shema.png" alt="Shema · GKI Gejayan" /></div>
  <div class="auth-panel">
    <form class="flex-col gap-3" style="display:flex" onsubmit="return false">
      ${field('Nomor WA', input('', '0812-3456-7890'))}
      ${field('Kata Sandi', input('', 'demo123', 'type="password"'))}
      <a class="btn btn-primary btn-block" href="member-home.html" style="margin-top:6px">Masuk</a>
    </form>
    <p class="text-sm muted" style="text-align:center;margin-top:18px">Baru pertama kali di sini? <a class="link" href="register.html">Daftar akun</a></p>
  </div>
  <p class="text-sm muted" style="text-align:center;margin:26px 0 10px;font-size:12.5px">Mode demo — coba tampilan sesuai peran</p>
  <div class="flex-col gap-2" style="display:flex">${demo}</div>
</div></div>`,
  })
}

export function register() {
  return authShell({
    title: 'Daftar Akun',
    body: `<div class="auth-shell"><div class="auth-card">
  <div class="auth-logo"><img src="assets/logo-shema.png" alt="Shema · GKI Gejayan" style="width:84px;height:84px" /><h1 style="font-size:23px;margin-top:10px">Daftar Akun Baru</h1><p class="text-sm muted" style="margin-top:4px">Isi data singkat ini untuk mulai bergabung di GKI Gejayan.</p></div>
  <div class="auth-panel">
    <div id="reg-form">
      <form class="flex-col gap-3" style="display:flex" onsubmit="return false">
        ${field('Nama Lengkap', input('', 'Nama sesuai KTP'))}
        ${field('Nomor WA', input('', '0812-3456-7890'), 'Admin akan menghubungi nomor ini untuk mengaktifkan akunmu.')}
        <button type="button" class="btn btn-primary btn-block" data-hide="reg-form" data-show="reg-done" style="margin-top:6px">Daftar</button>
      </form>
      <p class="text-sm muted" style="text-align:center;margin-top:18px">Sudah punya akun? <a class="link" href="login.html">Masuk</a></p>
    </div>
    <div id="reg-done" hidden style="text-align:center;padding:10px 0">
      <span class="ico-sq g-green" style="width:56px;height:56px;border-radius:50%;margin:0 auto 14px">${ic('circle-check-big')}</span>
      <div class="row-title" style="font-size:17px">Pendaftaran terkirim</div>
      <p class="text-sm muted" style="margin-top:8px">Admin akan meninjau dan menempatkanmu di salah satu Care Group. Kamu akan dihubungi lewat Nomor WA yang kamu daftarkan begitu akun dan kata sandimu siap.</p>
      <a class="link text-sm" href="login.html" style="display:inline-block;margin-top:14px">Kembali ke halaman masuk</a>
    </div>
  </div>
</div></div>`,
  })
}

/* =========================================================================
   Home — anggota / tanpa CG
   ========================================================================= */
const welcomeCard = `<div class="card tinted" data-reveal><div class="row-title" style="font-size:16px">Selamat datang di GKI Gejayan!</div><p class="text-sm muted" style="margin-top:6px">Akunmu berhasil dibuat. Tim kami akan segera menghubungkanmu dengan salah satu Care Group — pantau halaman ini untuk info selanjutnya.</p></div>`

export function memberHome() {
  const stats = computeAttendanceStats(CG1.meetings, 'm3')
  const next = CG1.meetings.find((m) => m.date >= TODAY) ?? CG1.meetings[0]
  const stage = D.journeyStages.find((s) => s.id === U.member.journeyStageId).label
  const detail = `${stats.totalHadir} dari ${stats.totalPertemuan} pertemuan terakhir`
  const body = `
${homeHeader('member', stats.streak, detail)}
${temuFirmanCard('member')}
${shortcuts([
  { label: 'Temu Firman', icon: 'book-open-text', grad: 'green', href: 'temu-firman.html' },
  { label: 'Care Group', icon: 'users', grad: 'blue', href: 'program-cg.html' },
  { label: 'Presensi', icon: 'hand-helping', grad: 'orange', href: 'presensi.html' },
  { label: 'Pelayanan', icon: 'heart-handshake', grad: 'red', href: 'tentang.html' },
  { label: 'Profil', icon: 'circle-user', grad: 'navy', href: 'profil.html' },
  { label: 'Q&amp;A', icon: 'circle-help', grad: 'amber', href: '#qa' },
  { label: 'Pengaturan', icon: 'settings', grad: 'slate', href: 'pengaturan.html' },
  { label: 'Tentang SDA', icon: 'info', grad: 'magenta', href: 'tentang.html' },
])}
${journeySection('member', 'ketuk untuk penjelasan')}
<div class="card" data-reveal>${sectionTitle('Perjalanan Pelayananmu')}${stepper(U.member.journeyStageId)}<p class="text-sm muted" style="margin-top:14px">Tahap saat ini: <strong style="color:var(--navy-900)">${stage}</strong></p></div>
<div class="card" data-reveal><div class="flex items-start gap-3">${icoSq('lock-open', 'green')}<div><div class="row-title" style="font-size:15px">Pelayanan Terbuka</div><p class="text-sm muted" style="margin-top:4px">Kamu sudah menjadi member Care Group ini dan bisa mengambil pelayanan. <a class="link" href="tentang.html">Lihat pilihan peran</a></p></div></div></div>
<div class="card" data-reveal>${sectionTitle('Pertemuan Berikutnya', `<a class="link text-sm" href="program-cg.html" style="text-transform:none;letter-spacing:0">Care Group ${ic('chevron-right', 'inl')}</a>`)}
  <div class="row-title" style="font-size:16px">${CG1.name}</div><p class="text-sm muted" style="margin-top:3px">${next.topic}</p>
  <div class="flex wrap gap-4 text-sm muted" style="margin-top:12px"><span class="flex items-center gap-1">${ic('calendar-days', 'inl')} ${formatShortDate(next.date)}, ${CG1.meetingTime}</span><span class="flex items-center gap-1">${ic('map-pin', 'inl')} ${CG1.meetingLocation}</span></div></div>
${announcementsCard()}
${churchInfo()}`
  return shell({ role: 'member', active: 'home', title: 'Home', body, sheets: homeSheets('member', stats.streak, detail) + journeySheets('member') + announcementSheets() })
}

export function memberHomeNoGroup() {
  const body = `
${homeHeader('newbie')}
${temuFirmanCard('newbie')}
${welcomeCard}
${shortcuts([
  { label: 'Temu Firman', icon: 'book-open-text', grad: 'green', href: 'temu-firman.html' },
  { label: 'Tentang SDA', icon: 'info', grad: 'magenta', href: 'tentang.html' },
  { label: 'Pengaturan', icon: 'settings', grad: 'slate', href: 'pengaturan.html' },
], 3)}
${journeySection('newbie')}
<div class="card" data-reveal>${sectionTitle('Perjalanan Pelayananmu')}${stepper('newcomer')}</div>
${announcementsCard()}`
  return shell({ role: 'newbie', active: 'home', title: 'Home · Belum Bergabung CG', body, sheets: homeSheets('newbie') + journeySheets('newbie') + announcementSheets() })
}

/* =========================================================================
   Program CG
   ========================================================================= */
const capacity = (n) => (n < D.CG_MIN_MEMBERS ? ['coklat', 'Kekurangan anggota'] : n >= D.CG_MAX_MEMBERS ? ['red', 'Siap membelah'] : ['green', 'Anggota cukup'])

export function infoUmumContent() {
  return `
${cardN(`${sectionTitle('Apa itu Care Group?')}<p class="text-sm">${D.cgGeneralInfo.definition}</p>`)}
${cardN(`${sectionTitle('Aturan &amp; Penamaan')}<ul class="flex-col gap-2" style="display:flex;font-size:13.5px"><li>${D.cgGeneralInfo.capacityRule}</li><li>${D.cgGeneralInfo.namingRule}</li><li>${D.cgGeneralInfo.trainingScheduleNote}</li></ul>`)}
${cardN(`${sectionTitle('Cara Bergabung')}<ol class="flex-col gap-2" style="display:flex;font-size:13.5px">${D.cgGeneralInfo.registrationSteps.map((s, i) => `<li class="flex gap-2"><span class="step-num">${i + 1}</span><span>${s}</span></li>`).join('')}</ol>`)}
${cardN(`${sectionTitle('Daftar Care Group')}<div class="row-list">${D.careGroupsSeed.map((g) => { const [c, l] = capacity(g.members.length); return `<div class="row"><div class="flex-1"><div class="row-title">${g.code} · ${g.name}</div><div class="row-sub">Leader: ${g.leaderName} · ${g.members.length} anggota</div></div>${badge(c, l)}</div>` }).join('')}</div>`)}`
}

export function jobdeskContent() {
  const rows = [
    D.cgRoleJobdesk.find((r) => r.role === 'Anggota'),
    { role: 'Pengurus CG', items: D.defaultPengurusJobdesk, edited: true },
    ...D.cgRoleJobdesk.filter((r) => r.role !== 'Anggota'),
  ]
  const grad = { Anggota: 'blue', 'Pengurus CG': 'green', 'Calon Leader': 'orange', 'Kandidat Leader': 'purple', Leader: 'navy' }
  return cardN(`<div class="row-list">${rows.map((r) => `<div class="row" style="align-items:flex-start">${icoSq({ Anggota: 'user', 'Pengurus CG': 'clipboard-list', 'Calon Leader': 'sprout', 'Kandidat Leader': 'badge-check', Leader: 'crown' }[r.role], grad[r.role], true)}<div class="flex-1"><div class="row-title flex items-center gap-2 wrap">${r.role}${r.edited ? badge('green', 'Diatur Leader', 'pencil') : ''}</div>${r.items ? `<ul class="bullets">${r.items.map((i) => `<li>${i}</li>`).join('')}</ul>` : `<div class="row-sub" style="font-size:13.5px">${r.desc}</div>`}</div></div>`).join('')}</div>
  <p class="hint" style="margin-top:14px">Jobdesk Pengurus CG disusun dan diedit oleh Leader CG-mu.</p>`)
}

function anggotaContent() {
  const up = CG1.members.filter((m) => m.birthDate).map((m) => ({ ...m, d: daysUntilBirthday(m.birthDate) })).filter((m) => m.d <= 30).sort((a, b) => a.d - b.d)
  return `
${up.length ? cardN(`${sectionTitle('Ulang Tahun Terdekat')}<div class="row-list">${up.map((m) => `<div class="row">${avatar(m.name, 'sm', m.initials)}<span class="flex-1 row-title">${m.name}</span><span class="badge b-orange">${ic('cake')}${m.d === 0 ? 'Hari ini' : `${m.d} hari lagi`}</span></div>`).join('')}</div>`) : ''}
${cardN(`${sectionTitle(`${CG1.members.length} Anggota`)}<div class="row-list">${CG1.members.map((m) => `<div class="row">${avatar(m.name, 'md', m.initials)}<span class="flex-1 row-title">${m.name}</span>${roleBadge(m.role)}</div>`).join('')}</div>`)}`
}

export function kehadiranContent({ leader = false, uid = 'kh' } = {}) {
  const sorted = [...CG1.meetings].sort((a, b) => b.date.localeCompare(a.date))
  const meetingCard = (m, hidden) => {
    const hadir = Object.values(m.attendance).filter(Boolean).length
    const lockedReal = isAttendanceLocked(m.date)
    const canEdit = leader && !lockedReal
    return `<div class="card"${hidden ? ` data-more="${uid}-more" hidden` : ''}>
    <div class="flex items-center justify-between gap-2"><div><div class="row-title" style="font-size:15px">${m.topic}</div><div class="row-sub">${formatLongDate(m.date)}</div></div>
    <div class="flex-col" style="display:flex;align-items:flex-end;gap:4px">${badge('ink', `${hadir}/${CG1.members.length} hadir`)}${leader && lockedReal ? `<span class="row-sub flex items-center gap-1">${ic('lock', 'inl')} Terkunci</span>` : ''}</div></div>
    ${leader && lockedReal ? `<p class="hint" style="margin-top:8px">Batas edit kehadiran (14 hari) sudah lewat sejak ${formatShortDate(attendanceEditDeadline(m.date))}.</p>` : ''}
    <div class="row-list" style="margin-top:12px">${CG1.members.map((mm) => {
      const present = !!m.attendance[mm.id]
      const note = m.attendanceNotes?.[mm.id]
      return `<div><div class="row${canEdit ? ' row-clickable' : ''}" style="padding-top:11px;padding-bottom:11px">${avatar(mm.name, 'sm', mm.initials)}<span class="flex-1 text-sm" style="color:var(--navy-900);font-weight:600">${mm.name}</span>${mm.role === 'Leader' ? badge('blue', 'Leader') : ''}${present ? `<span class="status-ok">${ic('check')} Hadir</span>` : `<span class="row-sub flex items-center gap-1" style="font-weight:600">${ic('x', 'inl')} Tidak hadir</span>`}</div>${!present ? (canEdit ? `<input class="input note-in" placeholder="Keterangan (opsional, misal: Sakit)" value="${note || ''}" />` : note ? `<p class="note-txt">Keterangan: ${note}</p>` : '') : ''}</div>`
    }).join('')}</div></div>`
  }
  return `
<div class="flex items-center justify-between gap-2 wrap">${leader ? '<p class="text-sm muted">Sentuh nama anggota untuk menandai kehadiran.</p>' : '<span></span>'}<div style="min-width:170px">${select(['Semua anggota', ...CG1.members.map((m) => m.name)])}</div></div>
${sorted.map((m, i) => meetingCard(m, i >= 2)).join('')}
<button type="button" class="btn btn-ghost btn-block" data-show-more="${uid}-more">Tampilkan lebih banyak</button>`
}

function pertumbuhanContent(jk = 'member') {
  const p = journeyProgress(jk)
  const stageIndex = p.fruitful.stageIndex
  return `
<div class="chip-title">Faithful Journey</div>
${journeyGrid(jk, false)}
${cardN(`${sectionTitle('Ajak Orang Baru')}<p class="text-sm muted" style="margin-bottom:12px">Catat setiap orang yang berhasil kamu ajak bergabung ke Care Group.</p><div class="flex gap-2">${input('', 'Nama orang yang diajak')}<button type="button" class="btn btn-primary" style="flex-shrink:0">${ic('user-plus')} Tambah</button></div>`)}
${cardN(`${sectionTitle('Peningkatan Peran')}${roleStepper(stageIndex)}<p class="text-sm muted" style="margin-top:14px">Tahap saat ini: <strong style="color:var(--navy-900)">${D.roleProgressionStages[stageIndex].label}</strong></p>`)}`
}

export function materiContent() {
  return D.materiSeed.map((m) => `<div class="card qa" style="padding:6px 20px"><details><summary><span><span class="row-sub" style="display:block">${m.week}</span><span class="row-title" style="font-size:15px">${m.title}</span><span class="text-sm" style="color:var(--blue-600);font-weight:700">${m.verse}</span></span></summary><div class="ans"><p>${m.summary}</p>${m.questions.length ? `<div class="chip-title" style="margin-top:14px">Pertanyaan diskusi</div><ol class="flex-col gap-2" style="display:flex">${m.questions.map((q, i) => `<li class="flex gap-2"><span class="step-num">${i + 1}</span><span>${q}</span></li>`).join('')}</ol>` : ''}</div></details></div>`).join('')
}

const SECTIONS = [
  ['info', 'Info Umum', 'info', 'teal'],
  ['jobdesk', 'Jobdesk Peran', 'clipboard-list', 'purple'],
  ['anggota', 'Anggota', 'users', 'blue'],
  ['kehadiran', 'Kehadiran', 'calendar-check', 'green'],
  ['pertumbuhan', 'Pertumbuhanku', 'trending-up', 'orange'],
  ['materi', 'Materi', 'book-open', 'magenta'],
]

export function programCg(role = 'member') {
  const g = CG1
  const [capC, capL] = capacity(g.members.length)
  const past = g.meetings.filter((m) => isPastMeeting(m.date))
  const slots = past.length * g.members.length
  const present = past.reduce((s, m) => s + Object.values(m.attendance).filter(Boolean).length, 0)
  const pct = Math.round((present / slots) * 100)
  const attC = pct < 50 ? 'coklat' : pct < 80 ? 'green' : 'green'
  const pengurus = g.members.filter((m) => m.role === 'Pengurus CG').length
  const body = `
<div data-reveal><div class="eyebrow">${g.category}</div><h1 class="page-title">${g.name}</h1></div>
<div class="cg-hero" data-reveal>
  <p class="scripture" style="font-size:18px;color:#fff;position:relative;z-index:2">&ldquo;${g.quote}&rdquo;</p>
  <div class="cg-facts">
    <span>${ic('users', 'inl')} Leader: <strong>${g.leaderName}</strong>${pengurus ? ` · ${pengurus} pengurus` : ''}</span>
    <span>${ic('calendar-days', 'inl')} ${g.meetingDay}, ${g.meetingTime} · ${g.frequency}</span>
    <span>${ic('map-pin', 'inl')} ${g.meetingLocation}</span>
  </div>
  <div class="flex wrap gap-1" style="margin-top:14px;position:relative;z-index:2"><span class="badge b-glass">${g.code}</span><span class="badge b-glass">${capL}</span><span class="badge b-glass">Kehadiran rata-rata ${pct}%</span></div>
</div>
<div class="card" data-reveal>
  <div class="shortcuts cols-3">${SECTIONS.map(([id, label, icon, grad]) => `<button type="button" class="shortcut" data-open-sheet="sh-${id}"><span class="sc-ico g-${grad}">${ic(icon)}</span><span>${label}</span></button>`).join('')}</div>
  <p class="hint" style="text-align:center;margin-top:18px">Ketuk ikon untuk melihat penjelasan lengkapnya.</p>
</div>`
  const isLeader = role === 'leader'
  const sheets = [
    sheet('sh-info', 'Info Umum', infoUmumContent(), true),
    sheet('sh-jobdesk', 'Jobdesk Peran', jobdeskContent(), true),
    sheet('sh-anggota', 'Anggota', anggotaContent(), true),
    sheet('sh-kehadiran', 'Kehadiran', `<div class="flex-col gap-3" style="display:flex">${kehadiranContent({ leader: isLeader, uid: 'kh' })}</div>`, true),
    sheet('sh-pertumbuhan', 'Pertumbuhanku', `<div class="flex-col gap-4" style="display:flex">${pertumbuhanContent(role === 'leader' ? 'leader' : 'member')}</div>`, true),
    sheet('sh-materi', 'Materi', `<div class="flex-col gap-3" style="display:flex">${materiContent()}</div>`, true),
  ].join('') + journeySheets(role === 'leader' ? 'leader' : 'member')
  return shell({ role, active: 'komsel', title: 'Program CG', body, sheets })
}

export function programCgInfo(role = 'super') {
  const sub = role === 'super' ? 'Kelola komsel lewat Panel Admin.' : role === 'coach' ? 'Kelola Care Group binaanmu lewat Panel Pembinaan.' : 'Kamu belum tergabung dengan Care Group. Berikut info umum sambil menunggu penempatan.'
  const body = `
${pageHero({ eyebrow: 'GKI Gejayan', title: 'Program Care Group', sub })}
<div class="flex-col gap-4" style="display:flex">${infoUmumContent()}${jobdeskContent()}</div>`
  return shell({ role, active: 'komsel', title: 'Program CG · Info Umum', body })
}

/* =========================================================================
   Temu Firman
   ========================================================================= */
function renungDetail(item, isToday, uid) {
  const done = D.bibleReadingCheckinSeed.some((c) => c.userId === U.member.id && c.date === item.date)
  const N = cardN
  return `
<p class="text-sm muted" style="margin-bottom:12px">${formatLongDate(item.date)}</p>
<div class="verse-block"><div class="eyebrow" style="color:var(--green-600)">Ayat</div><p class="scripture" style="font-size:19px;margin-top:6px">&ldquo;${item.verseText}&rdquo;</p><div class="text-sm" style="font-weight:800;color:var(--green-600);margin-top:8px">${item.verse}</div></div>
<div class="photo-card" style="width:100%;height:190px;margin-top:14px"><img src="${picsum(`${item.id}-ill`, 900, 380)}" alt="" loading="lazy" onerror="this.remove()" /><div class="cap">${item.image?.caption || 'Ilustrasi renungan'}</div></div>
<button type="button" class="chip" style="margin-top:14px;display:inline-flex;align-items:center;gap:7px">${ic('volume-2', 'inl')} ${item.audioLabel}</button>
<div class="prose">${item.text.map((p) => `<p>${p}</p>`).join('')}</div>
<div class="prayer"><div class="chip-title" style="margin-bottom:6px;color:var(--teal-600)">Penuntun Doa</div><p class="text-sm">${item.prayerGuide}</p></div>
<div class="flex items-center gap-4 reaction"><button type="button" class="react">${ic('heart')} ${item.likes}</button><span class="react">${ic('message-circle')} ${item.comments.length}</span><button type="button" class="react">${ic('share-2')} Bagikan</button></div>
<div class="comments">${item.comments.map((c) => `<div class="text-sm"><strong style="color:var(--navy-900)">${c.memberName}</strong> ${c.text}</div>`).join('')}<div class="flex gap-2">${input('', 'Tulis komentar… (1x per orang)')}<button type="button" class="btn btn-primary btn-sm" style="flex-shrink:0">Kirim</button></div></div>
${isToday ? `<button type="button" class="btn ${done ? 'btn-done' : 'btn-primary'} btn-block" style="margin-top:18px;padding:14px" ${done ? 'disabled' : ''}>${ic('circle-check-big')} ${done ? 'Sudah selesai saat teduh hari ini' : 'Tandai Selesai Saat Teduh'}</button>` : ''}`
}

export function temuFirman() {
  const [today, ...past] = D.renunganHarianSeed
  const rows = past.map((it) => {
    const done = D.bibleReadingCheckinSeed.some((c) => c.userId === U.member.id && c.date === it.date)
    return `<button type="button" class="card hoverable rn-row" data-open-sheet="sh-rn-${it.id}" data-reveal>
      <span class="ico-sq g-green">${ic('image')}</span>
      <span class="flex-1" style="min-width:0;text-align:left"><span class="row-title" style="display:block">${it.title}</span><span class="text-sm" style="color:var(--green-600);font-weight:700">${it.verse}</span><span class="row-sub flex items-center gap-3" style="margin-top:2px"><span class="flex items-center gap-1">${ic('heart', 'inl')} ${it.likes}</span><span class="flex items-center gap-1">${ic('message-circle', 'inl')} ${it.comments.length}</span></span></span>
      ${done ? badge('green', 'Selesai') : ''}${ic('chevron-right', 'chev')}</button>`
  }).join('')
  const body = `
${pageHero({ eyebrow: 'Word Encounter', title: 'Temu Firman', sub: formatLongDate(today.date) })}
<div class="card" data-reveal><div class="flex items-center justify-between gap-2" style="margin-bottom:14px"><span class="eyebrow" style="color:var(--ink-500)">Hari ini</span><h2 style="font-size:16px;text-align:right">${today.title}</h2></div>${renungDetail(today, true, 'today')}</div>
<div data-reveal><div class="chip-title">Faithful Journey</div><p class="hint" style="margin:-4px 0 12px">Empat perjalanan imanmu: ${D.faithfulJourneys.map((j) => `${j.emoji} ${j.en}`).join(' · ')}. Ketuk gambar untuk melihat tangganya.</p>${journeyGrid('member')}</div>
<div><div class="chip-title" data-reveal>Renungan Sebelumnya</div><div class="flex-col gap-2" style="display:flex">${rows}</div></div>`
  const sheets = past.map((it) => sheet(`sh-rn-${it.id}`, it.title, renungDetail(it, false, it.id), true)).join('') + journeySheets('member')
  return shell({ role: 'member', active: 'temu', title: 'Temu Firman', body, sheets })
}

/* =========================================================================
   Presensi
   ========================================================================= */
export function presensi() {
  const mine = D.pelayananCheckinSeed.filter((c) => c.memberId === 'm3').sort((a, b) => b.date.localeCompare(a.date))
  const groups = D.presensiPelayananGroups.map((g) => `<optgroup label="${g.group}">${g.items.map((i) => `<option>${i}</option>`).join('')}</optgroup>`).join('')
  const body = `
${pageHero({ eyebrow: 'Pelayanan', title: 'Presensi Pelayanan', sub: 'Tandai kehadiranmu setiap kali bertugas melayani.', right: `<span class="ico-sq g-orange hero-ico">${ic('hand-helping')}</span>` })}
<div class="card" data-reveal>${sectionTitle('Hadir Melayani')}
  <form class="flex-col gap-3" style="display:flex" onsubmit="return false">
    ${field('Pelayanan', `<select class="input"><option value="" disabled selected>Pilih pelayanan yang kamu jalani</option>${groups}</select>`)}
    <div class="field-grid">${field('Tanggal', `<input class="input" type="date" value="${TODAY}" max="${TODAY}" />`)}${field('Catatan (opsional)', input('', 'Ibadah pukul 07.00, dst.'))}</div>
    <div class="flex items-center justify-between"><span class="status-ok" id="pres-ok" hidden>${ic('circle-check-big')} Presensi tercatat</span><span></span>
    <button type="button" class="btn btn-primary" data-show="pres-ok">${ic('hand-helping')} Tandai Hadir</button></div>
  </form></div>
<div class="card" data-reveal>${sectionTitle('Riwayat Presensimu')}${mine.length ? `<div class="row-list">${mine.map((c) => `<div class="row">${icoSq('hand-helping', 'orange', true)}<div class="flex-1"><div class="row-title">${c.roleName}</div><div class="row-sub">${formatLongDate(c.date)}${c.note ? ` · ${c.note}` : ''}</div></div>${badge('green', 'Hadir')}</div>`).join('')}</div>` : emptyState('Belum ada riwayat', 'Presensi pelayananmu akan muncul di sini.')}</div>`
  return shell({ role: 'member', active: 'presensi', title: 'Presensi', body })
}

/* =========================================================================
   Profil · Pengaturan · Tentang
   ========================================================================= */
export function profil() {
  const u = U.member
  const m = CG1.members.find((x) => x.id === u.memberId)
  const dates = D.growthDatesSeed[u.id]
  const events = D.eventsSeed
  const info = [
    ['Nama Lengkap', u.name], ['Nomor WA', u.phone], ['Peran', D.roleLabels[u.role]], ['Care Group', CG1.name], ['Alamat', m.address], ['Universitas', m.university], ['Tanggal Lahir', formatBirthDate(m.birthDate)],
  ]
  const growth = D.growthMilestones.map((g) => {
    const d = dates[g.id]
    const nextEv = !d ? events.filter((e) => e.milestoneId === g.id && e.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date))[0] : null
    return `<div class="row">${d ? `<span class="check-dot">${ic('check')}</span>` : '<span class="dash-dot"></span>'}<span class="flex-1 row-title" style="font-weight:${d ? 700 : 600};color:${d ? 'var(--navy-900)' : 'var(--ink-500)'}">${g.label}</span><span class="row-sub">${d ? `Selesai ${formatShortDate(d)}` : nextEv ? `Berikutnya ${formatShortDate(nextEv.date)}` : 'Belum ada jadwal'}</span></div>`
  }).join('')
  const myCheckins = D.pelayananCheckinSeed.filter((c) => c.memberId === u.memberId).length
  const stage = D.journeyStages.find((s) => s.id === u.journeyStageId).label
  const body = `
<div class="profile-hero" data-reveal>
  <button type="button" class="profile-photo" aria-label="Ganti foto">${u.initials}<span class="cam">${ic('camera')}</span></button>
  <div class="flex-1" style="min-width:0;position:relative;z-index:2"><h1 style="color:#fff;font-size:23px">${u.name}</h1><div class="hero-sub" style="margin-top:2px">${D.roleLabels[u.role]}</div><div class="hero-sub flex items-center gap-1" style="font-size:12.5px;margin-top:4px">${ic('phone', 'inl')} ${u.phone}</div></div>
  <div class="flex gap-2" style="position:relative;z-index:2"><button type="button" class="hh-btn" data-toggle="fullinfo" aria-label="Lihat informasi lengkap">${ic('eye')}</button><a class="hh-btn" href="pengaturan.html" aria-label="Pengaturan">${ic('settings')}</a></div>
</div>
<p class="hint" style="margin-top:-12px">Foto pratinjau untuk sesi ini saja.</p>
<div class="card" id="fullinfo" hidden>${sectionTitle('Informasi Lengkap')}<div class="row-list">${info.map(([l, v]) => `<div class="row" style="justify-content:space-between"><span class="text-sm muted">${l}</span><span class="text-sm" style="font-weight:700;color:var(--navy-900);text-align:right">${v}</span></div>`).join('')}</div><p class="hint" style="margin-top:12px">Ubah nama, alamat, universitas, dan tanggal lahir lewat ikon pengaturan. Nomor WA &amp; penempatan Care Group diubah lewat Leader → Admin.</p></div>
<div class="card" data-reveal>${sectionTitle('Perjalanan Pelayanan')}${stepper(u.journeyStageId)}<p class="text-sm muted" style="margin-top:14px">Tahap saat ini: <strong style="color:var(--navy-900)">${stage}</strong></p></div>
<div class="card" data-reveal>${sectionTitle('Shema Growth')}<div class="row-list">${growth}</div></div>
<a class="card hoverable link-row" href="presensi.html" data-reveal>${icoSq('hand-helping', 'orange')}<div class="flex-1"><div class="row-title">Presensi Pelayanan</div><div class="row-sub">${myCheckins} kali tercatat · diisi sendiri</div></div>${ic('chevron-right', 'chev')}</a>
<a class="card hoverable link-row" href="tentang.html" data-reveal>${icoSq('heart-handshake', 'red')}<div class="flex-1"><div class="row-title">Tentang Tim SDA &amp; Care Group</div><div class="row-sub">Peran pelayanan &amp; ajukan pelayananmu</div></div>${ic('chevron-right', 'chev')}</a>
<button type="button" class="card hoverable link-row" data-open-sheet="sh-exit" data-reveal style="width:100%;text-align:left;font:inherit">${icoSq('log-out', 'slate')}<div class="flex-1"><div class="row-title">Keluar</div></div></button>
<div class="card" data-reveal style="background:var(--surface-2)"><p class="text-sm muted">GKI Gejayan · Tim Sumber Daya Aktifis (SDA)</p><p class="text-sm muted" style="margin-top:2px">Shema App · v0.3 (prototype)</p></div>`
  return shell({ role: 'member', active: 'profil', title: 'Profil', body, sheets: exitSheet() })
}

export function pengaturan() {
  const m = CG1.members.find((x) => x.id === U.member.memberId)
  const fonts = [['Kecil', 0.9], ['Normal', 1], ['Besar', 1.15], ['Sangat besar', 1.3]]
  const body = `
<div data-reveal><h1 class="page-title">Pengaturan</h1><p class="text-sm muted" style="margin-top:4px">Ubah profil, kode sandi, dan ukuran font.</p></div>
<div class="card" data-reveal>${sectionTitle('Ubah Profil')}<form class="flex-col gap-3" style="display:flex" onsubmit="return false">
  ${field('Nama lengkap', input(U.member.name))}${field('Alamat', input(m.address))}
  <div class="field-grid">${field('Universitas', input(m.university))}${field('Tanggal lahir (BB-TT)', input(m.birthDate, '08-25'), 'Contoh: 08-25')}</div>
  ${field('Nomor WA (dipakai untuk masuk)', input(U.member.phone, '', 'disabled'), 'Untuk mengganti Nomor WA, sampaikan ke Leader CG-mu. Leader akan meneruskannya ke Admin.')}
  <div class="flex items-center justify-between"><span class="status-ok" id="ok-profil" hidden>${ic('circle-check-big')} Profil tersimpan.</span><span></span><button type="button" class="btn btn-primary" data-show="ok-profil">Simpan profil</button></div></form></div>
<div class="card" data-reveal>${sectionTitle('Kode Sandi')}<form class="flex-col gap-3" style="display:flex" onsubmit="return false">
  ${field('Kode sandi saat ini', input('', '', 'type="password"'))}
  <div class="field-grid">${field('Kode sandi baru', input('', '', 'type="password"'), 'Minimal 6 karakter')}${field('Ulangi kode sandi baru', input('', '', 'type="password"'))}</div>
  <div class="flex items-center justify-between"><span class="status-ok" id="ok-pass" hidden>${ic('circle-check-big')} Kode sandi diubah.</span><span></span><button type="button" class="btn btn-primary" data-show="ok-pass">Ubah kode sandi</button></div></form></div>
<div class="card" data-reveal>${sectionTitle('Ukuran Font')}<div class="seg">${fonts.map(([l, v]) => `<button type="button" data-font-scale="${v}">${l}</button>`).join('')}</div>
  <p class="scripture" style="font-size:17px;margin-top:16px">&ldquo;Siapa setia dalam perkara-perkara kecil, ia setia juga dalam perkara-perkara besar.&rdquo; <span style="font-style:normal;font-family:var(--font-sans);font-size:13px;color:var(--ink-500)">— Lukas 16:10</span></p>
  <p class="hint" style="margin-top:6px">Berlaku di seluruh halaman dan tersimpan di perangkat ini.</p></div>`
  return shell({ role: 'member', active: 'profil', title: 'Pengaturan', body, back: { href: 'profil.html', label: 'Profil' } })
}

export function tentang() {
  const col = { brand: 'blue', good: 'green', warn: 'orange', ink: 'ink' }
  const roles = D.sdaRoles.map((r) => `<div class="row" style="align-items:flex-start;flex-direction:column;gap:6px"><span class="badge b-${col[r.color]}">${r.name}</span><p class="text-sm">${r.desc}</p></div>`).join('')
  const radios = D.pelayananRoles.map((r) => `<label class="radio-card"><input type="radio" name="pel" /><span><span class="row-title" style="display:block">${r.name}</span><span class="row-sub" style="font-size:12.5px">${r.desc}</span></span></label>`).join('')
  const body = `
${pageHero({ eyebrow: 'Tentang', title: 'Tim Sumber Daya Aktifis (SDA)', sub: 'Sistem pemberdayaan, penggembalaan &amp; peningkatan peran aktifis GKI Gejayan — “1 orang, 1 Care Group, 1 pelayanan.”' })}
<div class="card" data-reveal>${sectionTitle('Peran Pelayanan')}<div class="row-list">${roles}</div></div>
<div class="card" data-reveal>${sectionTitle('Ajukan Pelayanan')}<p class="text-sm muted" style="margin-bottom:14px">Pilih pelayanan yang ingin kamu ambil, lalu ceritakan alasanmu.</p>
  <form class="flex-col gap-4" style="display:flex" onsubmit="return false"><div class="flex-col gap-2" style="display:flex">${radios}</div>
  ${field('Alasan &amp; Motivasi', textarea('', 'Mengapa kamu ingin mengambil pelayanan ini?'))}
  ${field('Kesibukan Saat Ini', textarea('', 'Ceritakan jadwal/kesibukanmu supaya Leader bisa menyesuaikan.', 2))}
  <div class="flex items-center justify-between"><span class="status-ok" id="ok-apply" hidden>${ic('circle-check-big')} Pengajuan terkirim</span><span></span><button type="button" class="btn btn-primary" data-show="ok-apply">Kirim Pengajuan</button></div></form></div>`
  return shell({ role: 'member', active: 'profil', title: 'Tentang SDA', body, back: { href: 'profil.html', label: 'Profil' } })
}

/* =========================================================================
   Jadwal · Doa
   ========================================================================= */
export function jadwal() {
  const catColor = { Ibadah: 'blue', 'Care Group': 'green', Coaching: 'orange', Training: 'purple', 'Acara Khusus': 'teal' }
  const grouped = D.eventsSeed.reduce((a, e) => { (a[e.date] ||= []).push(e); return a }, {})
  const chips = D.eventCategories.map((c, i) => `<button type="button" class="chip${i === 0 ? ' active' : ''}" data-filter="${c}">${c}</button>`).join('')
  const body = `
${pageHero({ eyebrow: 'Agenda', title: 'Jadwal', sub: 'Agenda pelayanan &amp; Care Group GKI Gejayan', right: `<span class="ico-sq g-teal hero-ico">${ic('calendar-days')}</span>` })}
<div class="pill-row" data-filter-chips data-reveal>${chips}</div>
<div class="flex-col gap-4" style="display:flex">${Object.entries(grouped).map(([date, items]) => `<div data-group><div class="chip-title" style="margin-bottom:8px">${formatLongDate(date)}</div><div class="flex-col gap-2" style="display:flex">${items.map((e) => `<div class="card event-card ec-${catColor[e.category]}" data-cat="${e.category}" data-reveal><div class="flex items-start justify-between gap-3"><div><div class="row-title" style="font-size:15px">${e.title}</div><div class="flex wrap gap-3 text-sm muted" style="margin-top:6px"><span class="flex items-center gap-1">${ic('clock', 'inl')} ${e.time}</span><span class="flex items-center gap-1">${ic('map-pin', 'inl')} ${e.location}</span></div>${e.note ? `<div class="row-sub" style="margin-top:4px">${e.note}</div>` : ''}</div>${badge(catColor[e.category] || 'ink', e.category)}</div></div>`).join('')}</div></div>`).join('')}</div>
<p class="muted text-sm" id="jadwal-empty" hidden style="text-align:center;padding:30px 0">Belum ada agenda untuk kategori ini.</p>`
  return shell({ role: 'leader', active: 'home', title: 'Jadwal', body, back: { href: 'leader-home.html', label: 'Home' } })
}

export function doa() {
  const body = `
${pageHero({ eyebrow: 'Persekutuan', title: 'Pokok Doa', sub: 'Saling mendoakan sebagai satu Care Group', right: `<button type="button" class="btn btn-glass" data-toggle="doa-form">${ic('plus')} Tambah</button>` })}
<div class="card" id="doa-form" hidden><form class="flex-col gap-3" style="display:flex" onsubmit="return false">
  ${field('Nama (opsional)', input('', 'Anonim'))}${field('Kategori', select(D.prayerCategories))}${field('Pokok doa', textarea('', 'Tuliskan pokok doamu...'))}
  <button type="button" class="btn btn-primary sp-end" data-hide="doa-form">Kirim</button></form></div>
<div class="flex-col gap-3" style="display:flex">${D.prayerSeed.map((p) => `<div class="card" data-reveal><div class="flex items-center justify-between gap-2"><div class="flex items-center gap-3">${avatar(p.name === 'Anonim' ? 'Anonim' : p.name, 'sm', p.name === 'Anonim' ? '?' : undefined)}<span class="row-title">${p.name}</span></div><div class="flex items-center gap-2">${badge({ Kesehatan: 'red', Keluarga: 'purple', Pekerjaan: 'blue', Syukur: 'green', Lainnya: 'ink' }[p.category], p.category)}<span class="row-sub">${formatShortDate(p.date)}</span></div></div>
  <p class="text-sm" style="margin-top:12px;color:var(--ink-700)">${p.text}</p>
  <button type="button" class="chip pray" data-pray data-count="${p.prayedCount}" style="margin-top:14px;margin-bottom:0;display:inline-flex;align-items:center;gap:6px">${ic('hand-heart', 'inl')}<span class="lbl">Doakan</span> · <span class="n">${p.prayedCount}</span></button></div>`).join('')}</div>`
  return shell({ role: 'super', active: 'home', title: 'Pokok Doa', body, back: { href: 'super-admin-home.html', label: 'Home' } })
}

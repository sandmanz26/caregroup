import {
  D, TODAY, U, CG1, ic, avatar, badge, sectionTitle, icoSq, shell, sheet, shortcuts, homeHeader, homeSheets, temuFirmanCard,
  journeySection, journeySheets, stepper, announcementsCard, announcementSheets, churchInfo, pageHero, emptyState, field, input, textarea, select,
  tabs, panel, roleBadge, mapColor, tierBadge, formatLongDate, formatShortDate, formatBirthDate, isPastMeeting, isAttendanceLocked,
  attendanceEditDeadline, computeAttendanceStats, computeServiceRecap, computeTierStats, summarizeTierCoverage, coverageCard, card,
} from './lib.mjs'
import { kehadiranContent } from './pages-member.mjs'

const C = (inner, cls = '') => `<div class="card ${cls}">${inner}</div>`
const stack = (inner, gap = 3) => `<div class="flex-col gap-${gap}" style="display:flex">${inner}</div>`
const addBtn = (label, icon = 'plus') => `<button type="button" class="btn btn-primary sp-end">${ic(icon)} ${label}</button>`
const evCat = { Ibadah: 'blue', 'Care Group': 'green', Coaching: 'orange', Training: 'purple', 'Acara Khusus': 'teal' }

function adminHero(eyebrow, title, sub = '') {
  return pageHero({ eyebrow, title, sub, right: `<span class="ico-sq g-purple hero-ico">${ic('shield-check')}</span>` })
}

/* =========================================================================
   Home — Leader
   ========================================================================= */
export function leaderHome() {
  const stats = computeAttendanceStats(CG1.meetings, 'm1')
  const detail = `${stats.totalHadir} dari ${stats.totalPertemuan} pertemuan terakhir`
  const next = CG1.meetings.find((m) => m.date >= TODAY) ?? CG1.meetings[0]
  const cand = CG1.meetings.filter((m) => m.date <= TODAY && !isAttendanceLocked(m.date)).filter((m) => Object.keys(m.attendance).length < CG1.members.length).sort((a, b) => b.date.localeCompare(a.date))[0]
  const reminder = cand ? `
<div class="float-card reminder" data-reveal>
  ${icoSq('clipboard-list', 'orange')}
  <div class="tf-body"><div class="row-title" style="font-size:15px">Kehadiran Belum Lengkap</div>
  <p class="text-sm muted" style="margin-top:3px">Pertemuan “${cand.topic}” (${formatShortDate(cand.date)}) baru diisi ${Object.keys(cand.attendance).length} dari ${CG1.members.length} anggota. Bisa diedit sampai ${formatShortDate(attendanceEditDeadline(cand.date))}.</p></div>
  <a class="btn btn-primary btn-sm" href="leader-admin.html#kehadiran">Isi kehadiran ${ic('chevron-right')}</a>
</div>` : ''
  const body = `
${homeHeader('leader', stats.streak, detail)}
${reminder}
${temuFirmanCard('leader', { floating: false })}
${shortcuts([
  { label: 'Temu Firman', icon: 'book-open-text', grad: 'green', href: 'temu-firman.html' },
  { label: 'Care Group', icon: 'users', grad: 'blue', href: 'program-cg-leader.html' },
  { label: 'Presensi', icon: 'hand-helping', grad: 'orange', href: 'presensi.html' },
  { label: 'Jadwal', icon: 'calendar-days', grad: 'teal', href: 'jadwal.html' },
  { label: 'Panel Admin', icon: 'shield-check', grad: 'purple', href: 'leader-admin.html' },
  { label: 'Q&amp;A', icon: 'circle-help', grad: 'amber', href: '#qa' },
  { label: 'Pengaturan', icon: 'settings', grad: 'slate', href: 'pengaturan.html' },
  { label: 'Profil', icon: 'circle-user', grad: 'navy', href: 'profil.html' },
])}
${journeySection('leader', 'ketuk untuk penjelasan')}
<div class="card" data-reveal>${sectionTitle('Perjalanan Pelayananmu')}${stepper(U.leader.journeyStageId)}<p class="text-sm muted" style="margin-top:14px">Tahap saat ini: <strong style="color:var(--navy-900)">${D.journeyStages.find((s) => s.id === U.leader.journeyStageId).label}</strong></p></div>
<div class="card" data-reveal><div class="flex items-start gap-3">${icoSq('lock-open', 'green')}<div><div class="row-title" style="font-size:15px">Pelayanan Terbuka</div><p class="text-sm muted" style="margin-top:4px">Kamu sudah menjadi member Care Group ini dan bisa mengambil pelayanan. <a class="link" href="tentang.html">Lihat pilihan peran</a></p></div></div></div>
<div class="card" data-reveal>${sectionTitle('Pertemuan Berikutnya', `<a class="link text-sm" href="program-cg-leader.html" style="text-transform:none;letter-spacing:0">Care Group ${ic('chevron-right', 'inl')}</a>`)}
  <div class="row-title" style="font-size:16px">${CG1.name}</div><p class="text-sm muted" style="margin-top:3px">${next.topic}</p>
  <div class="flex wrap gap-4 text-sm muted" style="margin-top:12px"><span class="flex items-center gap-1">${ic('calendar-days', 'inl')} ${formatShortDate(next.date)}, ${CG1.meetingTime}</span><span class="flex items-center gap-1">${ic('map-pin', 'inl')} ${CG1.meetingLocation}</span></div></div>
${announcementsCard()}
${churchInfo()}`
  return shell({ role: 'leader', active: 'home', title: 'Home · Ketua Komsel', body, sheets: homeSheets('leader', stats.streak, detail) + journeySheets('leader') + announcementSheets() })
}

/* =========================================================================
   Panel Leader
   ========================================================================= */
const LTABS = [['peserta', 'Peserta Komsel'], ['kehadiran', 'Kehadiran'], ['profil', 'Profil CG'], ['statistik', 'Statistik'], ['pengajuan', 'Pengajuan Pelayanan'], ['presensi', 'Presensi Pelayanan'], ['jadwal', 'Jadwal Komsel'], ['khusus', 'Jadwal Khusus']]

function memberDetails(m, { open = false, promote = true } = {}) {
  const next = D.nextPromotionRole(m.role)
  const isLeader = m.role === 'Leader'
  return `<details class="member"${open ? ' open' : ''}><summary class="row" style="cursor:pointer;padding:8px 0">${avatar(m.name, 'md', m.initials)}<span class="flex-1 row-title">${m.name}</span>${roleBadge(m.role)}</summary>
  <div class="member-detail"><span>${ic('phone', 'inl')} ${m.phone || '-'}</span><span>${ic('map-pin', 'inl')} ${m.address || '-'}</span><span>${ic('graduation-cap', 'inl')} ${m.university || '-'}</span><span>${ic('cake', 'inl')} ${m.birthDate ? formatBirthDate(m.birthDate) : '-'}</span>
  ${promote && !isLeader && next ? `<button type="button" class="btn btn-ghost btn-sm" style="align-self:flex-start;margin-top:4px;color:var(--blue-600);border-color:var(--blue-100)">${ic('arrow-up-circle')} Naikkan ke ${next}</button>` : ''}
  ${promote && !isLeader && !next && m.role === 'Kandidat Leader' ? '<p class="hint">Sudah Kandidat Leader — perubahan ke Leader dilakukan Super Admin.</p>' : ''}</div></details>`
}

export function leaderAdmin() {
  const g = CG1
  const pending = D.serviceApplicationSeed.filter((a) => a.careGroupId === g.id && !a.reviewed).length
  const movable = g.members.filter((m) => m.role !== 'Leader')
  const peserta = stack(`
    ${C(`${sectionTitle('Permintaan Pindah CG')}<p class="text-sm muted" style="margin-bottom:14px">Kalau anggota ingin pindah Care Group, teruskan ke Admin Utama — Admin yang memindahkannya.</p>
      <form class="flex-col gap-3" style="display:flex" onsubmit="return false"><div class="field-grid">${field('Anggota', select(movable.map((m) => m.name), '', 'Pilih anggota…'))}${field('Pindah ke', select(D.careGroupsSeed.filter((x) => x.id !== g.id).map((x) => x.name), '', 'Pilih Care Group…'))}</div>
      ${field('Alasan (opsional)', input('', 'Pindah rumah, jadwal bentrok, dst.'))}
      <div class="flex items-center justify-between gap-3"><span class="status-ok" id="ok-transfer" hidden>${ic('circle-check-big')} Permintaan diteruskan ke Admin Utama.</span><span></span><button type="button" class="btn btn-primary" data-show="ok-transfer">Teruskan ke Admin</button></div></form>`)}
    ${C(`${sectionTitle('Tambah Peserta')}<form class="flex-col gap-3" style="display:flex" onsubmit="return false"><div class="field-grid">${field('Nama', input())}${field('No. HP (opsional)', input())}</div><div class="field-grid">${field('Alamat (opsional)', input())}${field('Universitas (opsional)', input())}</div>${field('Tanggal Lahir (opsional, format BB-TT misal 08-20)', input('', '08-20'))}${addBtn('Tambah')}</form>`)}
    ${C(`${sectionTitle(`${g.members.length} Anggota`)}<p class="hint" style="margin:-6px 0 8px">Sentuh nama untuk melihat data kontak &amp; menaikkan status.</p><div class="row-list">${g.members.map((m) => memberDetails(m, { open: m.id === 'm3' })).join('')}</div>`)}`)
  const kehadiran = stack(kehadiranContent({ leader: true, uid: 'lk' }))
  const profilCg = stack(`
    ${C(`${sectionTitle('Deskripsi Care Group')}<p class="text-sm muted" style="margin-bottom:12px">Ceritakan singkat tentang CG-mu — tampil di halaman Program CG untuk anggota dan siapa pun yang melihat profil CG ini.</p><form class="flex-col gap-3" style="display:flex" onsubmit="return false">${textarea('', 'Contoh: Kami adalah CG yang fokus bertumbuh bersama lewat sharing dan doa tiap minggu...', 4)}<button type="button" class="btn btn-primary sp-end">${ic('save')} Simpan</button></form>`)}
    ${C(`${sectionTitle('Jobdesk Pengurus CG')}<p class="text-sm muted" style="margin-bottom:12px">Satu butir per baris. Tampil untuk semua anggota di Program CG → Jobdesk Peran.</p><form class="flex-col gap-3" style="display:flex" onsubmit="return false">${textarea(D.defaultPengurusJobdesk.join('\n'), '', 5)}<button type="button" class="btn btn-primary sp-end" data-show="ok-jd">${ic('save')} Simpan</button><p class="hint sp-end" id="ok-jd" hidden style="color:var(--green-600);font-weight:700">Tersimpan.</p></form>`)}`)
  // Statistik
  const past = g.meetings.filter((m) => isPastMeeting(m.date))
  const slots = past.length * g.members.length
  const present = past.reduce((s, m) => s + Object.values(m.attendance).filter(Boolean).length, 0)
  const avg = slots ? Math.round((present / slots) * 100) : null
  const bertumbuh = summarizeTierCoverage(g.members, D.cgGrowthTiers, (m) => g.meetings.filter((x) => x.attendance[m.id]).map((x) => x.date))
  const beranting = summarizeTierCoverage(g.members, D.invitationTiers, (m) => D.invitationSeed.filter((i) => i.memberId === m.id).map((i) => i.date))
  const withAcc = g.members.filter((m) => D.demoUsers.some((u) => u.memberId === m.id))
  const berakar = summarizeTierCoverage(g.members, D.readingTiers, (m) => { const a = D.demoUsers.find((u) => u.memberId === m.id); return a ? D.bibleReadingCheckinSeed.filter((c) => c.userId === a.id).map((c) => c.date) : null })
  const statistik = stack(`
    ${C(`${sectionTitle('Ringkasan')}<div class="grid-2"><div class="stat-tile"><div class="num" data-count="${g.members.length}">${g.members.length}</div><div class="label">Anggota</div></div><div class="stat-tile"><div class="num" data-count="${avg}" data-suffix="%">${avg}%</div><div class="label">Rata-rata kehadiran pertemuan</div></div></div>`)}
    ${coverageCard({ icon: 'trending-up', grad: 'orange', title: 'Bertumbuh (Kehadiran CG)', coverage: bertumbuh, tiers: D.cgGrowthTiers, totalMembers: g.members.length })}
    ${coverageCard({ icon: 'user-plus', grad: 'blue', title: 'Beranting (Mengajak Orang Baru)', coverage: beranting, tiers: D.invitationTiers, totalMembers: g.members.length })}
    ${coverageCard({ icon: 'book-marked', grad: 'green', title: 'Berakar (Baca Alkitab Harian)', coverage: berakar, tiers: D.readingTiers, totalMembers: g.members.length, scopeNote: `Hanya menghitung anggota yang sudah punya akun login (${withAcc.length} dari ${g.members.length} anggota) — Baca Alkitab bersifat pribadi lewat akun masing-masing.` })}`)
  const appCard = (a, withCg) => C(`<div class="flex items-start justify-between gap-3"><div><div class="row-title" style="font-size:15px">${a.memberName}</div><div class="row-sub">Mengajukan ${a.roleName} · ${withCg ? `${a.careGroupName} · ` : ''}${formatLongDate(a.date)}</div></div>${badge(a.reviewed ? 'green' : 'blue', a.reviewed ? 'Sudah ditinjau' : 'Baru')}</div>
    <div class="flex-col gap-2" style="display:flex;margin-top:14px"><div><div class="chip-title" style="margin:0 0 3px">Alasan &amp; Motivasi</div><p class="text-sm">${a.reason}</p></div><div><div class="chip-title" style="margin:0 0 3px">Kesibukan Saat Ini</div><p class="text-sm">${a.availability}</p></div></div>
    <button type="button" class="btn btn-ghost btn-sm" style="margin-top:14px">${a.reviewed ? 'Tandai belum ditinjau' : 'Tandai sudah ditinjau'}</button>`)
  const pengajuan = stack(D.serviceApplicationSeed.filter((a) => a.careGroupId === g.id).map((a) => appCard(a, false)).join(''))
  const checkins = D.pelayananCheckinSeed.filter((c) => c.careGroupId === g.id).sort((a, b) => b.date.localeCompare(a.date))
  const presensiTab = stack(checkins.map((c) => C(`<div class="flex items-center justify-between gap-2"><div class="flex items-center gap-3">${icoSq('hand-helping', 'orange', true)}<div><div class="row-title">${c.memberName}</div><div class="row-sub">${c.roleName} · ${formatLongDate(c.date)}${c.note ? ` · ${c.note}` : ''}</div></div></div>${badge('green', 'Hadir')}</div>`)).join(''), 2)
  const jadwal = stack(`
    ${C(`${sectionTitle('Buat Jadwal Pertemuan Komsel')}<form class="flex-col gap-3" style="display:flex" onsubmit="return false">${field('Tanggal', `<input class="input" type="date" />`)}${field('Topik / Renungan', input())}${field('Deskripsi Acara (opsional)', textarea('', '', 2))}<p class="hint">Jam &amp; lokasi otomatis memakai jadwal rutin komsel: ${g.meetingTime}, ${g.meetingLocation}.</p>${addBtn('Tambah Jadwal')}</form>`)}
    ${stack([...g.meetings].reverse().map((m) => C(`<div class="flex items-start justify-between gap-2"><div><div class="row-title" style="font-size:15px">${m.topic}</div><div class="row-sub">${formatLongDate(m.date)}</div></div>${isPastMeeting(m.date) ? badge('ink', 'Sudah berlalu') : `<button type="button" class="btn btn-ghost btn-sm">${ic('pencil')} Edit</button>`}</div>`)).join(''), 2)}`)
  const khusus = D.eventsSeed.filter((e) => e.category === 'Acara Khusus')
  const khususTab = stack(`
    ${C(`${sectionTitle('Buat Jadwal Khusus')}<p class="text-sm muted" style="margin-bottom:14px">Untuk acara yang tidak terkait pertemuan komsel rutin, misalnya makan bersama.</p><form class="flex-col gap-3" style="display:flex" onsubmit="return false">${field('Nama Acara', input('', 'Makan Bersama Komsel'))}<div class="field-grid">${field('Tanggal', `<input class="input" type="date" />`)}${field('Jam', input('', '12:00'))}</div>${field('Lokasi', input())}${field('Catatan (opsional)', input())}${addBtn('Tambah')}</form>`)}
    ${khusus.length ? stack(khusus.map((e) => C(`<div class="row-title">${e.title}</div><div class="row-sub">${formatLongDate(e.date)}, ${e.time} · ${e.location}</div>`)).join(''), 2) : ''}`)
  const body = `
${adminHero('Ketua Komsel', g.name, 'Kelola peserta, kehadiran, dan jadwal Care Group-mu.')}
${tabs('lp', LTABS, 'peserta', { pengajuan: pending })}
${panel('lp', 'peserta', peserta, 'peserta')}${panel('lp', 'kehadiran', kehadiran, 'peserta')}${panel('lp', 'profil', profilCg, 'peserta')}${panel('lp', 'statistik', statistik, 'peserta')}${panel('lp', 'pengajuan', pengajuan, 'peserta')}${panel('lp', 'presensi', presensiTab, 'peserta')}${panel('lp', 'jadwal', jadwal, 'peserta')}${panel('lp', 'khusus', khususTab, 'peserta')}`
  return shell({ role: 'leader', active: 'admin', title: 'Panel Ketua Komsel', body })
}

/* =========================================================================
   Super Admin
   ========================================================================= */
export function superHome() {
  const total = D.careGroupsSeed.reduce((s, g) => s + g.members.length, 0)
  const upcoming = D.eventsSeed.filter((e) => e.date >= TODAY).length
  const recap = computeServiceRecap(D.pelayananCheckinSeed)
  const pend = D.pendingRegistrationSeed.length
  const body = `
${homeHeader('super')}
${temuFirmanCard('super')}
${shortcuts([
  { label: 'Panel Admin', icon: 'shield-check', grad: 'purple', href: 'super-admin-admin.html' },
  { label: 'Care Group', icon: 'users', grad: 'blue', href: 'program-cg-info.html' },
  { label: 'Temu Firman', icon: 'book-open-text', grad: 'green', href: 'temu-firman.html' },
  { label: 'Jadwal', icon: 'calendar-days', grad: 'teal', href: 'jadwal.html' },
  { label: 'Doa', icon: 'heart-handshake', grad: 'magenta', href: 'doa.html' },
  { label: 'Profil', icon: 'circle-user', grad: 'navy', href: 'profil.html' },
  { label: 'Pengaturan', icon: 'settings', grad: 'slate', href: 'pengaturan.html' },
])}
<div class="grid-3" data-reveal>${[[D.careGroupsSeed.length, 'Care Group', 'blue'], [total, 'Peserta', 'green'], [upcoming, 'Agenda', 'teal']].map(([n, l, c]) => `<div class="card stat-tile stat-${c}"><div class="num" data-count="${n}">${n}</div><div class="label">${l}</div></div>`).join('')}</div>
<a class="card hoverable link-row action-card" href="super-admin-admin.html#user" data-reveal>${icoSq('bell', 'orange')}<div class="flex-1"><div class="row-title">Perlu tindakan</div><div class="row-sub">${pend} pendaftar baru · 0 permintaan pindah CG</div></div>${ic('chevron-right', 'chev')}</a>
<div class="card" data-reveal>${sectionTitle('Rekap Pelayanan Member', `<a class="link text-sm" href="super-admin-admin.html#rekap" style="text-transform:none;letter-spacing:0">Rekap lengkap ${ic('chevron-right', 'inl')}</a>`)}<div class="row-list">${recap.slice(0, 4).map((r) => `<div class="row"><span class="flex-1 row-title">${r.roleName}</span>${badge('blue', `${r.memberCount} anggota`)}</div>`).join('')}</div></div>
<div class="card" data-reveal>${sectionTitle('Semua Care Group')}<div class="row-list">${D.careGroupsSeed.map((g) => `<div class="row">${icoSq('users', ['blue', 'green', 'orange'][D.careGroupsSeed.indexOf(g)], true)}<div class="flex-1"><div class="row-title">${g.name}</div><div class="row-sub">Ketua: ${g.leaderName}</div></div>${badge('ink', `${g.members.length} orang`)}</div>`).join('')}</div></div>
${announcementsCard()}`
  return shell({ role: 'super', active: 'home', title: 'Home · Super Admin', body, sheets: homeSheets('super') + announcementSheets() })
}

const STABS = [['renungan', 'Renungan'], ['komsel', 'Komsel'], ['peserta', 'Peserta'], ['user', 'Data User'], ['pengajuan', 'Pengajuan Pelayanan'], ['rekap', 'Rekap Pelayanan'], ['event', 'Event'], ['coaching', 'Jadwal Coaching']]

export function superAdmin() {
  const gs = D.careGroupsSeed
  const total = gs.reduce((s, g) => s + g.members.length, 0)
  const coaches = D.demoUsers.filter((u) => u.role === 'coach')
  const renungan = stack(`
    ${C(`${sectionTitle('Tambah Renungan')}<form class="flex-col gap-3" style="display:flex" onsubmit="return false"><div class="field-grid">${field('Minggu', input('', 'Minggu ke-2 Agustus'))}${field('Ayat', input('', 'Yohanes 3:16'))}</div>${field('Judul', input())}${field('Ringkasan', textarea('', '', 2))}${field('Pertanyaan diskusi (satu per baris)', textarea('', '', 3))}${addBtn('Tambah')}</form>`)}
    ${stack(D.materiSeed.map((m) => C(`<div class="row-sub">${m.week}</div><div class="row-title" style="font-size:15px">${m.title}</div><div class="text-sm" style="color:var(--blue-600);font-weight:700">${m.verse}</div><p class="text-sm" style="margin-top:6px">${m.summary}</p>`)).join(''), 2)}`)
  const komsel = stack(`
    ${stack(gs.map((g) => C(`<div class="flex items-center justify-between gap-2"><div><div class="row-title" style="font-size:15px">${g.name}</div><div class="row-sub">${g.category} · ${g.members.length} anggota</div></div>${badge('ink', `${g.meetingDay}, ${g.meetingTime}`)}</div>
      <div class="field-grid" style="margin-top:14px">${field('Ketua Komsel', select(g.members.map((m) => [m.id, m.name]), g.leaderId))}${field('Coach', `<select class="input"><option value="">Belum ditentukan</option>${coaches.map((c) => `<option value="${c.id}"${g.coachId === c.id ? ' selected' : ''}>${c.name}</option>`).join('')}</select>`)}</div>`)).join(''), 2)}
    ${C(`${sectionTitle('Buat Komsel Baru')}<form class="flex-col gap-3" style="display:flex" onsubmit="return false">${field('Nama Komsel', input('', 'Care Group "..."'))}${field('Kategori', select(D.careGroupCategories))}${field('Nama Ketua Komsel', input())}<div class="field-grid">${field('Hari', input('', 'Rabu'))}${field('Jam', input('', '19:00'))}</div>${field('Lokasi', input())}${field('Frekuensi', input('', '2x per bulan'))}${addBtn('Buat Komsel')}</form>`)}`)
  const pesertaTab = stack(`
    ${C(`${sectionTitle('Permintaan Pindah dari Leader')}<p class="text-sm muted">Belum ada permintaan. Leader meneruskan keinginan pindah CG anggotanya ke sini.</p>`)}
    ${C(`<p class="text-sm muted">Total peserta di semua Care Group</p><p style="font-size:30px;font-weight:800;color:var(--navy-900);line-height:1.2">${total}</p>`)}
    ${C(`${sectionTitle('Tambah Peserta ke Care Group')}<form class="flex-col gap-3" style="display:flex" onsubmit="return false"><div class="field-grid">${field('Nama', input())}${field('No. HP (opsional)', input())}</div><div class="field-grid">${field('Alamat (opsional)', input())}${field('Universitas (opsional)', input())}</div>${field('Care Group', select(gs.map((g) => g.name)))}${addBtn('Tambah')}</form>`)}
    <p class="hint">Sentuh nama untuk melihat data kontak &amp; memindahkan komsel.</p>
    ${gs.map((g) => C(`${sectionTitle(`${g.name} · ${g.members.length} anggota`)}<div class="row-list">${g.members.map((m) => `<details class="member"><summary class="row" style="cursor:pointer;padding:8px 0">${avatar(m.name, 'sm', m.initials)}<span class="flex-1 row-title">${m.name}</span>${badge(m.role === 'Leader' ? 'blue' : 'ink', m.role)}</summary><div class="member-detail"><span>${ic('phone', 'inl')} ${m.phone || '-'}</span><span>${ic('map-pin', 'inl')} ${m.address || '-'}</span><span>${ic('graduation-cap', 'inl')} ${m.university || '-'}</span><label class="flex items-center gap-2" style="padding-top:4px">${ic('arrow-right-left', 'inl')}<select class="input" style="max-width:260px"><option>Pindahkan ke komsel lain...</option>${gs.filter((o) => o.id !== g.id).map((o) => `<option>${o.name}</option>`).join('')}</select></label></div></details>`).join('')}</div>`)).join('')}`)
  const userTab = stack(`
    ${C(`${sectionTitle('Pendaftar Baru · Menunggu Persetujuan')}<div class="row-list">${D.pendingRegistrationSeed.map((p) => `<div class="row" style="flex-direction:column;align-items:stretch;gap:10px"><div class="flex items-center justify-between gap-2"><div class="flex items-center gap-3">${avatar(p.name, 'sm')}<div><div class="row-title">${p.name}</div><div class="row-sub">${p.phone} · Mendaftar ${formatShortDate(p.date)}</div></div></div>${badge('orange', 'Pending')}</div><div class="flex wrap items-center gap-2"><div style="min-width:200px;flex:1">${select(gs.map((g) => g.name), '', 'Pilih Care Group...')}</div><button type="button" class="btn btn-primary btn-sm">Setujui</button><button type="button" class="btn btn-ghost btn-sm">Tolak</button></div></div>`).join('')}</div>`)}
    ${C(`${sectionTitle('Buat User Baru')}<form class="flex-col gap-3" style="display:flex" onsubmit="return false"><div class="field-grid">${field('Nama', input())}${field('Nomor WA', input())}</div><div class="field-grid">${field('Peran', `<select class="input"><option>Anggota</option><option>Ketua Komsel</option><option>Coach</option><option>Super Admin</option></select>`)}${field('Care Group', select(gs.map((g) => g.name)))}</div>${addBtn('Buat User')}</form>`)}
    ${C(`${sectionTitle(`${D.demoUsers.length} User Terdaftar`)}<div class="row-list">${D.demoUsers.map((u) => `<div class="row">${avatar(u.name, 'sm', u.initials)}<div class="flex-1"><div class="row-title">${u.name}</div><div class="row-sub">${u.phone}${gs.find((g) => g.id === u.careGroupId) ? ` · ${gs.find((g) => g.id === u.careGroupId).name}` : ''}</div></div>${badge({ super_admin: 'purple', admin: 'blue', coach: 'orange', jemaat: 'ink' }[u.role], D.roleLabels[u.role])}</div>`).join('')}</div>`)}`)
  const apps = stack(D.serviceApplicationSeed.slice().sort((a, b) => b.date.localeCompare(a.date)).map((a) => C(`<div class="flex items-start justify-between gap-3"><div><div class="row-title" style="font-size:15px">${a.memberName}</div><div class="row-sub">Mengajukan ${a.roleName} · ${a.careGroupName} · ${formatLongDate(a.date)}</div></div>${badge(a.reviewed ? 'green' : 'blue', a.reviewed ? 'Sudah ditinjau' : 'Baru')}</div><div class="flex-col gap-2" style="display:flex;margin-top:14px"><div><div class="chip-title" style="margin:0 0 3px">Alasan &amp; Motivasi</div><p class="text-sm">${a.reason}</p></div><div><div class="chip-title" style="margin:0 0 3px">Kesibukan Saat Ini</div><p class="text-sm">${a.availability}</p></div></div><button type="button" class="btn btn-ghost btn-sm" style="margin-top:14px">${a.reviewed ? 'Tandai belum ditinjau' : 'Tandai sudah ditinjau'}</button>`)).join(''))
  const recap = computeServiceRecap(D.pelayananCheckinSeed)
  const maxC = Math.max(1, ...recap.map((r) => r.memberCount))
  const serving = new Set(D.pelayananCheckinSeed.map((c) => c.memberId)).size
  const rekap = stack(`
    <div class="grid-2"><div class="card stat-tile stat-orange"><div class="num" data-count="${serving}">${serving}</div><div class="label">Member yang melayani</div></div><div class="card stat-tile stat-blue"><div class="num" data-count="${recap.length}">${recap.length}</div><div class="label">Bidang pelayanan aktif</div></div></div>
    ${C(`<div class="flex items-center justify-between gap-2" style="margin-bottom:12px">${sectionTitle('Per Bidang')}<div style="min-width:160px">${select(['Semua bidang', ...recap.map((r) => r.roleName)])}</div></div><p class="hint" style="margin-bottom:14px">Jumlah anggota = orang yang berbeda yang pernah mencatat presensi di bidang itu. Ketuk bidang untuk melihat namanya.</p>
    <div class="row-list">${recap.map((r, i) => `<details class="rekap" ${i === 0 ? 'open' : ''}><summary><div class="flex items-center justify-between gap-2"><span class="row-title">${r.roleName}</span>${badge('blue', `${r.memberCount} anggota`)}</div><div class="bar-track" style="margin-top:9px"><div class="bar-fill" style="width:${(r.memberCount / maxC) * 100}%"></div></div></summary><div class="row-list" style="margin-top:10px">${r.members.map((m) => `<div class="row" style="padding:9px 0">${avatar(m.name, 'xs')}<div class="flex-1"><div class="text-sm" style="font-weight:600;color:var(--navy-900)">${m.name}</div><div class="row-sub">${m.careGroupName}</div></div><span class="row-sub">${m.count}× · terakhir ${formatShortDate(m.last)}</span></div>`).join('')}</div></details>`).join('')}</div>`)}`)
  const eventTab = (title, fixed) => {
    const list = fixed ? D.eventsSeed.filter((e) => e.category === fixed) : D.eventsSeed
    return stack(`
    ${C(`${sectionTitle(title)}<form class="flex-col gap-3" style="display:flex" onsubmit="return false">${field('Judul', input())}<div class="field-grid">${field('Tanggal', `<input class="input" type="date" />`)}${field('Jam', input('', '18:00'))}</div>${fixed ? '' : field('Kategori', select(D.eventCategories.filter((c) => c !== 'Semua')))}${field('Lokasi', input())}${field('Catatan (opsional)', input('', 'Tiap Selasa'))}${addBtn('Tambah')}</form>`)}
    ${stack(list.map((e) => C(`<div class="flex items-center justify-between gap-2"><div><div class="row-title" style="font-size:15px">${e.title}</div><div class="row-sub">${formatShortDate(e.date)}, ${e.time} · ${e.location}</div></div>${badge(evCat[e.category] || 'ink', e.category)}</div>`)).join(''), 2)}`)
  }
  const waiting = 0
  const body = `
${adminHero('Super Admin', 'Panel Admin', 'Renungan, komsel, peserta, user, dan rekap pelayanan.')}
${tabs('sp', STABS, 'renungan', { pengajuan: D.serviceApplicationSeed.filter((a) => !a.reviewed).length, user: D.pendingRegistrationSeed.length, peserta: waiting })}
${panel('sp', 'renungan', renungan, 'renungan')}${panel('sp', 'komsel', komsel, 'renungan')}${panel('sp', 'peserta', pesertaTab, 'renungan')}${panel('sp', 'user', userTab, 'renungan')}${panel('sp', 'pengajuan', apps, 'renungan')}${panel('sp', 'rekap', rekap, 'renungan')}${panel('sp', 'event', eventTab('Tambah Event', null), 'renungan')}${panel('sp', 'coaching', eventTab('Tambah Jadwal Coaching', 'Coaching'), 'renungan')}`
  return shell({ role: 'super', active: 'admin', title: 'Panel Admin', body })
}

/* =========================================================================
   Coach
   ========================================================================= */
export function coachHome() {
  const mine = D.careGroupsSeed.filter((g) => g.coachId === U.coach.id)
  const body = `
${homeHeader('coach')}
${temuFirmanCard('coach')}
${shortcuts([
  { label: 'Panel Pembinaan', icon: 'shield-check', grad: 'purple', href: 'coach-admin.html' },
  { label: 'Care Group', icon: 'users', grad: 'blue', href: 'program-cg-info.html' },
  { label: 'Temu Firman', icon: 'book-open-text', grad: 'green', href: 'temu-firman.html' },
  { label: 'Jadwal', icon: 'calendar-days', grad: 'teal', href: 'jadwal.html' },
  { label: 'Doa', icon: 'heart-handshake', grad: 'magenta', href: 'doa.html' },
  { label: 'Profil', icon: 'circle-user', grad: 'navy', href: 'profil.html' },
  { label: 'Pengaturan', icon: 'settings', grad: 'slate', href: 'pengaturan.html' },
])}
<div class="card tinted" data-reveal><div class="row-title" style="font-size:16px">${mine.length === 0 ? 'Belum ada Care Group yang ditugaskan' : `Kamu membina ${mine.length} Care Group`}</div><p class="text-sm muted" style="margin-top:6px">Buka Panel Pembinaan untuk melihat CG binaan, jadwal pembinaan, dan statistik gabungan.</p></div>
${announcementsCard()}`
  return shell({ role: 'coach', active: 'home', title: 'Home · Coach', body, sheets: homeSheets('coach') + announcementSheets() })
}

export function coachAdmin() {
  const groups = D.careGroupsSeed.filter((g) => g.coachId === U.coach.id)
  const cgTab = stack(groups.map((g) => C(`<div class="flex items-center justify-between gap-2"><div><div class="row-title" style="font-size:15px">${g.code} · ${g.name}</div><div class="row-sub">Leader: ${g.leaderName} · ${g.members.length} anggota</div></div>${badge('ink', g.category)}</div>
    <details class="rekap" style="margin-top:12px"><summary class="link text-sm" style="cursor:pointer">Lihat semua anggota &amp; peran</summary><div class="row-list" style="margin-top:10px">${g.members.map((m) => `<div class="row" style="padding:9px 0">${avatar(m.name, 'sm', m.initials)}<span class="flex-1 text-sm" style="font-weight:600;color:var(--navy-900)">${m.name}</span>${roleBadge(m.role)}</div>`).join('')}</div></details>`)).join(''))
  const coaching = D.eventsSeed.filter((e) => e.category === 'Coaching').sort((a, b) => a.date.localeCompare(b.date))
  const jadwalTab = stack(`
    ${C(`${sectionTitle('Buat Jadwal Pembinaan')}<p class="text-sm muted" style="margin-bottom:14px">Untuk pertemuan pembinaan dengan Leader, Kandidat Leader, Calon Leader, atau Pengurus CG yang kamu bina.</p><form class="flex-col gap-3" style="display:flex" onsubmit="return false">${field('Judul', input('', 'Pembinaan Leader Triwulan'))}<div class="field-grid">${field('Tanggal', `<input class="input" type="date" />`)}${field('Jam', input('', '19:00'))}</div>${field('Lokasi', input())}${field('Untuk Siapa (opsional)', input('', 'Leader &amp; Kandidat Leader CG Kasih Setia'))}${field('Catatan (opsional)', input())}${addBtn('Tambah')}</form>`)}
    ${stack(coaching.map((e) => C(`<div class="row-title" style="font-size:15px">${e.title}</div><div class="row-sub">${formatLongDate(e.date)}, ${e.time} · ${e.location}</div>${e.note ? `<p class="text-sm" style="margin-top:6px">${e.note}</p>` : ''}`)).join(''), 2)}`)
  const all = groups.flatMap((g) => g.members.map((m) => ({ ...m, gid: g.id })))
  const perGroup = groups.map((g) => { const p = g.meetings.filter((m) => isPastMeeting(m.date)); const slots = p.length * g.members.length; const pres = p.reduce((s, m) => s + Object.values(m.attendance).filter(Boolean).length, 0); return { name: g.name, pct: slots ? Math.round((pres / slots) * 100) : null } })
  const bertumbuh = summarizeTierCoverage(all, D.cgGrowthTiers, (m) => groups.find((g) => g.id === m.gid).meetings.filter((x) => x.attendance[m.id]).map((x) => x.date))
  const beranting = summarizeTierCoverage(all, D.invitationTiers, (m) => D.invitationSeed.filter((i) => i.memberId === m.id).map((i) => i.date))
  const withAcc = all.filter((m) => D.demoUsers.some((u) => u.memberId === m.id))
  const berakar = summarizeTierCoverage(all, D.readingTiers, (m) => { const a = D.demoUsers.find((u) => u.memberId === m.id); return a ? D.bibleReadingCheckinSeed.filter((c) => c.userId === a.id).map((c) => c.date) : null })
  const stat = stack(`
    ${C(`${sectionTitle('Ringkasan Semua CG Binaan')}<div class="grid-2"><div class="stat-tile"><div class="num" data-count="${groups.length}">${groups.length}</div><div class="label">Care Group</div></div><div class="stat-tile"><div class="num" data-count="${all.length}">${all.length}</div><div class="label">Total Anggota</div></div></div>
    <div class="row-list" style="margin-top:16px">${perGroup.map((g) => `<div class="row"><span class="flex-1 flex items-center gap-2 text-sm" style="font-weight:600;color:var(--navy-900)">${ic('users', 'inl')} ${g.name}</span>${badge(g.pct === null ? 'ink' : 'blue', g.pct === null ? 'Belum ada data' : `Kehadiran ${g.pct}%`)}</div>`).join('')}</div>`)}
    ${coverageCard({ icon: 'trending-up', grad: 'orange', title: 'Bertumbuh (Kehadiran CG) — Gabungan', coverage: bertumbuh, tiers: D.cgGrowthTiers, totalMembers: all.length })}
    ${coverageCard({ icon: 'user-plus', grad: 'blue', title: 'Beranting (Mengajak Orang Baru) — Gabungan', coverage: beranting, tiers: D.invitationTiers, totalMembers: all.length })}
    ${coverageCard({ icon: 'book-marked', grad: 'green', title: 'Berakar (Baca Alkitab Harian) — Gabungan', coverage: berakar, tiers: D.readingTiers, totalMembers: all.length, scopeNote: `Hanya menghitung anggota yang sudah punya akun login (${withAcc.length} dari ${all.length} anggota) — Baca Alkitab bersifat pribadi lewat akun masing-masing.` })}`)
  const body = `
${pageHero({ eyebrow: 'Coach', title: 'Panel Pembinaan', sub: groups.length ? `Membina ${groups.length} Care Group.` : 'Belum ada Care Group yang ditugaskan padamu.', right: `<span class="ico-sq g-purple hero-ico">${ic('compass')}</span>` })}
${tabs('cp', [['cg', 'CG Binaan'], ['jadwal', 'Jadwal Pembinaan'], ['statistik', 'Statistik']], 'cg')}
${panel('cp', 'cg', cgTab, 'cg')}${panel('cp', 'jadwal', jadwalTab, 'cg')}${panel('cp', 'statistik', stat, 'cg')}`
  return shell({ role: 'coach', active: 'admin', title: 'Panel Pembinaan', body })
}

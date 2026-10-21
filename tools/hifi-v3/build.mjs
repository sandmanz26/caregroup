import fs from 'node:fs'
import path from 'node:path'
import { authShell, ic, LUCIDE, ROOT_SVG } from './lib.mjs'
import * as M from './pages-member.mjs'
import * as A from './pages-admin.mjs'

const OUT = process.argv[2] || '/Users/chandra/CareGroup/full_design_v3'

const pages = {
  'login.html': M.login(),
  'register.html': M.register(),
  'member-home.html': M.memberHome(),
  'member-home-nogroup.html': M.memberHomeNoGroup(),
  'program-cg.html': M.programCg('member'),
  'program-cg-leader.html': M.programCg('leader'),
  'program-cg-info.html': M.programCgInfo('super'),
  'temu-firman.html': M.temuFirman(),
  'presensi.html': M.presensi(),
  'profil.html': M.profil(),
  'pengaturan.html': M.pengaturan(),
  'tentang.html': M.tentang(),
  'jadwal.html': M.jadwal(),
  'doa.html': M.doa(),
  'leader-home.html': A.leaderHome(),
  'leader-admin.html': A.leaderAdmin(),
  'super-admin-home.html': A.superHome(),
  'super-admin-admin.html': A.superAdmin(),
  'coach-home.html': A.coachHome(),
  'coach-admin.html': A.coachAdmin(),
}

/* ---------------------------- Design system ---------------------------- */
const sw = (name, hex, use, dark = false) => `<div class="sw"><div class="sw-chip" style="background:${hex};color:${dark ? '#fff' : 'var(--navy-900)'}">${hex}</div><div class="sw-name">${name}</div><div class="sw-use">${use}</div></div>`
const designSystem = `<!doctype html>
<html lang="id"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Design System · Shema</title>
<link rel="icon" type="image/png" href="assets/logo-shema.png" />
<link rel="stylesheet" href="assets/styles.css" /><script src="${LUCIDE}"></script><script defer src="assets/app.js"></script>
<style>
.ds{max-width:1040px;margin:0 auto;padding:48px 24px 100px}
.ds h2{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--blue-600);margin:46px 0 16px}
.sw-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
.sw-chip{height:76px;border-radius:16px;display:flex;align-items:flex-end;padding:10px 12px;font-size:12px;font-weight:800;box-shadow:var(--shadow-sm);border:1px solid rgba(10,27,64,.06)}
.sw-name{font-weight:800;font-size:13.5px;color:var(--navy-900);margin-top:9px}.sw-use{font-size:12px;color:var(--ink-500);line-height:1.35}
.ratio{display:flex;height:64px;border-radius:18px;overflow:hidden;box-shadow:var(--shadow-sm)}
.ratio div{display:flex;align-items:center;padding:0 16px;font-weight:800;font-size:13px}
.map{width:100%;border-collapse:collapse;font-size:13.5px}.map th{text-align:left;font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-500);padding:8px 10px}.map td{padding:11px 10px;border-top:1px solid var(--line-soft);vertical-align:middle}
.demo{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.logo-row{display:flex;align-items:center;gap:26px;flex-wrap:wrap}.logo-row img{width:150px;height:150px;object-fit:contain}
.dots{display:flex;gap:8px;flex-wrap:wrap}.dots i{width:30px;height:30px;border-radius:50%;display:block;box-shadow:var(--shadow-xs)}
</style></head><body>
<div class="ds">
  <a class="link text-sm" href="index.html">← Kembali ke ringkasan</a>
  <div class="logo-row" style="margin-top:20px"><img src="assets/logo-shema.png" alt="Shema" /><div><p class="eyebrow">Design system · v3.1</p><h1 class="page-title" style="font-size:36px">Warna dari logo, ditata seimbang</h1><p class="muted" style="max-width:560px;margin-top:8px">Logo Shema punya sembilan warna sekaligus. Supaya tetap rapi, setiap warna diberi <strong>satu fungsi tetap</strong> dan porsinya diatur dengan aturan 60 / 30 / 10 — bukan ditebar rata.</p></div></div>

  <h2>Aturan porsi 60 / 30 / 10</h2>
  <div class="ratio"><div style="flex:60;background:var(--bg);color:var(--ink-700)">60% · Netral putih-kebiruan — permukaan &amp; kartu</div><div style="flex:30;background:var(--navy-900);color:#fff">30% · Navy — teks &amp; header</div><div style="flex:10;background:var(--ribbon);color:#fff;justify-content:center">10%</div></div>
  <p class="text-sm muted" style="margin-top:10px">Sepuluh persen terakhir dibagi ke warna-warna logo. Biru memegang peran terbesar (aksi utama), warna lain hanya muncul sebagai ikon, lencana, atau garis aksen — tidak pernah sebagai latar kartu penuh.</p>

  <h2>Palet logo (diambil langsung dari logo, lalu diturunkan sedikit saturasinya)</h2>
  <div class="sw-row">
    ${sw('Navy', '#0A1B40', 'Tulisan SHEMA di logo · teks, header', true)}
    ${sw('Biru', '#0A74D9', 'Aksi utama · Care Group · Beranting', true)}
    ${sw('Hijau', '#2F9E0B', 'Temu Firman · sukses · Berakar', true)}
    ${sw('Oranye', '#F59B0A', 'Sorotan · streak · Presensi · Bertumbuh')}
    ${sw('Merah', '#E23B24', 'Pelayanan · peringatan · Berbuah', true)}
    ${sw('Ungu', '#7F23C6', 'Kepemimpinan: Leader, Admin, Coach', true)}
    ${sw('Teal', '#0AA39F', 'Jadwal &amp; informasi', true)}
    ${sw('Kuning', '#E6A100', 'Q&amp;A · pita logo')}
    ${sw('Magenta', '#A91F8F', 'Doa · Tentang SDA', true)}
  </div>
  <p class="text-sm muted" style="margin-top:14px">Pita tipis kuning → hijau → teal → biru pada header dan sidebar meniru panah pertumbuhan di logo.</p>
  <div style="height:6px;border-radius:6px;background:var(--ribbon);margin-top:12px"></div>

  <h2>Peran tiap warna di aplikasi</h2>
  <div class="card"><table class="map"><thead><tr><th>Warna</th><th>Fungsi tetap</th><th>Dipakai di</th></tr></thead><tbody>
    <tr><td><span class="badge b-blue">Biru</span></td><td>Aksi utama &amp; navigasi aktif</td><td>Tombol utama, tab aktif, Care Group, Beranting</td></tr>
    <tr><td><span class="badge b-green">Hijau</span></td><td>Firman &amp; keberhasilan</td><td>Temu Firman, status “Hadir / Selesai”, Berakar</td></tr>
    <tr><td><span class="badge b-orange">Oranye</span></td><td>Sorotan &amp; pelayanan harian</td><td>Streak akar, notifikasi, Presensi, Bertumbuh</td></tr>
    <tr><td><span class="badge b-red">Merah</span></td><td>Pelayanan &amp; perhatian</td><td>Pelayanan, Berbuah, tingkat “merah”</td></tr>
    <tr><td><span class="badge b-purple">Ungu</span></td><td>Kepemimpinan</td><td>Panel Admin, Leader, Coach</td></tr>
    <tr><td><span class="badge b-teal">Teal</span></td><td>Informasi &amp; waktu</td><td>Jadwal, Info Umum, Penuntun Doa</td></tr>
  </tbody></table></div>

  <h2>Faithful Journey — satu warna per perjalanan</h2>
  <div class="journey-row">${['rooted', 'branching', 'growing', 'fruitful'].map((j, i) => `<div class="j-card jc-${j}"><img src="assets/journey-${j}.svg" alt="" /><div class="j-name">${['🌱 Berakar', '🌿 Beranting', '🌳 Bertumbuh', '🍎 Berbuah'][i]}</div><div class="j-en">${['Rooted', 'Branching', 'Growing', 'Fruitful'][i]} Journey</div><div class="progress-track"><div class="progress-fill" style="width:${[35, 50, 75, 100][i]}%"></div></div></div>`).join('')}</div>

  <h2>Ikon bulat (ketuk → penjelasan lengkap)</h2>
  <div class="card"><div class="shortcuts">${[['book-open-text', 'green', 'Temu Firman'], ['users', 'blue', 'Care Group'], ['hand-helping', 'orange', 'Presensi'], ['heart-handshake', 'red', 'Pelayanan'], ['shield-check', 'purple', 'Panel Admin'], ['calendar-days', 'teal', 'Jadwal'], ['circle-help', 'amber', 'Q&amp;A'], ['info', 'magenta', 'Tentang SDA']].map(([i, g, l]) => `<div class="shortcut"><span class="sc-ico g-${g}">${ic(i)}</span><span>${l}</span></div>`).join('')}</div></div>

  <h2>Komponen</h2>
  <div class="card flex-col gap-4" style="display:flex">
    <div class="demo"><button class="btn btn-primary">${ic('plus')} Tombol utama</button><button class="btn btn-ghost">Sekunder</button><button class="btn btn-primary btn-sm">Kecil</button><button class="btn btn-primary" disabled>Nonaktif</button></div>
    <div class="demo"><span class="badge b-blue">Leader</span><span class="badge b-green">Hadir</span><span class="badge b-orange">Pending</span><span class="badge b-red">Siap membelah</span><span class="badge b-purple">Super Admin</span><span class="badge b-teal">Ibadah</span><span class="badge b-coklat">Mulai Berakar</span><span class="badge b-ink">Segera hadir</span></div>
    <div class="demo"><span class="avatar av-md av-blue">AW</span><span class="avatar av-md av-green">BL</span><span class="avatar av-md av-orange">CT</span><span class="avatar av-md av-purple">DA</span><span class="avatar av-md av-teal">ES</span><span class="avatar av-md av-red">FH</span><span class="text-sm muted">Avatar diwarnai otomatis dari kelima warna logo.</span></div>
    <div class="chips" data-chips="ds"><button class="chip active">Semua</button><button class="chip">Ibadah</button><button class="chip">Care Group</button><button class="chip">Coaching</button></div>
    <div class="grid-2"><div class="field"><label>Nomor WA</label><input class="input" placeholder="0812-3456-7890" /></div><div class="field"><label>Kata Sandi</label><input class="input" type="password" value="demo123" /></div></div>
    <div class="stepper"><div class="step done"><div class="step-dot">${ic('check')}</div><div class="step-label">New Comer</div></div><div class="step active"><div class="step-dot">2</div><div class="step-label">First Coaching</div></div><div class="step"><div class="step-dot">3</div><div class="step-label">Second Coaching</div></div></div>
  </div>

  <h2>Tipografi</h2>
  <div class="card"><p class="eyebrow">Fraunces · ayat &amp; kutipan</p><p class="scripture" style="font-size:24px;margin:6px 0 18px">&ldquo;Siapa setia dalam perkara-perkara kecil, ia setia juga dalam perkara-perkara besar.&rdquo;</p>
  <p class="eyebrow">Plus Jakarta Sans · antarmuka</p><h1 style="font-size:30px;margin:6px 0">Selamat pagi, Calvin</h1><p>Teks isi 15px — nyaman dibaca, dan ikut membesar lewat Pengaturan → Ukuran Font (0.9× sampai 1.3×).</p></div>

  <h2>Header: matahari terbit di atas biru logo</h2>
  <div class="page-hero"><div><div class="hero-eyebrow">Contoh</div><h1>Temu Firman</h1><p class="hero-sub">Gradasi navy → biru, cahaya oranye dari kanan atas, siluet kota, dan pita logo di tepi bawah.</p></div></div>
</div></body></html>`

/* ------------------------------ Hub (index) ------------------------------ */
const link = (href, label, sub = '') => `<a class="card hoverable link-card" href="${href}"><div class="row-title">${label}</div>${sub ? `<div class="row-sub">${sub}</div>` : ''}</a>`
const group = (title, items) => `<h2 class="group-title">${title}</h2><div class="link-grid">${items.map((i) => link(...i)).join('')}</div>`
const rev = [
  ['1', 'Saat teduh digabung dengan baca Alkitab → <strong>Temu Firman (Word Encounter)</strong>', '<a class="link" href="temu-firman.html">Temu Firman</a>'],
  ['2', 'Temu Firman di beranda diletakkan <strong>sebelum</strong> info Care Group', '<a class="link" href="member-home.html">Home Anggota</a>'],
  ['3', 'Visual tambahan di sub menu — ikon bulat berwarna &amp; ilustrasi', 'Semua Home · <a class="link" href="program-cg.html">Program CG</a>'],
  ['4', 'Sapaan di kiri atas; kanan atas: lonceng + streak komsel dengan <strong>logo akar</strong>', '<a class="link" href="member-home.html">Home</a> (header)'],
  ['5', '<strong>Ikon keluar</strong> di Home — data tetap tersimpan', 'Header Home, ikon paling kanan'],
  ['6', 'Profil: <strong>ikon pengaturan</strong> → ubah profil, kode sandi, ukuran font', '<a class="link" href="profil.html">Profil</a> → <a class="link" href="pengaturan.html">Pengaturan</a>'],
  ['7', 'Jobdesk peran ditambah <strong>Pengurus CG</strong>, diedit oleh Leader', '<a class="link" href="leader-admin.html#profil">Panel Leader → Profil CG</a>'],
  ['8', 'Pindah member CG: member → Leader → Admin', '<a class="link" href="leader-admin.html#peserta">Panel Leader</a> · <a class="link" href="super-admin-admin.html#peserta">Panel Admin</a>'],
  ['9', '<strong>Q&amp;A</strong> di bawah Contact Us', 'Bagian bawah <a class="link" href="member-home.html">Home</a>'],
  ['10', 'Admin Utama: <strong>rekapitulasi pelayanan</strong> member', '<a class="link" href="super-admin-admin.html#rekap">Panel Admin → Rekap Pelayanan</a>'],
  ['11', 'Logo di Home &amp; Care Group — penjelasan lengkap saat diklik', 'Ketuk ikon di <a class="link" href="program-cg.html">Program CG</a>'],
  ['12', 'Ayat &amp; renungan di atas; tangga → <strong>Faithful Journey</strong> bergambar', '<a class="link" href="temu-firman.html">Temu Firman</a>'],
  ['13', 'Presensi: daftar pelayanan baru (Ibadah KBU … Komisi Dewasa)', '<a class="link" href="presensi.html">Presensi</a>'],
]
const hub = `<!doctype html>
<html lang="id"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Shema — Desain Hi-Fi</title>
<link rel="icon" type="image/png" href="assets/logo-shema.png" />
<link rel="stylesheet" href="assets/styles.css" /><script src="${LUCIDE}"></script><script defer src="assets/app.js"></script>
<style>
.hub{max-width:1040px;margin:0 auto;padding:0 20px 90px}
.hub-hero{margin:28px 0 0;position:relative;border-radius:var(--r-xl);color:#fff;overflow:hidden;padding:36px 34px 44px;box-shadow:var(--shadow-lg);background:radial-gradient(520px 300px at 96% -10%,rgba(255,161,3,.7),transparent 62%),radial-gradient(380px 260px at -4% 112%,rgba(2,174,171,.4),transparent 62%),linear-gradient(135deg,#0A2766 0%,#0A55BD 56%,#1D84E5 100%)}
.hub-hero::after{content:'';position:absolute;inset:0;opacity:.14;background:url('assets/skyline.svg') right bottom/auto 80% no-repeat;pointer-events:none}
.hub-hero::before{content:'';position:absolute;left:0;right:0;bottom:0;height:6px;background:var(--ribbon);z-index:3}
.hub-hero>*{position:relative;z-index:2}.hub-hero img{width:92px;height:92px;object-fit:contain;background:#fff;border-radius:26px;padding:8px;box-shadow:var(--shadow-md)}
.hub-hero h1{color:#fff;font-size:36px;margin-top:16px}.hub-hero p{color:rgba(255,255,255,.86);max-width:640px;margin-top:10px}
.group-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--blue-600);margin:40px 0 14px}
.link-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}.link-card{padding:16px 18px;display:block}
table.map{width:100%;border-collapse:collapse;font-size:13.5px}table.map th{text-align:left;font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-500);padding:8px 10px}table.map td{padding:11px 10px;border-top:1px solid var(--line-soft);vertical-align:top}table.map td:first-child{width:34px;color:var(--ink-400);font-weight:800}
.pal{display:flex;height:14px;border-radius:99px;overflow:hidden;margin-top:18px}.pal i{flex:1}
</style></head><body><div class="hub">
  <div class="hub-hero"><img src="assets/logo-shema.png" alt="Shema" /><p class="hero-eyebrow" style="margin-top:18px">Desain hi-fi · v3.1</p><h1>Shema, siap dipresentasikan</h1>
  <p>Desain high-fidelity yang <strong>mengikuti persis</strong> prototipe lo-fi yang sudah disetujui — struktur, isi, dan data sama — dengan palet warna yang diambil dari logo, ditata seimbang dan bersih.</p></div>

  <div class="grid-3" style="margin-top:22px">
    <div class="card"><div class="eyebrow">Sumber kebenaran</div><p class="text-sm" style="margin-top:6px">Setiap halaman dihasilkan dari kode &amp; data <code>src/</code> yang sama dengan aplikasi — angka streak, tingkat, dan rekap dihitung, bukan diketik ulang.</p></div>
    <div class="card"><div class="eyebrow">Warna</div><p class="text-sm" style="margin-top:6px">Aturan 60 / 30 / 10: netral &amp; navy mendominasi, tiap warna logo punya satu fungsi tetap. <a class="link" href="design-system.html">Lihat design system →</a></p><div class="pal"><i style="background:#0A1B40"></i><i style="background:#0A74D9"></i><i style="background:#2F9E0B"></i><i style="background:#F59B0A"></i><i style="background:#E23B24"></i><i style="background:#7F23C6"></i><i style="background:#0AA39F"></i></div></div>
    <div class="card"><div class="eyebrow">Cara melihat</div><p class="text-sm" style="margin-top:6px">Buka dari <strong>Login</strong> lalu pilih peran demo, atau langsung lompat ke halaman di bawah. Statis (HTML/CSS/JS) — tidak terhubung ke React.</p></div>
  </div>

  ${group('Mulai', [['login.html', 'Masuk', 'Dengan mode demo per peran'], ['register.html', 'Daftar Akun', 'Menunggu persetujuan Admin'], ['design-system.html', 'Design System', 'Palet logo, komponen, tipografi']])}
  ${group('Anggota (Calvin Tanto)', [['member-home.html', 'Home', 'Header, Temu Firman, ikon, Faithful Journey'], ['member-home-nogroup.html', 'Home · belum bergabung CG', 'Kondisi khusus akun baru'], ['program-cg.html', 'Program CG', 'Ikon → penjelasan lengkap'], ['temu-firman.html', 'Temu Firman', 'Ayat, renungan, Faithful Journey'], ['presensi.html', 'Presensi', 'Bidang pelayanan baru'], ['profil.html', 'Profil', 'Shema Growth, ikon pengaturan'], ['pengaturan.html', 'Pengaturan', 'Profil, kode sandi, ukuran font'], ['tentang.html', 'Tentang SDA', 'Peran &amp; ajukan pelayanan']])}
  ${group('Ketua Komsel (Andra Wijaya)', [['leader-home.html', 'Home', 'Pengingat kehadiran, streak'], ['program-cg-leader.html', 'Program CG', 'Kehadiran bisa diedit'], ['leader-admin.html', 'Panel Leader', '8 tab: peserta, kehadiran, profil CG, …'], ['jadwal.html', 'Jadwal', 'Agenda dengan filter kategori']])}
  ${group('Super Admin (Pdt. Budi Santoso)', [['super-admin-home.html', 'Home', 'Ringkasan &amp; rekap pelayanan'], ['super-admin-admin.html', 'Panel Admin', '8 tab termasuk Rekap Pelayanan'], ['doa.html', 'Pokok Doa', 'Hanya Super Admin &amp; Coach']])}
  ${group('Coach (Pdt. Yohanes Setiawan)', [['coach-home.html', 'Home', 'CG binaan'], ['coach-admin.html', 'Panel Pembinaan', 'CG binaan, jadwal, statistik gabungan'], ['program-cg-info.html', 'Program CG · info umum', 'Tanpa Care Group sendiri']])}

  <div class="card" style="margin-top:40px"><div class="section-title"><span>13 revisi PPTX — masih terpenuhi di hi-fi</span></div>
  <table class="map"><thead><tr><th>#</th><th>Revisi</th><th>Lihat di</th></tr></thead><tbody>${rev.map(([n, t, w]) => `<tr><td>${n}</td><td>${t}</td><td>${w}</td></tr>`).join('')}</tbody></table></div>

  <div class="card" style="margin-top:20px"><div class="section-title"><span>Catatan desain</span></div>
  <ul class="flex-col gap-2" style="display:flex;font-size:13.5px">
    <li><strong>Halaman bersama</strong> (Temu Firman, Presensi, Profil, Pengaturan, Tentang) ditampilkan dari sudut pandang Calvin; Jadwal dari sudut pandang Ketua Komsel; Doa dari Super Admin — sesuai siapa yang melihat menu itu di lo-fi.</li>
    <li><strong>Foto</strong> kegiatan &amp; poster memakai gambar placeholder (picsum.photos) — ganti dengan dokumentasi asli saat produksi.</li>
    <li><strong>Ukuran font</strong> di Pengaturan berfungsi nyata (0.9× – 1.3×) dan tersimpan di perangkat.</li>
    <li><strong>Aplikasi mobile (target React Native)</strong>: setiap layar tampil di bingkai ponsel 390×844 dengan status bar, tab bar 5 menu, app bar kembali, dan bottom sheet di dalam layar. Dibuka di ponsel sungguhan → penuh layar tanpa bingkai.</li>
    <li><strong>Tab bar 5 menu</strong>: Jadwal, Doa, dan Presensi (untuk Leader/Admin/Coach) dibuka lewat ikon di Home, bukan tab.</li>
  </ul></div>
</div></body></html>`

fs.mkdirSync(OUT, { recursive: true })
for (const [name, html] of Object.entries(pages)) fs.writeFileSync(path.join(OUT, name), html)
fs.writeFileSync(path.join(OUT, 'design-system.html'), designSystem)
fs.writeFileSync(path.join(OUT, 'index.html'), hub)
console.log('wrote', Object.keys(pages).length + 2, 'pages →', OUT)

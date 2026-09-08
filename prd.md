# PRD — Care Group App (Shema) — GKI Gejayan

> **Living document.** This file is updated every time a new requirement comes in.
> Before implementing a new request, check it against this document for conflicts
> with existing decisions. If a conflict is found, it is surfaced to the user
> before any code changes are made — see **Decision Log** for how prior conflicts
> were resolved.
>
> Companion file: [changes.md](changes.md) logs *what shipped* per request.
> This file describes *what the product currently is and is meant to be*.

Last updated: 2026-09-08 (Coach role + Leader-panel corrections batch)

---

## Cara Membaca Dokumen Ini

Dokumen ini ditulis supaya bisa dipahami walau bukan oleh developer. Tiap
fitur di **Bagian 5 (Rincian Fitur)** ditandai status-nya:

- ✅ **Sudah Ada** — bisa dipakai di aplikasi sekarang, sudah dicoba jalan.
- 🟡 **Sebagian** — sebagian dari fitur ini sudah ada, sebagian lagi belum.
- 🚧 **Belum Ada (Direncanakan)** — baru permintaan/rencana, belum dibangun.

Kalau tidak ada tanda sama sekali, artinya fitur itu ✅ sudah ada. **Bagian 6
(Struktur Data)** dan **Bagian 7 (Catatan Keputusan)** lebih teknis (menyebut
nama file/kode) — ditujukan untuk developer yang melanjutkan proyek ini,
boleh dilewati oleh pembaca non-teknis.

---

## 1. Product Overview

A frontend-only, lo-fi/mockup web app for **Tim Sumber Daya Aktifis (SDA)**, GKI
Gejayan's ministry-mobilization program. The app's visible brand is **Shema**
(per source deck: "Aplikasi Shema") — shown as the app-identity label in the
sidebar, mobile top bar, Login/Register, Profil footer, and the page title;
"Care Group" remains the correct name for the small-group feature itself and
is unchanged everywhere it's used that way (Decision Log #10). No backend —
all data is in-memory mock data
seeded on load and persisted to `localStorage` per browser, so the app is
stateful across reloads but not shared across devices/users.

Core mission line (from source materials): *"1 orang, 1 Care Group, 1
pelayanan"* — every congregant belongs to one Care Group (small group) and
serves in one ministry role.

Design direction: intentionally lo-fi/wireframe — warm neutral palette + one
terracotta accent, minimal decoration, functional over polished. Responsive:
sidebar nav on desktop, bottom tab bar + top bar on mobile.

## 2. Roles

| Role (internal key) | Label shown in UI | Description |
|---|---|---|
| `jemaat` | Anggota | Regular member/congregant. Default role for anyone who self-registers. |
| `admin` | Ketua Komsel | Leader of one specific Care Group. Manages that group's members, attendance, applications, schedule. **As of Decision Log #15, a single Care Group can have more than one `admin` account at once** — a member promoted all the way to "Kandidat Leader" (§5.9) gains a real `admin` account scoped to that same group (a co-leader), alongside the group's original/named Leader. |
| `coach` | Coach | Oversees several Care Groups (a "head of Leader") — one Coach per CG (`careGroup.coachId`, assigned by Super Admin), not a member of the groups they coach. Own panel (§5.11); no `careGroupId` of their own (same pattern as `super_admin`). |
| `super_admin` | Super Admin | Org-wide admin. Manages all Care Groups, renungan content, events, and can move members between groups. |

A user's role is fixed at the account level (not switchable by the user). One
demo account per role exists — see `src/data/mockData.js` → `demoUsers`
(trimmed from 5 to 3 per Decision Log #12; the two removed `jemaat` variants
existed to preview membership-threshold nuance that's no longer relevant now
that every account is created already-in-a-CG).

## 3. Auth & Onboarding

- **Login**: by **Nomor WA (phone number)** + password. Username-based login was
  replaced by phone-based login per explicit request (see Decision Log #4).
- **Self-registration is approval-based, not instant.** `/register` collects
  only **Nama Lengkap + Nomor WA** (no password — see Decision Log #3 for why
  the form stays minimal) and creates a **pending** entry
  (`pendingRegistrations`), showing a "menunggu persetujuan admin"
  confirmation. No account exists yet — the phone/password combo doesn't
  work at `/login` until a Super Admin approves it (§5.10): approval picks a
  Care Group, auto-generates a password (shown once to the admin to relay),
  creates the real account, and adds the person as a CG member — all in one
  step (`approvePendingRegistration()`). A "Tolak" (reject) action just
  discards the pending entry.
- **Every account is placed into a Care Group at the moment it starts
  existing** — there is no more "registered but unplaced" `jemaat` state
  (Decision Log #12, **reverses** the original §3/§8 design). `createUser()`
  (used by both the approval flow and Super Admin's direct "Buat User Baru")
  refuses to create a `jemaat` account without a `careGroupId`.
- The pre-app procedure described in the source deck (dedicated SDA info page
  on the church website, contacting a WA admin, admin qualifying the lead
  before handing them app credentials) is **out of scope** — explicitly
  skipped per Decision Log #1. The approval step above is this app's own
  in-app substitute for that qualification step, not a re-introduction of it.

## 4. Navigation (Information Architecture)

### Member (`jemaat`)
Bottom nav / sidebar, in order:
1. **Home**
2. **Program CG** (Care Group)
3. **Baca Alkitab**
4. **Presensi** (Pelayanan)
5. **Profil**

**Jadwal** and **Doa** are currently **hidden from the member nav** (Decision
Log #6) — routes still exist and still work for staff roles, but no nav entry
or Home-page shortcut is shown to `jemaat`. This is explicitly temporary
("dulu") — final treatment (delete vs. relocate vs. keep as extra tab) is
still pending further detail from the user (see §9 Open Items).

### Ketua Komsel (`admin`)
Same base nav as member **plus Jadwal** (Doa removed specifically for this
role per explicit request — Decision Log #15), plus an **Admin** entry
(→ `/admin`) hosting `KetuaKomselPanel`.

### Super Admin (`super_admin`)
Same base nav as member **plus Jadwal and Doa** (unaffected by the Leader-only
change above), plus an **Admin** entry (→ `/admin`) hosting `SuperAdminPanel`.

### Coach (`coach`)
Same nav shape as Super Admin (full base nav + Jadwal + Doa + **Admin** entry),
but the Admin entry hosts `CoachPanel` (§5.11) instead — scoped to only the
Care Groups this Coach is assigned to, not every CG.

### Routes not in any nav
- `/tentang` — reached via a link from Profil. Shows SDA role glossary +
  (for eligible members) the "Ajukan Pelayanan" application form.
- `/login`, `/register` — public, unauthenticated.

## 5. Feature Specs

### 5.1 Home (`/`)
Role-specific dashboard.

- **Member view**: greeting, **Kehadiran Belum Lengkap** reminder (Ketua
  Komsel only, §5.9 — links to the Kehadiran tab when a recent, still-
  editable meeting isn't fully marked yet), journey stepper (see §5.7),
  CG-attendance streak card, membership lock/unlock card, next-meeting card,
  **Saat Teduh Hari Ini** card (today's Daily Shema renungan + done/not-done
  status, links to `/baca-alkitab` — see below), quick links (Baca Alkitab +
  Komsel Saya, same for both `jemaat` and Ketua Komsel — Pokok Doa isn't
  nav-reachable for Ketua Komsel anymore, so its Home shortcut was dropped
  too, Decision Log #15), announcements, then **Contact Us / Warta Jemaat /
  Kegiatan CG Terbaru** (see below). The CG's own profile description
  (§5.9) shows on `/komsel`, not Home — see Decision Log #16 for why that
  moved off Home entirely.
- **No-group member view**: welcome card, journey stepper, **Saat Teduh
  Hari Ini** (Baca Alkitab doesn't require a CG per §5.3, so it works from
  day one), announcements. No Contact Us/CG-photo section here since
  there's no CG to source it from.
- **Super Admin view**: org-wide stats (CG count, total peserta, upcoming
  agenda count), link to Admin panel, list of all CGs, announcements.
- **Saat Teduh Hari Ini** (`SaatTeduhCard`, member views only) reads the
  actual Daily Shema state (`renunganList[0]` + `bibleReadingCheckins`) —
  this replaced an earlier "Renungan Minggu Ini" card that confusingly
  pulled from the unrelated Program CG weekly `materi` data, so completing
  a day's Saat Teduh never showed up on Home. Fixed per explicit report.
- **Contact Us / Warta Jemaat / Kegiatan CG Terbaru** (`ChurchInfoSection`,
  main member Home only): "Warta Jemaat" is an honestly-labeled "Segera
  hadir" row (no real destination exists, so no fake link); "Contact Us"
  lists the member's own CG leader as a real `tel:` link plus static
  `churchContacts` seed entries; "Kegiatan CG Terbaru" is a placeholder
  photo gallery from the CG's own `activityPhotos` field (hidden if empty,
  as `cg3` currently has none).
- **Pengumuman (announcements)** is a single shared component
  (`AnnouncementsCard`) used across all three Home variants above. Tapping
  an announcement opens a bottom sheet (`components/BottomSheet.jsx`) with
  its full date, body, and — if `images` is non-empty — a horizontally
  scrollable photo gallery with a page counter. No real photo assets exist
  in the mockup; each is a labeled placeholder tile.

### 5.2 Program Care Group (`/komsel`) — "Sub Menu 3: Program Shema Care Group"
Tabbed page, tabs: **Info Umum, Anggota, Kehadiran, Pertumbuhanku, Materi**.

**No-group view** (super admin, or a member not yet placed): shows only the
Info Umum content, no tabs.

- **Info Umum** *(Sub Menu 3a)* — static reference content: CG definition,
  capacity rule (min 4 / max 15, expected to split above that), naming rule
  (KKNN code: 2-digit category code + 2-digit sequence), how-to-join steps,
  role jobdesks (Anggota / Calon Leader / Kandidat Leader / Leader), training
  cadence note (First/Second Coaching weekly, other trainings quarterly), and
  a directory of **all** Care Groups with code + member count + a
  color-coded capacity badge (coklat = under 4 members, merah = at/over 15
  and ready to split, hijau = healthy).
- **Anggota** *(part of Sub Menu 3b)* — upcoming-birthdays card (next 30
  days, computed from each member's `MM-DD` birth date) + full member list
  with role badges.
- Group header (always visible, all tabs) shows: category, quote/motto, code,
  leader + pengurus count, meeting schedule/location, capacity badge, and an
  **average-attendance badge** (coklat <50%, hijau muda 50–80%, hijau tua
  >80%, computed across all past meetings × all members).
- **Kehadiran** — full meeting history, paginated: the 2 most recent
  meetings show by default, "Tampilkan lebih banyak" reveals the rest
  (Decision Log #11 — supersedes the earlier last-7-days-only rule).
  Leader/admin roles can tap a member row to toggle attendance; members see
  read-only status. Spec requirement "diisi oleh leader, member read only"
  (Sub Menu 3c) is satisfied. Each meeting's member list also tags whoever
  holds the "Leader" role with a badge next to their name.
- **Pertumbuhanku** *(Sub Menu 3c)* — three individual progress mechanisms,
  all self-scoped to the logged-in member within this CG:
  1. **Status Pertumbuhan** — rolling-window attendance-tier ladder (`cgGrowthTiers`
     in mockData): Mulai Bertumbuh (4×/3mo) → Bertumbuh (10–12×/6mo) →
     Bertumbuh Kuat (20–24×/1yr) → Bertumbuh Sehat (60–72×/3yr) → Bertumbuh
     Kokoh (73×/3yr, "di atas itu semua").
  2. **Beranting** — self-reported "who did I invite to join a CG" log +
     its own tier ladder (`invitationTiers`): Mulai Beranting (2/3mo) →
     Beranting (4/6mo) → Beranting Lebat (8/1yr) → Beranting Sehat (9/3yr).
     Colors for this ladder were not specified in source material; the app
     mirrors the coklat→kuning→merah→hijau visual language used elsewhere
     for consistency (a judgment call, not a literal spec).
  3. **Peningkatan Peran** — read-only stepper over
     Member → Member Aktif → Melayani CG/Pengurus CG → Calon Leader →
     Kandidat Leader → Leader, derived from the member's current CG role
     field. "Calon Leader" and "Kandidat Leader" are now reachable — the
     Leader can assign them from the Ketua Komsel panel's Peserta Komsel
     tab, one stage at a time (§5.9). Reaching "Leader" itself is still
     Super Admin-only (Komsel tab's leader-reassignment dropdown, §5.10).
- **Materi** — devotional/discussion material list (pre-existing feature,
  unchanged), expandable per item with discussion questions.

All three tier ladders (Baca Alkitab, Status Pertumbuhan, Beranting) share one
generic engine: `computeTierStats()` (`src/utils/tiers.js`) and shared UI
(`TierStatusCard` / `TierLadderCard` in `src/components/TierProgress.jsx`).

### 5.3 Program Baca Alkitab Harian ("Daily Shema") (`/baca-alkitab`)
*(Sub Menu 2)*. Personal, **not** dependent on Care Group membership (a
brand-new registrant can use this from day one).

- **List → detail pattern**: the main page shows a plain summary row per
  renungan (title, verse, like/comment counts, a "Selesai" badge if already
  checked in that day). Tapping it opens a detail bottom sheet
  (`BottomSheet.jsx`, shared with Pengumuman) with the full content: an
  image placeholder, full text, verse, Penuntun Doa (prayer guide), the
  audio-toggle affordance ("Dengarkan" — simulated, no real audio asset),
  and like/comment/share. **The audio control only exists in the detail
  view**, never in the summary list.
- Renungan `text` is a **paragraph array** (not one long string) — each
  seeded renungan is a real-length devotional (~4 paragraphs: illustration,
  verse exposition, application, closing thought), matching the length of
  an actual daily devotional rather than a one-line placeholder.
- Like / comment / share. Share copies a link to the clipboard. **Comments
  are capped at one per person per renungan** — the form is replaced with a
  "sudah memberi komentar" notice after use.
- "Tandai Selesai Saat Teduh" is **gated on reading to the end**: the button
  stays disabled (locked, "Baca sampai selesai untuk menandai") until the
  member scrolls the detail sheet's content to the bottom. Content short
  enough to not require scrolling auto-unlocks on open. One self-check-in
  per calendar day, idempotent (button becomes a disabled "sudah selesai"
  state once used).
- Running total of days read, plus the achievement ladder (`readingTiers`):
  Mulai Berakar (25/mo, coklat) → Berakar (75–90/3mo, kuning/merah) →
  Berakar Dalam (300–360/1yr) → Berakar Kuat (900–1080/3yr) → Berakar Kokoh
  (>1080/3yr, hijau) — thresholds and colors are exact per source spec.
- Past days browsable below the "today" row, same list → detail pattern
  (no "Tandai Selesai" action on past days, matching the original design).

### 5.4 Presensi Pelayanan (`/presensi`)
Self check-in for ministry service (distinct from CG meeting attendance).
Member picks a pelayanan role (from `pelayananRoles`), a **date** (defaults
to today, capped at today — can't log service that hasn't happened yet), and
an optional note, then submits. History list below. Requires CG membership
(shows an empty-state otherwise). Mirrored read-only view in the Ketua Komsel
panel for that leader's own group.

### 5.5 Pokok Doa (`/doa`) — staff-only nav for now
Prayer wall: submit a request (name optional → "Anonim"), category, browse
others' requests, "Doakan" button increments a prayed-count once per viewer
per request.

### 5.6 Jadwal (`/jadwal`) — staff-only nav for now
Church-wide event schedule (Ibadah, Care Group, Coaching, Training, Acara
Khusus), filterable by category, grouped by date.

### 5.7 Profil (`/profil`)
Presentation-only for member data — **no self-edit forms** (Decision Log #9).
Anything the member wants changed goes through admin/Ketua Komsel, not an
in-app form.

- Photo (session-only preview via local file upload — not persisted across
  reload, clearly captioned as such).
- **Eye-icon toggle** in the header reveals an "Informasi Lengkap" card:
  every field the app holds on the member (name, phone, role, Care Group,
  address, university, birth date), plus a note to contact
  admin/Ketua Komsel for changes.
- Journey stepper: New Comer → First Coaching → Second Coaching → **Member
  Care Group** (renamed from "Aktif di Care Group" — Decision Log #5) →
  Training Leader → Training Coach.
- **Shema Growth** *(Sub Menu 1, item 2)* — 5 milestones (First/Second/Third
  Coaching, CG Leader Training, CG Coach Training), each **read-only**:
  shows "Selesai {date}" if `growthDates` has a completion date for that
  milestone, else the next matching upcoming event's date ("Berikutnya
  {date}", matched via `milestoneId` on `eventsSeed`), else "Belum ada
  jadwal". No date-picker on this page — completion dates are set elsewhere
  (currently only seed data; no admin UI writes `growthDates` yet, see §9).
- **Training Gerejawi Lainnya** *(Sub Menu 1, item 3)* — plain, read-only
  list of other church trainings attended. No add/remove UI on this page.
- **Presensi Pelayanan summary** *(Sub Menu 1, item 4)* — count + link to
  `/presensi` (the actual "diisi sendiri oleh member" feature lives there;
  Profil just surfaces a summary rather than duplicating it).
- Link to `/tentang`, logout, footer.

### 5.8 Tentang & Ajukan Pelayanan (`/tentang`)
- SDA role glossary (Greeter, Catcher, Care Group, Leader, Pengurus Care
  Group, Coach, Shepherd) — static reference, shown to everyone.
- **Ajukan Pelayanan**: shown only to `jemaat` who have reached the "Member
  Care Group" journey stage or later (the "unlock" gate — see Home's
  Pelayanan Terbuka/Menuju Member cards). Radio-card role picker (reuses SDA
  roles minus "Care Group" itself) + Alasan & Motivasi + Kesibukan Saat Ini
  fields → submits to an inbox reviewed by Ketua Komsel / Super Admin.
  Below-threshold members see a locked notice instead.
- The **Roadmap Program 2026–2028** section that originally lived on this
  page was **removed** per explicit request (Decision Log #7) — this page's
  job is now application, not roadmap communication.

### 5.9 Panel Ketua Komsel (`/admin`, peran `admin`)

Ini panel untuk **Leader/Ketua Komsel** — pemimpin satu Care Group, mengurus
CG-nya sendiri saja (bukan CG orang lain). Per slide sumber "B.1 Pilih masuk
sebagai Leader":

- **Peserta Komsel** ✅ — melihat semua anggota CG-nya, menambah anggota baru
  (nama, no. HP, alamat, universitas, **tanggal lahir**), dan membuka detail
  kontak tiap anggota termasuk tanggal lahirnya. 🚧 *Belum bisa*: menghapus
  anggota dari CG, atau mengedit data anggota yang sudah tersimpan — saat
  ini data anggota hanya bisa ditambahkan, belum bisa diubah atau dihapus
  lagi.
- **Kehadiran** ✅ — mencatat siapa hadir di tiap pertemuan CG dengan
  menyentuh nama anggota, dengan **keterangan opsional untuk yang tidak
  hadir** (misal "Sakit", "Izin"), dan **filter per anggota** untuk melihat
  riwayat kehadiran satu orang saja lintas semua pertemuan. Daftar pertemuan
  menampilkan 2 yang terbaru dulu, dengan tombol "Tampilkan lebih banyak"
  untuk melihat riwayat lebih lama. Nama Leader ditandai dengan badge
  "Leader" di setiap daftar kehadiran. **Batas edit 14 hari** — kehadiran
  pertemuan yang sudah lewat 14 hari otomatis terkunci (badge "Terkunci"),
  tidak bisa diubah lagi oleh siapa pun, Leader maupun Super Admin. Home
  Leader juga menampilkan kartu pengingat kalau ada pertemuan yang belum
  lengkap diisi dan masih dalam masa 14 hari itu.
- **Menaikkan status/peran anggota** ✅ — Leader bisa menaikkan status
  seorang anggota **satu tahap setiap kali**, berurutan: Anggota → Pengurus
  CG → Calon Leader → Kandidat Leader (tidak bisa lompat tahap). Naik ke
  **Kandidat Leader memberi akses Panel Admin sungguhan** untuk CG yang
  sama — bukan sekadar label: kalau anggota itu belum punya akun login,
  akun baru langsung dibuatkan (perlu No. HP anggota sudah terisi), lengkap
  dengan kata sandi yang ditampilkan sekali ke Leader untuk disampaikan;
  kalau sudah punya akun, akunnya langsung naik jadi Ketua Komsel. Artinya
  satu CG sekarang bisa punya lebih dari satu akun Ketua Komsel aktif
  sekaligus (co-leader) — lihat Decision Log #15. Naik ke **Leader**
  (menjadi Leader utama/tercatat CG) tetap wewenang Super Admin saja lewat
  Komsel tab (§5.10), tidak berubah.
- **Kegiatan CG** 🟡 *(sebagian)* — Leader sudah bisa membuat **dan
  mengedit** jadwal pertemuan rutin (tab **Jadwal Komsel**, dengan kolom
  Deskripsi Acara opsional) dan acara khusus di luar jadwal rutin (tab
  **Jadwal Khusus**). **Mengedit hanya berlaku untuk pertemuan yang belum
  terjadi** — pertemuan yang tanggalnya sudah lewat ditandai "Sudah berlalu"
  dan tidak punya tombol Edit lagi, supaya riwayat yang sudah terjadi tidak
  diubah-ubah. 🚧 *Belum bisa*: mengunggah foto kegiatan CG yang muncul di
  halaman Home anggotanya sebagai "Kegiatan CG Terbaru" — foto itu untuk
  saat ini cuma data contoh bawaan aplikasi, belum ada tempat bagi Leader
  untuk menambahkannya sendiri.
- **Mengedit info CG-nya sendiri (Deskripsi CG)** ✅ — tab **Profil CG**:
  Leader menulis deskripsi singkat tentang CG-nya, tampil di halaman Program
  CG (`/komsel`) untuk semua yang melihat profil CG itu. **Catatan koreksi**:
  fitur ini semula dibangun sebagai kotak masuk "kirim info baru" bertumpuk
  (tiap kirim jadi entri terpisah, tampil sebagai kartu pengumuman khusus
  CG di Home) — user mengoreksi bahwa konsepnya seharusnya seperti mengedit
  satu kolom deskripsi profil CG, bukan feed pengumuman. Dibangun ulang
  sesuai itu; lihat Decision Log #16. Ini juga menyelesaikan item "mengedit
  moto/jadwal/lokasi CG" yang sebelumnya 🚧, sebatas kolom deskripsi —
  mengedit moto/jadwal/lokasi CG yang sudah ada dari awal (bukan deskripsi
  tambahan ini) masih belum bisa, lihat §9.
- **Pengajuan Pelayanan** ✅ — kotak masuk pengajuan pelayanan dari anggota
  CG-nya, dengan tombol tandai "sudah ditinjau" dan badge jumlah yang
  belum ditinjau.
- **Presensi Pelayanan** ✅ — melihat (tanpa bisa mengubah) riwayat presensi
  pelayanan yang diisi sendiri oleh anggota CG-nya.
- **Pelayanan bersama CG** 🚧 *(diminta, maksudnya belum jelas)* — perlu
  penjelasan lebih lanjut dari yang meminta: apakah maksudnya menjadwalkan
  CG melayani bersama di suatu acara, mencatat riwayatnya, atau hal lain?
- **Statistik & analisa CG** ✅ — tab baru **Statistik**: rata-rata
  persentase kehadiran pertemuan CG, plus **"Statistik Kesehatan CG"** per
  tangga pertumbuhan, dihitung untuk **seluruh anggota CG sekaligus**
  (bukan cuma perorangan seperti di "Pertumbuhanku", §5.2) — ditampilkan
  sebagai "X dari Y anggota sudah mencapai minimal satu tingkat" plus
  rincian jumlah anggota per tingkat: "Bertumbuh" (kehadiran CG) dan
  "Beranting" (mengajak orang baru) dihitung jujur untuk semua anggota,
  termasuk yang belum punya akun login, karena kedua data itu sudah
  tersimpan per-anggota di data CG sendiri. "Berakar" (baca Alkitab
  harian) **hanya dihitung untuk anggota yang sudah punya akun login**
  (dengan catatan jumlah cakupannya ditampilkan apa adanya) — data baca
  Alkitab memang bersifat pribadi lewat akun masing-masing, jadi anggota
  tanpa akun login belum punya riwayat untuk dihitung sama sekali, bukan
  dianggap nol.

### 5.10 Panel Super Admin (`/admin`, peran `super_admin`)

Super Admin adalah peran dengan wewenang tertinggi — bisa mengurus semua
Care Group, bukan cuma satu. Per slide sumber "D. Pilih masuk sebagai Admin
Utama":

- **Renungan** ✅ — menulis bahan renungan **mingguan** untuk bahan diskusi
  Care Group. *(Ini berbeda dari renungan **harian** pribadi di menu "Baca
  Alkitab" — lihat catatan 🟡 di bawah.)*
- **Komsel** ✅ — membuat Care Group baru beserta detailnya (nama, kategori,
  jadwal, lokasi), dan menunjuk siapa yang menjadi Leader tiap CG.
  🟡 *Daftar Leader CG* — nama Leader tiap CG sudah tampil di tab ini, tapi
  belum ada halaman "Daftar Leader" terpisah yang mengumpulkan semua Leader
  dalam satu daftar.
- **Peserta** ✅ — melihat semua anggota, dikelompokkan per Care Group;
  menambahkan anggota baru ke CG manapun; memindahkan anggota antar CG.
  🚧 *Belum bisa*: mengedit data anggota yang sudah tersimpan (nama, no. HP,
  alamat, dll) — saat ini data itu hanya bisa dilihat, ditambah, atau
  dipindah ke CG lain, belum bisa diubah isinya.
- **Data User** ✅ — melihat semua akun login yang ada; membuat akun baru
  langsung dengan kata sandi yang dibuat otomatis; menyetujui atau menolak
  pendaftar baru yang menunggu persetujuan (menyetujui = akun dibuat, kata
  sandi dibuat otomatis, orangnya langsung ditempatkan ke satu Care Group —
  lihat §3).
- **Pengajuan Pelayanan** ✅ — kotak masuk semua pengajuan pelayanan dari
  seluruh Care Group, dengan badge jumlah yang belum ditinjau.
- **Event** & **Jadwal Coaching** ✅ — membuat dan menginformasikan jadwal
  ibadah, training, dan acara lainnya untuk seluruh jemaat.
- **Data calon peserta Second Coaching** 🚧 *(diminta, belum dibangun)* —
  rencananya Super Admin bisa mencatat siapa saja yang menjadi calon
  peserta Second Coaching.
- **Kirim piagam kelulusan First/Second Coaching** 🚧 *(diminta, belum
  dibangun)* — kemungkinan besar di luar cakupan mockup lo-fi ini karena
  perlu pembuatan file sertifikat sungguhan; perlu didiskusikan apakah
  cukup diwakili sebagai catatan status "lulus" di data anggota, atau
  memang perlu fitur kirim file sertifikat.
- **Kirim renungan harian & warta** 🟡 *(sebagian)* — Super Admin sudah bisa
  menulis bahan renungan **mingguan** untuk Care Group (tab Renungan di
  atas), tapi belum ada tempat untuk menulis renungan **harian** pribadi
  ("Baca Alkitab", §5.3) maupun mengelola isi "Warta Jemaat" (§5.1) — dua
  hal itu untuk saat ini masih data contoh bawaan aplikasi (renungan
  harian) atau berlabel "Segera hadir" tanpa isi (Warta Jemaat), dan belum
  ada halaman admin untuk mengelola keduanya.

### 5.11 Panel Coach (`/admin`, peran `coach`)

Coach adalah peran baru — "head of Leader", membina beberapa Care Group
sekaligus tapi bukan anggota dari CG manapun yang dibinanya. Per slide sumber
"C. Pilih masuk sebagai Coach":

- **Daftar CG &amp; Leader yang dibina** ✅ — tab **CG Binaan** menampilkan
  setiap Care Group yang ditugaskan ke Coach ini (satu Coach per CG,
  ditentukan Super Admin lewat tab Komsel §5.10 — lihat Decision Log #16),
  dengan nama Leader dan jumlah anggota masing-masing.
- **Melihat detail semua CG &amp; semua data anggota, leader, kandidat, calon
  leader, pengurus di bawahnya** ✅ — tiap CG di tab **CG Binaan** bisa
  dibuka untuk melihat daftar lengkap anggotanya beserta badge peran
  (Anggota/Pengurus CG/Calon Leader/Kandidat Leader/Leader), read-only.
- **Jadwal pembinaan/pertemuan dengan Leader, Kandidat, Calon Leader,
  Pengurus** ✅ — tab **Jadwal Pembinaan**: Coach membuat jadwal (judul,
  tanggal, jam, lokasi, untuk-siapa, catatan), masuk ke jadwal gereja
  sebagai kategori "Coaching" yang sama dipakai First/Second Coaching
  (belum ada kategori terpisah — lihat §9) — jadi juga muncul di halaman
  Jadwal (`/jadwal`) semua orang, bukan hanya Coach.
- **Berbagai analisa statistik semua CG yang dibina untuk dasar kebijakan**
  ✅ — tab **Statistik**: ringkasan kehadiran per CG, plus rangkuman
  "Statistik Kesehatan CG" (Bertumbuh/Beranting/Berakar) **digabung dari
  seluruh CG yang dibina sekaligus**, bukan per-CG terpisah — perhitungan
  dan batasan cakupannya sama seperti versi per-CG milik Ketua Komsel
  (§5.9): Bertumbuh &amp; Beranting jujur untuk semua anggota, Berakar hanya
  untuk anggota yang punya akun login.

## 6. Data Model Summary

All mock/seed data lives in `src/data/mockData.js`; all mutable app state
(care groups, prayers, applications, check-ins, likes, growth dates, etc.)
lives in `AppContext` (`src/context/AppContext.jsx`) and is persisted to
`localStorage` under `cg_*` keys. `TODAY` is a **fixed fictional date**
(`2026-08-13`, `src/utils/date.js`) — the app does not use the real device
clock for in-app "today" logic, so seeded relative dates (streaks, tiers,
"upcoming" windows) stay consistent regardless of when it's actually opened.

Key entities: `careGroupsSeed` (groups + nested members + meetings +
`description` — the CG's own profile description, §5.9 — + `coachId`/
`coachName`, the one Coach assigned to this CG, §5.11), `demoUsers`
(+ `registeredUsers` for self-registered accounts **and** accounts created
by promoting a member to Kandidat Leader — see `promoteMember()`),
`serviceApplicationSeed`, `pelayananCheckinSeed`, `renunganHarianSeed`,
`bibleReadingCheckinSeed`, `growthDatesSeed`, `otherTrainingSeed`,
`invitationSeed`. Tier ladders: `readingTiers`, `cgGrowthTiers`,
`invitationTiers` — all consumed by the shared `computeTierStats()` engine.
`nextPromotionRole()` (`mockData.js`) defines the one-stage-at-a-time member
promotion ladder (§5.9). Each meeting object also carries an optional
`description` field (free text, shown alongside the topic, editable via
`updateMeeting()` until the meeting date has passed) and an
`attendanceNotes` map (`memberId` → optional free-text reason for an
absence, written via `setAttendanceNote()`, kept separate from the
`attendance` boolean map so toggling presence never erases a recorded
reason). `ATTENDANCE_EDIT_WINDOW_DAYS` / `isAttendanceLocked()` /
`attendanceEditDeadline()` (`utils/date.js`) implement the 14-day attendance
edit lock (§5.9). `myCoachedGroups` (derived in `AppContext`, `careGroups`
filtered by `coachId === user.id`) and `setCareGroupCoach()` back the Coach
role (§5.11).

## 7. Decision Log

Chronological record of resolved ambiguities/conflicts. Each entry: what was
asked, what was decided, why.

1. **Pre-app onboarding procedure (web page + WA admin qualification flow)
   is out of scope.** The source deck describes a whole procedure before a
   user ever opens the app; the user explicitly said "web bukan urusan kita,
   jadi kita bisa skip dulu." The app assumes credentials already exist.
2. ~~Kehadiran (attendance) views show only the last 7 days, not full
   history, per explicit request.~~ **Superseded by Decision #11** — the
   7-day cutoff was replaced by pagination once it made "load more"
   meaningless (almost never more than 2 meetings in a 7-day window).
3. **Registration form is minimal (Nama + Nomor WA + password) despite a
   much richer spec existing** (Data Pribadi + Data Gerejawi with ~15
   fields). User explicitly said "saat ini hanya nomor WA yang diutamakan
   saja" — the richer form is a known future superset, not a contradiction.
4. **Login identifier changed from arbitrary username to phone number**,
   password unchanged. Applies to both demo accounts and self-registered
   accounts.
5. **Journey stage "Aktif di Care Group" renamed to "Member Care Group"**,
   and reframed as something earned via an attendance threshold
   (`MEMBERSHIP_ATTENDANCE_THRESHOLD = 4`), not just "currently attending."
   This directly gates the Ajukan Pelayanan feature (§5.8).
6. **Doa and Jadwal hidden from the member nav "for now."** Explicitly
   framed as temporary by the user; final disposition (delete entirely vs.
   fold into another page vs. keep as a secondary/overflow tab) is an open
   item (§9) — **do not delete the underlying pages/routes** until that's
   resolved, since staff roles still use them.
7. **Roadmap Program 2026–2028 removed from `/tentang`**, replaced by the
   Ajukan Pelayanan flow — the user judged the roadmap didn't belong on a
   page whose job is now "apply for a ministry role."
8. **Program Baca Alkitab and the three Profil "Shema Growth" sub-menus were
   built directly from exact-threshold slide specs** (no clarification
   needed) — see §5.3, §5.7. Where the source material didn't specify a
   value (e.g., Beranting tier colors, "Berakar Kokoh"/"Bertumbuh Kokoh"'s
   exact "di atas itu semua" ceiling), the app fills the gap with the
   smallest defensible value one step above the last specified tier, and
   this PRD flags each such fill explicitly rather than silently guessing.
9. **Profil is read-only for the member; edits go through admin.** The
   initial build let members self-edit Shema Growth dates (date-picker
   inputs) and self-manage the "Training Gerejawi Lainnya" list (add/remove
   form). The user corrected this: both should be pure information display
   — growth milestones show a completion date if set, otherwise the next
   scheduled occurrence pulled from `eventsSeed` via `milestoneId`, and the
   training list has no edit affordance at all. A new eye-icon toggle on
   Profil surfaces *all* fields the app holds on the member (including ones
   not otherwise shown, like address/university/birth date) with an explicit
   "contact admin to change" note — establishing "view your data, contact
   admin to change it" as the pattern for member-owned data going forward.
   `setGrowthDate`/`addOtherTraining`/`removeOtherTraining` remain in
   `AppContext` (harmless, unused by any UI) for a future admin-side editor.
10. **"Care Group" as app-identity branding renamed to "SHEMA."** Scoped
    strictly to the app's own name/kicker label (sidebar, mobile top bar,
    Login, Register, Profil footer, page title). Every legitimate use of
    "Care Group" as the small-group feature's actual name — Program CG,
    "Care Group Kasih Setia", member/CG counts, etc. — is untouched; those
    two meanings of the phrase now read as clearly distinct in the UI.
11. **Kehadiran's "last 7 days" filter (Decision #2) removed in favor of
    pagination.** The user asked for the attendance list to lazy-load (show
    the 2 most recent, "Tampilkan lebih banyak" to reveal older ones). With
    the 7-day cutoff still in place that button would almost never have
    anything to reveal — cg1 only ever has ≤2 meetings inside a 7-day
    window. Resolved by dropping the date filter entirely and letting
    pagination alone control how much history is visible at once, in both
    `Komsel.jsx` and the Ketua Komsel panel. Flagged here rather than
    silently reversing #2, per this document's own conflict-check rule.
12. **Reversed: a `jemaat` account can no longer exist without a Care
    Group.** The original design (§3/§8) deliberately let self-registration
    create an unplaced account, with several pages built to degrade
    gracefully for that state. The user explicitly revisited this — "kalau
    kemarin kita bahas bahwa menjadi member belum tentu bergabung CG, itu
    sudah tidak berlaku lagi, karena sekarang yang masuk sudah pasti sudah
    bergabung CG" — and this is the direct cause of Decision #13's
    approval-based registration redesign: since every account now gets a CG
    at the moment of creation (`createUser()` enforces this), the "no CG
    yet" `jemaat` state is no longer reachable through normal use. The old
    defensive UI stays as a fallback (§8) but is not a designed path anymore.
13. **Self-registration became approval-based; Super Admin gained direct
    user/roster management.** Requested together as one feature: (a) demo
    `jemaat` accounts trimmed from 3 to 1, since they existed to demo a
    membership nuance that Decision #12 retired; (b) `/register` now queues
    a `pendingRegistrations` entry instead of creating an active account —
    no password collected at that point; (c) Super Admin's Peserta tab
    regrouped by CG name and gained a "insert new roster entry into any CG"
    form; (d) a new Data User tab lets Super Admin see every login account,
    create one directly with an auto-generated password, and
    approve/reject pending self-registrations (approval = generate password
    + create account + place in the chosen CG, one action). See §3, §5.10.
14. **PRD-only update: full Leader and Super Admin feature lists documented,
    no code changed.** The user shared two source slides ("B.1 Pilih masuk
    sebagai Leader" and "D. Pilih masuk sebagai Admin Utama") and explicitly
    asked only for this document to be updated — not implemented — and to be
    written so a non-technical reader can follow it. This is what produced
    the ✅/🟡/🚧 status-tag system (see "Cara Membaca Dokumen Ini" at the top)
    and the expanded §5.9/§5.10. Everything tagged 🚧 or 🟡 in those two
    sections is a **documented request, not a shipped feature** — do not
    assume it exists in the app just because it's now written down here.
15. **Seven §5.9 Leader items built in one batch — two of them needed a
    clarifying question first, both asked and answered before writing code**
    (see changes.md 2026-09-08 for the full list). The two questions:
    (a) *does "Kandidat Leader" having "privileges yang sama dengan leader"
    mean a visible label only, or real Panel Admin access?* — answered: **real
    access**. This is a genuine architecture change from "one Care Group, one
    admin account" to "one Care Group, possibly several admin accounts (a
    co-leader)" — `promoteMember()` creates or upgrades a login account when
    a member reaches this stage. (b) *can a Leader set a member to any of the
    three statuses directly, or must it go stage-by-stage?* — answered:
    **stage-by-stage**, enforced in code (`nextPromotionRole()` only ever
    offers the single next stage). Both answers came from the user, not
    assumed, given how much the "real access" answer in particular changes
    the app's account model. Also fixed in passing: `shiftDate()` had a
    latent UTC-conversion bug that silently shifted displayed dates back one
    day in this app's own Asia/Jakarta timezone — invisible everywhere it was
    previously used (internal same-convention comparisons only) until the new
    14-day attendance-lock deadline became the first place its result was
    shown directly to a user.
16. **Five corrections/additions to the Decision #15 batch, plus a brand-new
    Coach role, requested together.** (a) **"Info CG" was the wrong shape** —
    built as a feed of posts (Decision #15), the user corrected it should be
    "like editing a CG profile description" instead: a single overwritable
    text field, not a running list. Rebuilt as the **Profil CG** tab
    (`setCgDescription()`, one `description` string per CG) shown on the CG's
    own profile page (`/komsel`), not as a Home news card — the whole
    "separate Home card for CG-only info" idea from #15 is retired along with
    the feed shape, since a static profile field isn't news. (b) **Jadwal
    Komsel gained edit**, restricted to meetings that haven't happened yet
    (`updateMeeting()`, gated on `isPastMeeting()` in the UI) — editing a
    meeting that already occurred was explicitly excluded. (c) **Birthdate
    added to the "Tambah Peserta" form and the Peserta detail view** — the
    field (`birthDate`) already existed on seeded members and powered the
    Anggota tab's "Ulang Tahun Terdekat" card, but Leader had no way to see
    or set it for a member added through the panel; both gaps closed
    together. (d) **Attendance gained an optional per-person absence note**
    (`attendanceNotes`, `setAttendanceNote()`) — kept as a field separate
    from the `attendance` boolean so flipping presence never wipes a
    previously-recorded reason. (e) **Kehadiran gained a per-member filter**
    — a dropdown narrows every visible meeting card down to one person's row,
    for scanning one member's history without the rest of the roster in the
    way. (f) **New `coach` role**, introduced from a third source slide ("C.
    Pilih masuk sebagai Coach"): oversees several Care Groups at once (a
    "head of Leader"), own panel (§5.11: CG Binaan / Jadwal Pembinaan /
    Statistik). Judgment calls made without asking, since each mirrors an
    existing pattern rather than inventing a new one: **one Coach per CG**
    (`coachId`, single-valued — mirrors `leaderId`'s one-Leader-per-CG
    shape), **assigned by Super Admin via a dropdown** in the Komsel tab
    (mirrors the existing Leader-reassignment dropdown, §5.10), **Coach
    accounts created via Super Admin's existing "Buat User Baru" form** (a
    new "Coach" option alongside Anggota/Ketua Komsel/Super Admin — no new
    creation flow needed), and **Jadwal Pembinaan reuses the existing
    "Coaching" event category** rather than inventing a separate one (see
    §9 for the resulting mixing-with-First/Second-Coaching caveat this
    causes on the shared `/jadwal` page).
17. **Real Shema logo artwork supplied and swapped in for the placeholder.**
    The sidebar/top-bar/Login/Register "Shema" branding (Decision #10) had
    been a plain colored circle + Lucide icon + separate text since no real
    asset existed yet. The user provided the actual logo (`public/logo-shema.png`)
    — used as-is everywhere that placeholder appeared, including the
    favicon, with the redundant "Shema"/"GKI Gejayan" text dropped next to
    it since the artwork already includes that wordmark.

## 8. Pages That Must Handle "No Care Group" Gracefully

**No longer a normal onboarding path** as of Decision Log #12 — every
account is placed into a CG the moment it's created (whether via approval or
direct Super Admin creation), so `careGroupId: null` shouldn't occur for a
real `jemaat` account anymore. The fallback UI below is kept as a defensive
edge case (e.g. `super_admin`'s own account legitimately has no CG) — **do
not delete it**, but don't treat it as reachable through normal registration:

- Home → welcome card (no journey-dependent CG cards)
- Program CG → Info Umum only, no tabs
- Presensi Pelayanan → empty-state, no check-in form
- Tentang → Ajukan Pelayanan gated on journey stage, independent of CG

## 9. Open Items (Belum Dikerjakan / Menunggu Keputusan)

Daftar ini adalah rangkuman backlog. Untuk detail lengkap tiap item panel
Leader/Super Admin, lihat tanda 🚧 dan 🟡 di §5.9 dan §5.10 — daftar di sini
hanya ringkasan + hal-hal di luar kedua panel itu.

**Menunggu Leader/Ketua Komsel (§5.9):** mengedit/menghapus data anggota,
mengunggah foto "Kegiatan CG Terbaru", mengedit moto/jadwal rutin/lokasi CG
yang sudah ada sejak awal (beda dari kolom Deskripsi CG yang sudah ✅), dan
"Pelayanan bersama CG" (perlu klarifikasi maksudnya). Juga belum ada: cara
menurunkan/membatalkan status seorang Kandidat Leader (termasuk mencabut
akses Panel Admin yang sudah diberikan ke akunnya) — promosi saat ini hanya
jalan satu arah, ke atas.

**Menunggu Super Admin (§5.10):** mengedit data anggota yang sudah tersimpan,
daftar Leader CG sebagai halaman terpisah, data calon peserta Second
Coaching, kirim piagam kelulusan (kemungkinan di luar cakupan mockup ini),
dan tempat mengelola renungan harian + Warta Jemaat.

**Menunggu Coach (§5.11):** kategori jadwal terpisah untuk "Jadwal
Pembinaan" — saat ini memakai kategori "Coaching" yang sama dengan First/
Second Coaching milik member biasa, jadi bercampur di halaman Jadwal
(`/jadwal`) semua orang; belum ada cara memfilter atau memisahkan keduanya.
Juga belum ada: satu CG dibina lebih dari satu Coach sekaligus (saat ini
satu CG = satu Coach), dan statistik per-CG terpisah di dalam tab Statistik
Coach (saat ini hanya rata-rata kehadiran yang dipecah per CG — tiga tangga
pertumbuhan lainnya digabung semua CG jadi satu angka, tidak per-CG).

**Lain-lain:**
- **Doa / Jadwal final treatment** — currently hidden from member nav only
  (Decision Log #6). Awaiting the user's fuller detail before deciding
  whether to remove entirely, relocate content into another page, or restore
  as secondary nav items.
- **Full "Registrasi member baru" form** (Data Pribadi + Data Gerejawi, photo
  upload, edit-profile-except-email, forgot-password) — deferred per
  Decision Log #3; current registration is intentionally minimal.
- **Creating a Ketua Komsel/Super Admin account doesn't assign leadership.**
  Super Admin can create an `admin`-role account via Data User, but making
  that person actually lead a specific CG still needs a separate step (the
  Komsel tab's leader-reassignment dropdown) — account creation alone
  doesn't wire the two together.
- **No "resend/regenerate password" or delete-user action** — once created
  or approved, an account's password is only ever shown once at creation
  time; there's no admin UI to look it up again or issue a new one.
- **No admin UI yet to set Shema Growth completion dates or manage "Training
  Gerejawi Lainnya"** — per Decision Log #9, Profil is now read-only for
  members, but nothing on the admin side writes this data either (today it's
  only ever seeded). Whoever is supposed to maintain it (Ketua Komsel? Super
  Admin?) needs a form somewhere — likely the same place as the other
  member-editing gaps above.

## 10. Out of Scope

- Real backend / persistence beyond `localStorage` (this is a lo-fi,
  frontend-only prototype by explicit original request).
- Real authentication/security (plaintext demo passwords, no OTP).
- Real audio playback for Baca Alkitab (UI affordance only).
- The church's public marketing website / SDA info landing page.
- Push notifications, WA integration, or any external messaging.

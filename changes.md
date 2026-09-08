# Changes — Care Group App (Shema)

> Every implemented request gets an entry here, newest first. This is a
> record of *what shipped*; see [prd.md](prd.md) for *what the product is*
> and the running Decision Log for how conflicting/ambiguous requests were
> resolved.
>
> Dates below reflect when each entry was written into this file. Entries
> from before this file existed were backfilled on 2026-09-03 from session
> history and share that date, since per-request historical timestamps
> weren't tracked prior to this point.

---

## 2026-09-08 (3) — Real Shema logo

User supplied the actual Shema logo artwork (people-holding-hands + cross +
arrow mark, "SHEMA / GKI Gejayan" wordmark). Saved to `public/logo-shema.png`
and swapped in everywhere the app previously used a placeholder (a plain
colored circle with a Lucide `Users` icon, plus separate "Shema" / "GKI
Gejayan" text): `AppShell.jsx`'s desktop sidebar header and mobile top bar,
and the hero area on `Login.jsx` and `Register.jsx`. The separate text
kicker/heading next to the placeholder icon was dropped at each of those
spots since the real logo already bakes in the wordmark. Also now the
favicon (`index.html`), replacing the old placeholder `favicon.svg`, which
was deleted as it's no longer referenced anywhere.

---

## 2026-09-08 (2) — Leader-panel corrections + new Coach role

Five corrections/additions to the same-day Leader batch below, plus an
entirely new `coach` role introduced from a third source slide ("C. Pilih
masuk sebagai Coach"). See prd.md Decision Log #16 for the full reasoning
and the judgment calls made without asking (each mirrors an existing pattern
rather than inventing a new one).

**Leader-panel fixes:**

1. **"Info CG" rebuilt as a CG profile description, not a post feed.**
   The previous build (`addCgInfo()`, a running list of title+body posts
   surfaced as a Home news card) was the wrong shape — the user clarified
   the concept should be "like editing the CG's profile description," a
   single overwritable field. Replaced with `setCgDescription()` and a
   **Profil CG** tab (`KetuaKomselPanel.jsx`) with one textarea + Save;
   the resulting `careGroup.description` now shows on the CG's own profile
   header in `Komsel.jsx`, not on Home — the Home card (`CgInfoCard`) and
   the per-CG `info` array it read from are both removed.
2. **Jadwal Komsel meetings can now be edited** (`updateMeeting()` in
   `AppContext.jsx`), but only while the meeting hasn't happened yet —
   `JadwalKomselTab` gates the "Edit" button on `isPastMeeting()`; past
   meetings show a "Sudah berlalu" badge instead.
3. **Birthdate added to Peserta Komsel** — the "Tambah Peserta" form gained
   an optional "Tanggal Lahir (BB-TT)" field (`addMemberToGroup()` now
   accepts `birthDate`), and the member detail expando now shows it via
   `formatBirthDate()` alongside phone/address/university.
4. **Attendance gained an optional absence note** — `setAttendanceNote()`
   writes to a new `meeting.attendanceNotes` map (`memberId` → free text),
   kept separate from the `attendance` boolean map so toggling presence
   never erases a previously-recorded reason. Shown as an inline text input
   under any "Tidak hadir" row in both `KetuaKomselPanel.jsx` and
   `Komsel.jsx`'s Kehadiran tabs (read-only text once the 14-day edit
   window has passed).
5. **Kehadiran gained a per-member filter** — a dropdown above the meeting
   list narrows every visible meeting card down to just one person's row,
   in both Kehadiran tab implementations.

**New role: `coach`** — "head of Leader," oversees several Care Groups at
once without being a member of any of them:

- `roleLabels.coach = 'Coach'`; one demo account (`u_coach`, Pdt. Yohanes
  Setiawan) seeded overseeing `cg1` and `cg2`, `cg3` left unassigned to
  demonstrate the "Belum ditentukan" state.
- Each care group gained `coachId`/`coachName` (one Coach per CG, mirroring
  `leaderId`'s single-Leader shape). `setCareGroupCoach()` in `AppContext`;
  assigned via a new dropdown next to the existing Leader-reassignment one
  in `SuperAdminPanel.jsx`'s Komsel tab.
- Super Admin's "Buat User Baru" form (Data User tab) gained a "Coach" role
  option — no new account-creation flow needed.
- `AppShell.jsx`: Coach gets the same nav shape as Super Admin (full base
  nav + Jadwal + Doa + Admin entry); `Admin.jsx` routes `coach` to a new
  `CoachPanel`.
- **New `CoachPanel.jsx`** (`myCoachedGroups` derived in `AppContext` as
  `careGroups` filtered by `coachId === user.id`), three tabs: **CG Binaan**
  (list of assigned CGs, each expandable to a read-only full roster with
  role badges), **Jadwal Pembinaan** (create/list coaching-mentorship
  events — reuses the existing "Coaching" event category rather than a new
  one, so it shares the global `/jadwal` page with First/Second Coaching;
  flagged as a caveat in prd.md §9), **Statistik** (per-CG attendance %
  breakdown plus the same three-tier-ladder coverage summary as Ketua
  Komsel's Statistik tab, but combined across every assigned CG's members
  at once rather than per-CG).

---

## 2026-09-08 — Leader (Ketua Komsel) feature batch: promotion, attendance lock, CG info, statistics

Seven related requests, all scoped to the Leader/Ketua Komsel experience (see
prd.md Decision Log #15 for the two clarifying questions this raised and how
they were resolved before building):

1. **Home reminder card for unfilled attendance** (`AttendanceReminderCard`
   in `Home.jsx`, admin role only) — surfaces the most recent past meeting
   that's still editable (see #2) and not yet fully marked for every member,
   with a direct link to the Kehadiran tab. "Not yet fully marked" is
   detected honestly from existing data: `toggleAttendance` only ever adds/
   flips a member's key, never removes it, so `Object.keys(attendance).length
   < member count` reliably means "Leader hasn't touched every row yet."
2. **14-day attendance edit lock** (`isAttendanceLocked` /
   `attendanceEditDeadline`, `utils/date.js`) — a meeting's attendance can no
   longer be toggled once 14 days have passed since its date. Applied to both
   places attendance is editable: `KetuaKomselPanel.jsx`'s Kehadiran tab and
   `Komsel.jsx`'s (used when a leader/super_admin views their CG via the
   member-facing Program CG page). Locked meetings show a "Terkunci" badge
   and the deadline date instead of clickable rows.
3. **Doa removed from the Leader's nav specifically** (`AppShell.jsx`) —
   Super Admin still sees Doa; only the `admin` role's nav drops it. Jadwal
   stays for both staff roles, unchanged.
4. **Member status promotion — Pengurus CG → Calon Leader → Kandidat
   Leader** (`nextPromotionRole()` in `mockData.js`, `promoteMember()` in
   `AppContext.jsx`, UI in `KetuaKomselPanel.jsx`'s Peserta Komsel tab).
   Enforced strictly one stage at a time (a member must currently hold the
   immediately-preceding stage). Reaching **Kandidat Leader grants real
   Ketua Komsel access to the same Care Group** — not just a badge: if the
   member already has a login account it's upgraded to `admin` in place; if
   not, a new one is created on the spot (needs a phone number already on
   file) with a generated password shown once to the Leader, the same
   "shown once" pattern Super Admin's user creation already uses. This means
   a Care Group can now have more than one active Ketua Komsel account at
   once (a co-leader) — a real architecture change, confirmed with the user
   before building (Decision Log #15) rather than assumed.
5. **Meeting description field** — `JadwalKomselTab`'s "Buat Jadwal
   Pertemuan Komsel" form gained an optional "Deskripsi Acara" textarea
   (`addMeetingToGroup` now accepts/stores `description`), shown wherever a
   meeting card is rendered (Jadwal Komsel list, both Kehadiran tabs).
6. **CG-only info posts** — new `addCgInfo()` + new "Info CG" tab in
   `KetuaKomselPanel.jsx`: Leader writes a title + body, visible only to
   their own CG's members via a new "Info dari Komsel Kamu" card on Home
   (`CgInfoCard`), distinct from the church-wide Pengumuman feed.
7. **"Statistik Kesehatan CG" tab** (`StatistikTab` in
   `KetuaKomselPanel.jsx`) — average meeting-attendance %, plus a tier-
   coverage breakdown ("X dari Y anggota sudah mencapai minimal satu
   tingkat") for all three growth ladders: Bertumbuh (CG attendance) and
   Beranting (invitations) are computed honestly for **every** member since
   both data sources are keyed by `memberId`, not login account; Berakar
   (daily Baca Alkitab) is scoped to only members who have a linked login
   account (with an explicit caption saying so), since that data is
   necessarily personal-account-based and most roster members don't have
   one — no fabricated numbers to paper over the gap.

**Incidental bug fix**: `shiftDate()` (`utils/date.js`) built its return
value with `.toISOString()`, which converts through UTC — in any timezone
ahead of UTC (this app's own intended locale, Asia/Jakarta, is UTC+7) that
silently shifts the calendar day back by one. Every existing caller only
used it for internal same-convention comparisons (a Set of shifted dates
checked against other shifted dates), where a consistent off-by-one happens
to cancel out invisibly — but item #2's "batas edit sampai {date}" is the
first place a `shiftDate()` result is shown directly to a user, and it was
displaying the wrong day (e.g. "16 Jul + 14" showed as 29 Jul instead of 30
Jul). Fixed to build the date string from local date parts instead.

---

## 2026-09-04 — Approval-based registration + Super Admin user management

Three related requests, all reshaping how accounts get into the system:

1. **Demo `jemaat` accounts trimmed to 1.** Removed the "already member"
   (Dinda Ayu) and "newcomer" (Gilbert Prakoso) demo logins — they remain as
   plain CG member records in `cg1`, just without login credentials. Login
   demo list is now Calvin Tanto (Anggota), Andra Wijaya (Ketua Komsel),
   Pdt. Budi Santoso (Super Admin).
2. **Reversed: "member ≠ joined a CG" no longer holds.** Every path that
   creates an account now requires a Care Group at creation time — see
   prd.md Decision Log #12. This directly follows from #3 below.
3. **New Super Admin capabilities** (`SuperAdminPanel.jsx`):
   - **Peserta tab regrouped by Care Group** — was a flat list with the CG
     name written under each row; now one Card per CG with its own member
     list, plus a "Tambah Peserta ke Care Group" form (name/phone/address/
     university + CG picker) so Super Admin can insert a plain roster entry
     into any CG, not just move existing ones (moveMember already existed).
   - **New "Data User" tab**: full list of every login account (name,
     phone, role, CG if applicable); a "Buat User Baru" form that creates a
     fully active account with an auto-generated password, shown once after
     creation; and a "Pendaftar Baru" section listing pending
     self-registrations with a Care Group picker + Setujui/Tolak per entry —
     approving generates a password (shown once) and simultaneously creates
     the user account *and* adds them as a CG member in one step.

Data/context: `pendingRegistrationSeed` (2 demo entries); `AppContext` gained
`pendingRegistrations`, `createUser()`, `approvePendingRegistration()`,
`rejectPendingRegistration()`, and now exposes `allUsers`. `registerUser()`
no longer takes a password or creates an active account — it only queues a
pending entry; `Register.jsx` dropped its password field and now shows a
"menunggu persetujuan admin" confirmation instead of navigating to Home.
`createUser()` refuses to create a `jemaat` account without a `careGroupId`.

Verified live: registered a new pending entry (no auto-login, correct
confirmation copy); as Super Admin, approved a seeded pending registration
into "Kasih Setia" — generated password shown, user count went 3→4, and the
new member appeared under that CG in the grouped Peserta view.

## 2026-09-03 — Longer renungan, Home info section, Shema rebrand, Kehadiran pagination + Leader tag

Five separate requests landed together:

1. **Realistic, longer renungan content**: all 3 seeded renungan now have
   4-paragraph, real-length devotional text (`text` changed from a single
   string to a paragraph array; detail view renders each as its own `<p>`).
   Also fixed a real disconnect the user flagged: Home's "Renungan Minggu
   Ini" card was pulling from the unrelated Program CG weekly `materi` data,
   so completing today's Saat Teduh never showed up there. Replaced it with
   a new `SaatTeduhCard` that reads the actual Daily Shema state
   (`renunganList`/`bibleReadingCheckins`) and links to `/baca-alkitab` —
   added to both the main member Home and the no-group welcome view, since
   Baca Alkitab doesn't require Care Group membership.
2. **New Home section** (`ChurchInfoSection`, member view only): "Warta
   Jemaat" (honestly labeled "Segera hadir" — no fake link, since no real
   destination exists yet), "Contact Us" (the member's own CG leader as a
   real `tel:` link, plus static `churchContacts` seed data), and "Kegiatan
   CG Terbaru" (a placeholder photo gallery from each care group's new
   `activityPhotos` field).
3. **App rebrand: "Care Group" → "SHEMA"** as the app's own identity/kicker
   label — `AppShell.jsx` (sidebar + mobile top bar), `Login.jsx`,
   `Register.jsx`, `Profil.jsx` footer, and the `<title>` in `index.html`.
   Deliberately scoped to app-branding text only — every legitimate use of
   "Care Group" as the small-group feature's own name (Program CG, "Care
   Group Kasih Setia", stat labels, etc.) is untouched.
4. **Kehadiran (attendance) lazy-loads**: shows the 2 most recent meetings
   by default with a "Tampilkan lebih banyak" button to reveal the rest,
   in both `Komsel.jsx` and the Ketua Komsel panel.
5. **Leader tag in Kehadiran**: each meeting's member list now shows a
   "Leader" badge next to that member's name, in both places above.

**Superseding an earlier decision (flagged, not silent):** implementing #4
surfaced a conflict with the earlier "Kehadiran shows only last 7 days"
rule — with a 7-day hard cutoff, cg1 only ever has ≤2 meetings in view, so
"load more" would almost never have anything to reveal. Removed the
`isWithinLastWeek` filter entirely in favor of pagination doing the same
job over full history (see prd.md Decision Log #10). Verified live: cg1's
4 meetings now show 2 initially, "Tampilkan lebih banyak" reveals all 4.

## 2026-09-03 — Baca Alkitab: detail-gated "Saat Teduh", one comment per person, image placeholder

- `ProgramBacaAlkitab.jsx` restructured from inline full-content cards into a
  summary-list → detail-sheet pattern (reusing `BottomSheet.jsx`, same
  component introduced for Pengumuman):
  - The main list now shows only title, verse, like/comment counts, and a
    "Selesai" badge if already checked in that day — no audio button, no
    full text, no interactive controls.
  - Tapping a renungan opens the detail sheet: image placeholder, full
    text, Penuntun Doa, the audio "Dengarkan" toggle (**now lives only
    here**, per instruction), like/comment/share, and — for today's
    renungan — the "Tandai Selesai Saat Teduh" action.
- **Saat Teduh is now gated on actually reading it**: "Tandai Selesai" stays
  disabled ("Baca sampai selesai untuk menandai", lock icon) until the
  member scrolls the detail sheet to the bottom. Short content that doesn't
  need scrolling is auto-unlocked on open. Verified live: scrolled a tall
  renungan to the bottom, button unlocked, marked done, total/tier stats
  updated and the list row picked up a "Selesai" badge.
- **Comments limited to one per person per renungan**: `addRenunganComment`
  now records `userId` and silently no-ops if that user already has a
  comment there; the UI replaces the comment form with "Kamu sudah memberi
  komentar di renungan ini." once used. Verified live.
- Data: added an `image: { caption }` placeholder to each seeded renungan
  (no real photo asset, consistent with the Pengumuman gallery's approach)
  and `userId` to the existing seeded comment (`null`, since its author
  isn't a demo login account).
- `BottomSheet.jsx`: added `onScroll` and `contentRef` passthrough props so
  callers can detect scroll position inside the sheet — needed for the
  Saat Teduh gate, reusable for any future "must read to the end" pattern.

## 2026-09-03 — Clickable Pengumuman with a bottom-sheet gallery

- New `BottomSheet.jsx` component: bottom-anchored modal (backdrop + sliding
  panel, drag handle, close button, Escape-to-close, click-backdrop-to-close).
- `Home.jsx`: extracted the 3 duplicated inline "Pengumuman" list blocks
  (member view, no-group welcome view, Super Admin view) into one shared
  `AnnouncementsCard` component. Each announcement is now a button that opens
  the bottom sheet with its full date, body, and photos.
- Photos render as a horizontally scrollable gallery with snap points and a
  page counter ("1/3") when there's more than one; a single photo shows
  without a counter; zero photos shows no gallery section at all — all
  driven by each announcement's new `images` array.
- Data: added `images: [{ id, caption }]` to each seeded announcement (0, 1,
  and 3 images respectively, to demonstrate all three states). No real photo
  assets exist in this mockup — each image is a placeholder tile (icon +
  caption), consistent with the lo-fi/wireframe direction rather than
  fabricating fake church photos.

## 2026-09-03 — Presensi Pelayanan: editable date on check-in

- `PresensiPelayanan.jsx`: added a required "Tanggal" field to the check-in
  form (defaults to today, capped at today — can't log service that hasn't
  happened yet), so a member can back-log a check-in for a past date instead
  of it always being forced to today.
- `AppContext.checkInPelayanan()`: now accepts an optional `date`, falling
  back to `TODAY` if omitted.
- Section heading changed from "Hadir Melayani Hari Ini" to "Hadir
  Melayani" since the date is no longer implicitly "today".

## 2026-09-03 — Profil: read-only Shema Growth, plain training list, "full info" eye toggle

- `Profil.jsx` → `GrowthSection`: removed the self-edit date input. Each
  milestone now shows either "Selesai {date}" (if a completion date exists)
  or "Berikutnya {date}" pulled from the next matching upcoming event, or
  "Belum ada jadwal" if none is scheduled — purely informational, per
  explicit instruction ("cuman ada informasi... upcoming date").
- `Profil.jsx` → `OtherTrainingSection`: removed the add-form and per-item
  delete button; now a plain read-only list ("cuman list aja... sekedar
  informasi saja").
- `Profil.jsx`: added an eye-icon toggle in the header that reveals a new
  "Informasi Lengkap" card (name, phone, role, Care Group, address,
  university, birth date — every field the app actually holds on the
  member) with a closing note to contact admin/Ketua Komsel for changes,
  rather than editing in-app.
- Data: added `milestoneId` to the relevant events in `eventsSeed` (First/
  Second/Third Coaching, CG Leader/Coach Training) so each Shema Growth
  milestone can look up its own next occurrence; added the two previously
  missing event types (Third Coaching, Training Coach) so every milestone
  has a real upcoming date instead of a fallback.
- `utils/date.js`: added `formatBirthDate()`.
- Net effect: Profil is now presentation-only for member data — no
  self-service edit forms remain on the page (see prd.md Decision Log #9).

## 2026-09-03 — Hide Doa/Jadwal from member nav; add PRD + changelog process

- `AppShell.jsx`: `jemaat` nav no longer shows Jadwal or Doa (staff roles
  unaffected). Routes/pages untouched — this is a nav-visibility change only.
- `Home.jsx`: staff-only Home shortcuts to Jadwal ("Lihat jadwal" action) and
  Doa (tile) now gated the same way; `jemaat` sees "Baca Alkitab" in the tile
  grid instead of "Pokok Doa".
- Established `prd.md` (living requirements doc, backfilled) and this file as
  standing project practice going forward.

## 2026-09-03 — Program Shema Care Group rebuild ("Sub Menu 3")

- `Komsel.jsx` rebuilt with 5 tabs: Info Umum, Anggota, Kehadiran,
  Pertumbuhanku, Materi.
- Info Umum: CG definition, capacity/naming rules (KKNN code format),
  join steps, role jobdesks, directory of all CGs with capacity-status
  badges. Also used standalone (no tabs) for Super Admin / anyone without a
  group.
- Group header enriched: quote/motto, code, leader + pengurus count,
  capacity badge, average-attendance badge (3-tier color).
- Anggota tab: added "Ulang Tahun Terdekat" (next-30-days birthdays).
- New Pertumbuhanku tab: Status Pertumbuhan (attendance tier ladder),
  Beranting (self-reported invite log + its own tier ladder, with an
  add-invite form), Peningkatan Peran (read-only role stepper).
- Data: added `code`, `quote`, member `birthDate` to `careGroupsSeed`;
  added `cgGeneralInfo`, `cgRoleJobdesk`, `CG_MIN_MEMBERS`/`CG_MAX_MEMBERS`,
  `cgGrowthTiers`, `invitationTiers`, `roleProgressionStages`,
  `cgRoleToStageId`, `invitationSeed`, `tierColorToBadge`.
- Refactored tier math into a generic `computeTierStats()`
  (`src/utils/tiers.js`) and shared `TierStatusCard`/`TierLadderCard`
  components (`src/components/TierProgress.jsx`); `readingTiers` (Baca
  Alkitab) now reuses the same engine instead of duplicating it.
- Added `daysUntilBirthday()` to `utils/date.js`.
- Fixed a real bug: `renunganLikedIds` existed in `AppContext` state but was
  never exposed on the provider's value, crashing `/baca-alkitab` on render.

## 2026-09-03 — Program Baca Alkitab Harian + Profil "Shema Growth" ("Sub Menu 1 & 2")

- New page `ProgramBacaAlkitab.jsx` (`/baca-alkitab`, in nav): daily
  renungan with audio-toggle affordance, Penuntun Doa, like/comment/share,
  one-per-day "Tandai Selesai Saat Teduh" self check-in, running total, and
  the 8-tier achievement ladder (Mulai Berakar → Berakar Kokoh) on exact
  spec thresholds/colors.
- `Profil.jsx` extended: session-only photo upload/preview, **Shema
  Growth** (5 self-reported milestone dates), **Training Gerejawi Lainnya**
  (free-form add/remove list), **Presensi Pelayanan** summary card linking
  to `/presensi`.
- Data: `renunganHarianSeed`, `readingTiers`, `bibleReadingCheckinSeed`,
  `otherTrainingSeed`, `growthDatesSeed`, `growthMilestones` — all keyed by
  account id (not `memberId`), since reading/growth tracking must work for
  users not yet placed in a Care Group.
- `AppContext`: added `renunganList`/`renunganLikedIds` + like/comment
  actions, `bibleReadingCheckins` + `markSaatTeduhDone()`, `growthDates` +
  `setGrowthDate()`, `otherTrainings` + add/remove actions.

## 2026-09-03 — Phone-based login, self-registration, Presensi Pelayanan

- Login changed from username+password to **Nomor WA + password**
  (`Login.jsx`, `AppContext.login()`); demo quick-login buttons updated to
  match.
- New `Register.jsx` (`/register`, public route): minimal form (Nama
  Lengkap, Nomor WA, password) per explicit "hanya nomor WA yang
  diutamakan" instruction. New accounts start as `jemaat`, stage
  `newcomer`, no Care Group.
- New page `PresensiPelayanan.jsx` (`/presensi`, in nav): member
  self-check-in for ministry service (role + optional note), personal
  history list. Mirrored read-only tab added to the Ketua Komsel panel.
- `Home.jsx`, `Komsel.jsx` given explicit "no Care Group yet" fallback
  states so newly registered members don't hit a crash.
- Login demo-account list now shows each account's journey-stage label
  alongside its role, so multiple `jemaat` demo accounts are distinguishable
  at a glance.

## 2026-09-03 — Ajukan Pelayanan (service applications) + admin inbox

- `Tentang.jsx` rebuilt: removed the Roadmap Program 2026–2028 section;
  added a selectable-role "Ajukan Pelayanan" form (Alasan & Motivasi,
  Kesibukan Saat Ini) gated on having reached "Member Care Group" stage,
  plus a personal submission-history list.
- New Pengajuan Pelayanan inbox tab in both the Ketua Komsel panel
  (scoped to that leader's group) and Super Admin panel (org-wide), each
  with a mark-reviewed toggle and an unread-count badge on the tab.
- Data: `pelayananRoles`, `serviceApplicationSeed`; `AppContext`:
  `serviceApplications` + `submitServiceApplication()` +
  `toggleApplicationReviewed()`.

## 2026-09-03 — Multi-role architecture (auth, admin panels, journey model)

- Introduced `admin` (Ketua Komsel) and `super_admin` roles alongside
  `jemaat`; added `AppContext` auth (`login`/`logout`, `authUser`),
  `ProtectedRoute`, and a `Login.jsx` page with demo quick-login buttons for
  all three roles.
- New `KetuaKomselPanel.jsx` (Peserta Komsel incl. address/university
  fields, Kehadiran, Jadwal Komsel, Jadwal Khusus) and `SuperAdminPanel.jsx`
  (Renungan, Komsel, Peserta, Event, Jadwal Coaching), both behind `/admin`.
- Data model expanded from a single Care Group to `careGroupsSeed` (multiple
  groups); added multi-group support to `AppContext`
  (`addMemberToGroup`, `addMeetingToGroup`, `addCareGroup`,
  `setCareGroupLeader`, `moveMember` for Super Admin cross-group transfers).
- Journey stage `active` relabeled "Aktif di Care Group" → **"Member Care
  Group"**, now gated by `MEMBERSHIP_ATTENDANCE_THRESHOLD` (4 past
  attendances) rather than just "currently attending."
- Home: added attendance-streak stat card and a locked/unlocked "Pelayanan"
  card driven by the membership threshold.
- `Kehadiran` (attendance) views changed to show only the **last 7 days**
  (`isWithinLastWeek()`), in both the member Komsel page and the Ketua
  Komsel panel.
- Added 2 new demo `jemaat` accounts (an established "member" and a
  "newcomer") to make the two membership states demoable, plus contact
  fields (phone/address/university) on all seeded members.

## 2026-09-03 — Initial lo-fi prototype

- Scaffolded with Vite + React + React Router + Tailwind v4; warm-neutral +
  terracotta OKLCH palette, responsive shell (`AppShell.jsx`: sidebar on
  desktop, bottom tabs + top bar on mobile).
- Built the first five pages against a single-Care-Group mock: `Home.jsx`,
  `Komsel.jsx` (Anggota/Kehadiran/Materi tabs), `Jadwal.jsx` (filterable
  event schedule), `Doa.jsx` (prayer wall with add + "Doakan" counter),
  `Profil.jsx`, `Tentang.jsx` (SDA role glossary + program roadmap).
- Seed data (`mockData.js`), shared UI primitives (`components/ui.jsx`:
  Card, Badge, Avatar, EmptyState, SectionTitle), `JourneyStepper.jsx`.

// Mock data only — no backend. Everything here is static seed data for the prototype.
import { shiftDate } from '../utils/date'

export const journeyStages = [
  { id: 'newcomer', label: 'New Comer' },
  { id: 'first', label: 'First Coaching' },
  { id: 'second', label: 'Second Coaching' },
  { id: 'active', label: 'Member Care Group' },
  { id: 'leader', label: 'Training Leader' },
  { id: 'coach', label: 'Training Coach' },
]

// Minimum past attendances needed to graduate from "mengikuti" to formal "Member Care Group".
export const MEMBERSHIP_ATTENDANCE_THRESHOLD = 4

// Shared mapping from a tier's literal color name to a Badge component color key.
export const tierColorToBadge = { hijau: 'good', kuning: 'warn', merah: 'merah', coklat: 'coklat' }

// "Shema growth" milestones shown on Profil — each is a self-reported completion date.
export const growthMilestones = [
  { id: 'first', label: 'First Coaching' },
  { id: 'second', label: 'Second Coaching' },
  { id: 'third', label: 'Third Coaching' },
  { id: 'cgLeader', label: 'CG Leader Training' },
  { id: 'cgCoach', label: 'CG Coach Training' },
]

export const roleLabels = {
  jemaat: 'Anggota',
  admin: 'Ketua Komsel',
  coach: 'Coach',
  super_admin: 'Super Admin',
}

// Demo login accounts — plaintext only because this is a frontend-only mockup.
export const demoUsers = [
  {
    id: 'u_jemaat',
    username: 'jemaat',
    password: 'demo123',
    role: 'jemaat',
    name: 'Calvin Tanto',
    initials: 'CT',
    phone: '0812-1111-2222',
    journeyStageId: 'active',
    careGroupId: 'cg1',
    memberId: 'm3',
  },
  {
    id: 'u_ketua',
    username: 'ketua',
    password: 'demo123',
    role: 'admin',
    name: 'Andra Wijaya',
    initials: 'AW',
    phone: '0812-3456-7890',
    journeyStageId: 'leader',
    careGroupId: 'cg1',
    memberId: 'm1',
  },
  {
    id: 'u_super',
    username: 'superadmin',
    password: 'demo123',
    role: 'super_admin',
    name: 'Pdt. Budi Santoso',
    initials: 'BS',
    phone: '0812-9999-0000',
    journeyStageId: 'coach',
    careGroupId: null,
  },
  {
    id: 'u_coach',
    username: 'coach',
    password: 'demo123',
    role: 'coach',
    name: 'Pdt. Yohanes Setiawan',
    initials: 'YS',
    phone: '0812-8888-3333',
    journeyStageId: 'coach',
    careGroupId: null,
  },
]

// Self-registrations awaiting Super Admin approval — no password/account exists until approved.
export const pendingRegistrationSeed = [
  { id: 'pend1', name: 'Rina Wijayanti', phone: '0812-7000-1122', date: '2026-08-11' },
  { id: 'pend2', name: 'Yusuf Hartono', phone: '0812-7000-3344', date: '2026-08-12' },
]

export const careGroupCategoryCodes = {
  'Komunitas Persekutuan': '01',
  'Komunitas Kegiatan': '02',
  'Komunitas Badan Pelayanan': '03',
  'Komunitas Lainnya': '04',
}

export const CG_MIN_MEMBERS = 4
export const CG_MAX_MEMBERS = 15

export const careGroupsSeed = [
  {
    id: 'cg1',
    code: '0101',
    name: 'Care Group "Kasih Setia"',
    quote: 'Bersekutu, melayani, bertumbuh — bersama selalu lebih baik.',
    description: '',
    category: 'Komunitas Persekutuan',
    leaderId: 'm1',
    leaderName: 'Andra Wijaya',
    coachId: 'u_coach',
    coachName: 'Pdt. Yohanes Setiawan',
    meetingDay: 'Rabu',
    meetingTime: '19:00',
    meetingLocation: 'Rumah Kel. Santoso, Jl. Gejayan No. 12',
    frequency: '2x per bulan',
    members: [
      { id: 'm1', name: 'Andra Wijaya', initials: 'AW', role: 'Leader', phone: '0812-3456-7890', address: 'Jl. Gejayan No. 12, Depok, Sleman', university: '-', birthDate: '08-20' },
      { id: 'm2', name: 'Bunga Lestari', initials: 'BL', role: 'Pengurus CG', phone: '0813-2222-1111', address: 'Jl. Affandi No. 5, Sleman', university: 'UGM', birthDate: '03-15' },
      { id: 'm3', name: 'Calvin Tanto', initials: 'CT', role: 'Anggota', phone: '0812-1111-2222', address: 'Jl. Kaliurang Km 6, Sleman', university: 'UAJY', birthDate: '08-25' },
      { id: 'm4', name: 'Dinda Ayu', initials: 'DA', role: 'Anggota', phone: '0812-4444-5555', address: 'Jl. Colombo No. 8, Sleman', university: 'UNY', birthDate: '11-02' },
      { id: 'm5', name: 'Erik Susanto', initials: 'ES', role: 'Anggota', phone: '0813-5555-6666', address: 'Jl. Gejayan Gg. 3, Sleman', university: '-', birthDate: '01-10' },
      { id: 'm6', name: 'Felicia Halim', initials: 'FH', role: 'Anggota', phone: '0812-7777-8888', address: 'Jl. Nologaten No. 2, Sleman', university: 'UII', birthDate: '08-14' },
      { id: 'm7', name: 'Gilbert Prakoso', initials: 'GP', role: 'Anggota Baru', phone: '0812-6666-7777', address: 'Jl. Seturan No. 9, Sleman', university: 'UPN Veteran', birthDate: '05-30' },
    ],
    meetings: [
      { id: 'mt1', date: '2026-07-16', topic: 'Bersekutu dalam Kasih', attendance: { m1: true, m2: true, m3: true, m4: true, m5: true, m6: true, m7: false }, attendanceNotes: {} },
      { id: 'mt2', date: '2026-07-30', topic: 'Melayani Bersama', attendance: { m1: true, m2: true, m3: false, m4: true, m5: true, m6: false, m7: true }, attendanceNotes: { m3: 'Sakit' } },
      { id: 'mt5', date: '2026-08-09', topic: 'Doa & Sharing Singkat', attendance: { m1: true, m2: true, m3: true, m4: true, m5: true, m6: false, m7: true }, attendanceNotes: { m6: 'Izin, ada acara keluarga' } },
      { id: 'mt3', date: '2026-08-13', topic: 'Bertumbuh dalam Firman', attendance: {}, attendanceNotes: {} },
    ],
    activityPhotos: [
      { id: 'ap1', caption: 'Doa & sharing singkat di rumah Kel. Santoso', date: '2026-08-09' },
      { id: 'ap2', caption: 'Merayakan ulang tahun Felicia bersama-sama', date: '2026-07-30' },
      { id: 'ap3', caption: 'Bersekutu sambil makan malam bersama', date: '2026-07-16' },
    ],
  },
  {
    id: 'cg2',
    code: '0201',
    name: 'Care Group "Sukacita"',
    quote: 'Sukacita adalah kekuatan kita.',
    description: '',
    category: 'Komunitas Kegiatan',
    leaderId: 'm8',
    leaderName: 'Hana Puspita',
    coachId: 'u_coach',
    coachName: 'Pdt. Yohanes Setiawan',
    meetingDay: 'Jumat',
    meetingTime: '19:30',
    meetingLocation: 'GKI Gejayan, Ruang 4',
    frequency: '2x per bulan',
    members: [
      { id: 'm8', name: 'Hana Puspita', initials: 'HP', role: 'Leader', phone: '0813-1111-0000', address: 'Jl. Sagan No. 1, Sleman', university: '-', birthDate: '09-01' },
      { id: 'm9', name: 'Indra Kusuma', initials: 'IK', role: 'Anggota', phone: '0813-2222-0000', address: 'Jl. Kledokan No. 4, Sleman', university: 'UGM', birthDate: '08-18' },
      { id: 'm10', name: 'Joyce Aritonang', initials: 'JA', role: 'Anggota', phone: '0813-3333-0000', address: 'Jl. Babarsari No. 6, Sleman', university: 'UPN Veteran', birthDate: '12-25' },
    ],
    meetings: [
      { id: 'mt4', date: '2026-08-14', topic: 'Melayani dengan Sukacita', attendance: {}, attendanceNotes: {} },
    ],
    activityPhotos: [
      { id: 'ap4', caption: 'Latihan pujian sebelum ibadah multikultural', date: '2026-07-25' },
    ],
  },
  {
    id: 'cg3',
    code: '0301',
    name: 'Care Group "Damai Sejahtera"',
    quote: 'Damai sejahtera Kristus memerintah dalam hati kita.',
    description: '',
    category: 'Komunitas Badan Pelayanan',
    leaderId: 'm11',
    leaderName: 'Kevin Halim',
    coachId: null,
    coachName: 'Belum ditentukan',
    meetingDay: 'Sabtu',
    meetingTime: '16:00',
    meetingLocation: 'Rumah Kel. Halim',
    frequency: '1x per bulan',
    members: [
      { id: 'm11', name: 'Kevin Halim', initials: 'KH', role: 'Leader', phone: '0813-4444-0000', address: 'Jl. Nologaten No. 10, Sleman', university: '-', birthDate: '02-14' },
      { id: 'm12', name: 'Lidya Wijaya', initials: 'LW', role: 'Anggota', phone: '0813-5555-0000', address: 'Jl. Seturan No. 3, Sleman', university: 'UII', birthDate: '08-16' },
    ],
    meetings: [],
  },
]

export const careGroupCategories = [
  'Komunitas Persekutuan',
  'Komunitas Kegiatan',
  'Komunitas Badan Pelayanan',
  'Komunitas Lainnya',
]

// Important numbers shown on Home under "Contact Us", alongside the member's own CG leader.
export const churchContacts = [
  { name: 'Sekretariat GKI Gejayan', role: 'Kantor Gereja', phone: '0274-512345' },
  { name: 'Admin Tim SDA', role: 'Pertanyaan seputar Care Group & pelayanan', phone: '0812-0000-1234' },
]

// --- Program Shema Care Group — general/reference info (Sub Menu 3a) ---
export const cgGeneralInfo = {
  definition:
    'Care Group (CG) adalah komunitas hidup yang bersekutu, melayani, dan berjalan bersama dalam kehidupan sehari-hari. Setiap orang diharapkan masuk dalam salah satu Care Group.',
  capacityRule:
    `Satu Care Group beranggotakan minimal ${CG_MIN_MEMBERS} dan maksimal ${CG_MAX_MEMBERS} orang. Setelah mencapai batas maksimal, CG diharapkan membelah menjadi dua CG baru agar tetap bertumbuh secara sehat.`,
  namingRule:
    'Penamaan CG bebas dan disetujui admin. Setiap CG mendapat kode "KKNN" — 2 digit pertama adalah kode kategori/badan pelayanan, 2 digit berikutnya adalah nomor urut terbentuknya CG dalam kategori tersebut.',
  registrationSteps: [
    'Hubungi admin utama atau Ketua Komsel untuk menyatakan minat bergabung.',
    'Pilih atau ditempatkan pada salah satu Care Group yang masih memiliki kuota.',
    'Ikuti pertemuan CG beberapa kali sebagai peserta sebelum menjadi member resmi.',
  ],
  trainingScheduleNote:
    'First Coaching dan Second Coaching diadakan tiap minggu. Training gerejawi lainnya diadakan paling lambat 3 bulan sekali.',
}

export const cgRoleJobdesk = [
  { role: 'Anggota', desc: 'Mengikuti pertemuan rutin CG dan bertumbuh bersama anggota lain.' },
  { role: 'Calon Leader', desc: 'Anggota yang mulai dipersiapkan dan dibina untuk memimpin CG.' },
  { role: 'Kandidat Leader', desc: 'Calon leader yang sudah mengikuti training kepemimpinan dan siap ditempatkan.' },
  { role: 'Leader', desc: 'Memimpin satu CG — memelihara spiritualitas anggota dan menggerakkan pelayanan.' },
]

// Individual attendance growth ladder ("Status Pertumbuhan") — Sub Menu 3c.
export const cgGrowthTiers = [
  { id: 'kokoh', label: 'Bertumbuh Kokoh', color: 'hijau', windowDays: 1095, threshold: 73 },
  { id: 'sehat-merah', label: 'Bertumbuh Sehat', color: 'merah', windowDays: 1095, threshold: 72 },
  { id: 'sehat-kuning', label: 'Bertumbuh Sehat', color: 'kuning', windowDays: 1095, threshold: 60 },
  { id: 'kuat-merah', label: 'Bertumbuh Kuat', color: 'merah', windowDays: 365, threshold: 24 },
  { id: 'kuat-kuning', label: 'Bertumbuh Kuat', color: 'kuning', windowDays: 365, threshold: 20 },
  { id: 'merah', label: 'Bertumbuh', color: 'merah', windowDays: 180, threshold: 12 },
  { id: 'kuning', label: 'Bertumbuh', color: 'kuning', windowDays: 180, threshold: 10 },
  { id: 'mulai', label: 'Mulai Bertumbuh', color: 'coklat', windowDays: 90, threshold: 4 },
]

// Invitation / multiplication ladder ("Beranting") — self-reported, Sub Menu 3c.
export const invitationTiers = [
  { id: 'sehat', label: 'Beranting Sehat', color: 'hijau', windowDays: 1095, threshold: 9 },
  { id: 'lebat', label: 'Beranting Lebat', color: 'merah', windowDays: 365, threshold: 8 },
  { id: 'beranting', label: 'Beranting', color: 'kuning', windowDays: 180, threshold: 4 },
  { id: 'mulai', label: 'Mulai Beranting', color: 'coklat', windowDays: 90, threshold: 2 },
]

// Role-progression ladder shown as a read-only stepper — Sub Menu 3c.
export const roleProgressionStages = [
  { id: 'member', label: 'Member' },
  { id: 'aktif', label: 'Member Aktif' },
  { id: 'melayani', label: 'Melayani CG / Pengurus CG' },
  { id: 'calon', label: 'Calon Leader' },
  { id: 'kandidat', label: 'Kandidat Leader' },
  { id: 'leader', label: 'Leader' },
]

// Maps a member's CG role string to its stage in roleProgressionStages.
export const cgRoleToStageId = {
  'Anggota Baru': 'member',
  Anggota: 'aktif',
  'Pengurus CG': 'melayani',
  'Calon Leader': 'calon',
  'Kandidat Leader': 'kandidat',
  Leader: 'leader',
}

// The one-step-at-a-time promotion path a Ketua Komsel can move a member along, from
// this panel. Reaching "Leader" itself stays a separate, Super Admin-only action
// (Komsel tab's leader-reassignment dropdown) — this only covers the stages below it.
// Returns null once a member is already at the top of this ladder (or already Leader).
export function nextPromotionRole(role) {
  if (role === 'Leader' || role === 'Kandidat Leader') return null
  if (role === 'Calon Leader') return 'Kandidat Leader'
  if (role === 'Pengurus CG') return 'Calon Leader'
  return 'Pengurus CG'
}

// People a member has self-reported inviting to join a Care Group.
export const invitationSeed = [
  { id: 'inv1', memberId: 'm1', careGroupId: 'cg1', invitedName: 'Reza Pratama', date: '2026-07-20' },
  { id: 'inv2', memberId: 'm1', careGroupId: 'cg1', invitedName: 'Sari Wulandari', date: '2026-08-01' },
]

export const materiSeed = [
  {
    id: 'mat1',
    week: 'Minggu ke-1 Agustus',
    title: 'Bertumbuh dalam Firman',
    verse: 'Mazmur 1:2-3',
    summary: 'Renungan tentang kebiasaan merenungkan Firman setiap hari dan buah yang dihasilkannya.',
    questions: [
      'Apa kebiasaan rohani yang paling sulit kamu jaga konsistensinya?',
      'Ceritakan satu momen ketika Firman Tuhan menguatkanmu minggu ini.',
      'Apa satu langkah kecil yang bisa kamu ambil minggu ini untuk lebih dekat dengan Tuhan?',
    ],
  },
  {
    id: 'mat2',
    week: 'Minggu ke-4 Juli',
    title: 'Melayani Bersama',
    verse: '1 Petrus 4:10',
    summary: 'Setiap orang menerima karunia yang berbeda-beda — bagaimana Care Group bisa menjadi tempat melayani bersama.',
    questions: [
      'Karunia apa yang kamu rasa Tuhan percayakan padamu?',
      'Bagaimana Care Group ini bisa melayani jemaat/komunitas di sekitar?',
    ],
  },
  {
    id: 'mat3',
    week: 'Minggu ke-2 Juli',
    title: 'Bersekutu dalam Kasih',
    verse: 'Yohanes 13:34-35',
    summary: 'Kasih antar anggota Care Group adalah tanda pengenal murid Kristus.',
    questions: [
      'Bagaimana kamu bisa menunjukkan kasih pada anggota CG minggu ini?',
      'Siapa dalam CG ini yang perlu kamu hubungi/kunjungi?',
    ],
  },
]

export const eventsSeed = [
  { id: 'e1', date: '2026-08-12', time: '18:00', title: 'First Coaching', category: 'Coaching', location: 'Ruang 2, GKI Gejayan', note: 'Tiap Selasa', milestoneId: 'first' },
  { id: 'e2', date: '2026-08-13', time: '19:00', title: 'Pertemuan Care Group "Kasih Setia"', category: 'Care Group', location: 'Rumah Kel. Santoso' },
  { id: 'e3', date: '2026-08-16', time: '07:00', title: 'Ibadah Minggu Pagi', category: 'Ibadah', location: 'Gedung Utama' },
  { id: 'e4', date: '2026-08-16', time: '09:30', title: 'Ibadah Multikultural', category: 'Ibadah', location: 'Youth Centre' },
  { id: 'e5', date: '2026-08-19', time: '18:00', title: 'First Coaching', category: 'Coaching', location: 'Ruang 2, GKI Gejayan', note: 'Tiap Selasa', milestoneId: 'first' },
  { id: 'e6', date: '2026-08-22', time: '09:00', title: 'Training Leader Care Group', category: 'Training', location: 'Aula Youth Centre', milestoneId: 'cgLeader' },
  { id: 'e7', date: '2026-08-23', time: '07:00', title: 'Ibadah Minggu Pagi', category: 'Ibadah', location: 'Gedung Utama' },
  { id: 'e8', date: '2026-08-27', time: '19:00', title: 'Second Coaching + Latihan Care Group', category: 'Coaching', location: 'Ruang 3, GKI Gejayan', milestoneId: 'second' },
  { id: 'e9', date: '2026-09-05', time: '09:00', title: 'Third Coaching', category: 'Training', location: 'Aula Youth Centre', milestoneId: 'third' },
  { id: 'e10', date: '2026-09-12', time: '09:00', title: 'Training Coach', category: 'Training', location: 'Aula Youth Centre', milestoneId: 'cgCoach' },
]

export const eventCategories = ['Semua', 'Ibadah', 'Care Group', 'Coaching', 'Training', 'Acara Khusus']

export const announcements = [
  {
    id: 'a1',
    date: '2026-08-10',
    title: 'Pendaftaran Coach baru dibuka',
    body: 'Bagi Leader Care Group yang sudah aktif minimal 6 bulan, pendaftaran Training Coach dibuka sampai akhir Agustus. Daftar lewat admin CG masing-masing atau langsung ke sekretariat.',
    images: [{ id: 'a1-1', caption: 'Poster pendaftaran Training Coach' }],
  },
  {
    id: 'a2',
    date: '2026-08-05',
    title: 'Target 20 Care Group di 2027',
    body: 'Tim SDA mengajak seluruh jemaat untuk ambil bagian — 1 orang, 1 Care Group, 1 pelayanan. Berikut dokumentasi sosialisasi program di beberapa Care Group.',
    images: [
      { id: 'a2-1', caption: 'Sosialisasi di Care Group "Kasih Setia"' },
      { id: 'a2-2', caption: 'Sosialisasi di Care Group "Sukacita"' },
      { id: 'a2-3', caption: 'Antusiasme peserta First Coaching' },
    ],
  },
  {
    id: 'a3',
    date: '2026-07-28',
    title: 'Modul Second Coaching sudah tersedia',
    body: 'Modul dapat diambil di sekretariat atau diunduh lewat aplikasi ini.',
    images: [],
  },
]

export const prayerSeed = [
  { id: 'p1', name: 'Bunga Lestari', text: 'Mendoakan kesembuhan ibu saya yang sedang dirawat di rumah sakit.', category: 'Kesehatan', prayedCount: 12, date: '2026-08-09' },
  { id: 'p2', name: 'Calvin Tanto', text: 'Mohon doa untuk keputusan pekerjaan baru yang harus saya ambil bulan ini.', category: 'Pekerjaan', prayedCount: 7, date: '2026-08-08' },
  { id: 'p3', name: 'Anonim', text: 'Pergumulan keluarga — mohon dukungan doa agar ada pemulihan hubungan.', category: 'Keluarga', prayedCount: 20, date: '2026-08-06' },
  { id: 'p4', name: 'Felicia Halim', text: 'Bersyukur untuk kelulusan sidang skripsi minggu lalu, mohon doa untuk langkah selanjutnya.', category: 'Syukur', prayedCount: 15, date: '2026-08-04' },
]

export const prayerCategories = ['Kesehatan', 'Keluarga', 'Pekerjaan', 'Syukur', 'Lainnya']

export const sdaRoles = [
  {
    id: 'greeter',
    name: 'Greeter',
    color: 'brand',
    desc: 'Aktifis yang bertugas menyambut/greeting, mendoakan, dan mengarahkan potensi jemaat. Disebut juga seorang Catcher.',
  },
  {
    id: 'catcher',
    name: 'Catcher',
    color: 'good',
    desc: 'Aktifis yang bertugas "menangkap" potensi aktifis baru — bisa jemaat lama atau baru yang belum melayani.',
  },
  {
    id: 'caregroup',
    name: 'Care Group (CG)',
    color: 'ink',
    desc: 'Komunitas hidup yang bersekutu, melayani, dan berjalan bersama dalam kehidupan sehari-hari. Setiap orang diharapkan masuk dalam salah satu Care Group.',
  },
  {
    id: 'leader',
    name: 'Leader',
    color: 'warn',
    desc: 'Pemimpin dari satu Care Group. Bertugas memelihara spiritualitas anggota, bersekutu, saling perhatian, saling berkunjung, dan menggerakkan untuk melayani & tumbuh bersama.',
  },
  {
    id: 'pengurus',
    name: 'Pengurus Care Group',
    color: 'good',
    desc: 'Aktifis yang membantu Leader menghidupkan Care Group dengan berbagai kegiatan CG-nya.',
  },
  {
    id: 'coach',
    name: 'Coach',
    color: 'brand',
    desc: 'Pemimpin dari berbagai pembinaan seperti First Coaching dan Second Coaching. Bisa juga menjadi pembimbing dari beberapa Leader.',
  },
  {
    id: 'shepherd',
    name: 'Shepherd',
    color: 'ink',
    desc: 'Pembimbing/pendamping dari beberapa Coach.',
  },
]

// Roles a member can express interest in via the "Ajukan Pelayanan" form.
export const pelayananRoles = sdaRoles.filter((r) => r.id !== 'caregroup')

export const serviceApplicationSeed = [
  {
    id: 'sa1',
    memberName: 'Felicia Halim',
    careGroupId: 'cg1',
    careGroupName: 'Care Group "Kasih Setia"',
    roleId: 'greeter',
    roleName: 'Greeter',
    reason: 'Saya senang menyambut orang baru dan ingin lebih terlibat melayani di ibadah Minggu.',
    availability: 'Bisa hadir tiap Minggu pagi, kadang berhalangan kalau ada acara kampus.',
    date: '2026-08-07',
    reviewed: false,
  },
  {
    id: 'sa2',
    memberName: 'Indra Kusuma',
    careGroupId: 'cg2',
    careGroupName: 'Care Group "Sukacita"',
    roleId: 'pengurus',
    roleName: 'Pengurus Care Group',
    reason: 'Sudah setahun aktif di CG dan ingin membantu Leader mengatur kegiatan.',
    availability: 'Sibuk kerja Senin–Jumat, akhir pekan cenderung longgar.',
    date: '2026-08-05',
    reviewed: true,
  },
]

// Self check-ins members log when they actually serve in a pelayanan role.
export const pelayananCheckinSeed = [
  {
    id: 'pc1',
    memberId: 'm6',
    memberName: 'Felicia Halim',
    careGroupId: 'cg1',
    careGroupName: 'Care Group "Kasih Setia"',
    roleName: 'Greeter',
    date: '2026-08-09',
    note: 'Ibadah pagi pukul 07.00',
  },
  {
    id: 'pc2',
    memberId: 'm9',
    memberName: 'Indra Kusuma',
    careGroupId: 'cg2',
    careGroupName: 'Care Group "Sukacita"',
    roleName: 'Catcher',
    date: '2026-08-02',
    note: 'Ibadah Multikultural',
  },
]

// --- Program Baca Alkitab Harian (Daily Shema) ---

export const renunganHarianSeed = [
  {
    id: 'rh1',
    date: '2026-08-13',
    title: 'Setia dalam Perkara Kecil',
    verse: 'Lukas 16:10',
    image: { caption: 'Ilustrasi renungan hari ini' },
    text: [
      'Seorang petani muda pernah bertanya kepada gurunya, mengapa ia harus repot-repot mencabuti rumput liar di sudut ladang yang paling kecil dan jarang dilewati orang. "Toh tidak ada yang melihat," katanya. Sang guru menjawab, "Bukan ladangnya yang sedang diuji, tapi hatimu — apakah kamu bekerja untuk dilihat orang, atau karena kamu mengasihi pekerjaanmu."',
      'Yesus mengajarkan prinsip yang sama dalam Lukas 16:10 — "Siapa setia dalam perkara-perkara kecil, ia setia juga dalam perkara-perkara besar; dan siapa tidak jujur dalam perkara-perkara kecil, ia juga tidak jujur dalam perkara-perkara besar." Kesetiaan bukan soal besar-kecilnya tanggung jawab yang kita pegang, melainkan soal konsistensi hati — apakah kita tetap jujur dan bertanggung jawab ketika tidak ada seorang pun yang mengawasi.',
      'Banyak dari kita berdoa meminta tanggung jawab besar, pelayanan yang berdampak luas, atau posisi yang berpengaruh. Namun Tuhan sering kali menguji kita terlebih dahulu lewat hal-hal kecil: datang tepat waktu ke persekutuan, menepati janji sederhana, jujur dalam laporan keuangan CG yang nilainya tidak seberapa, atau setia mendoakan satu nama di pokok doa setiap hari. Bagaimana kita memperlakukan hal-hal kecil ini menunjukkan siapa kita yang sebenarnya.',
      'Hari ini, mungkin tidak ada tepuk tangan atau pengakuan atas apa yang kamu kerjakan. Tidak apa-apa. Tuhan yang melihat hati sedang mencatat kesetiaanmu, dan Ia sedang mempersiapkanmu untuk perkara-perkara yang lebih besar — pada waktu-Nya.',
    ],
    audioLabel: 'Dengarkan (5:12)',
    prayerGuide: 'Bapa, ajar aku setia dalam hal-hal kecil hari ini — dalam pekerjaan, perkataan, dan waktu teduhku bersama-Mu. Amin.',
    likes: 8,
    comments: [
      { id: 'c1', userId: null, memberName: 'Bunga Lestari', text: 'Amin, menguatkan sekali pagi ini 🙏', date: '2026-08-13' },
    ],
  },
  {
    id: 'rh2',
    date: '2026-08-12',
    title: 'Damai yang Melampaui Akal',
    verse: 'Filipi 4:7',
    image: { caption: 'Ilustrasi renungan' },
    text: [
      'Beberapa waktu lalu, seorang jemaat bercerita bagaimana ia menghabiskan hampir semalam suntuk mencemaskan hasil pemeriksaan kesehatan yang akan keluar esok harinya. Ia berdoa, tapi terus memikirkan segala kemungkinan terburuk. Baru menjelang subuh ia menyadari, ia sudah membawa kekuatirannya dalam doa berkali-kali, tapi belum pernah benar-benar melepaskannya.',
      'Paulus menulis dari dalam penjara, situasi yang jauh lebih genting dari kekuatiran sehari-hari kita, namun ia menuliskan Filipi 4:6-7: "Janganlah hendaknya kamu kuatir tentang apapun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan syukur. Damai sejahtera Allah, yang melampaui segala akal, akan memelihara hati dan pikiranmu dalam Kristus Yesus."',
      'Perhatikan urutannya: doa dan permohonan disertai ucapan syukur — bukan sekadar menyerahkan masalah, tapi juga bersyukur di tengah masalah itu. Ucapan syukur mengubah fokus kita dari besarnya masalah kepada besarnya Tuhan yang kita percaya. Hasilnya bukan jawaban instan atas semua pertanyaan kita, melainkan damai sejahtera yang menjaga — sesuatu yang tidak bisa dijelaskan akal sehat, tapi nyata dirasakan hati yang percaya.',
      'Apa yang sedang kamu kuatirkan hari ini? Alih-alih memikirkannya berulang-ulang, cobalah menuliskannya sebagai doa, sertakan satu hal yang bisa kamu syukuri di tengah situasi itu, lalu percayakan sisanya kepada Tuhan.',
    ],
    audioLabel: 'Dengarkan (4:45)',
    prayerGuide: 'Tuhan, hari ini aku menyerahkan kekuatiranku pada-Mu. Jagalah hati dan pikiranku dengan damai sejahtera-Mu. Amin.',
    likes: 14,
    comments: [],
  },
  {
    id: 'rh3',
    date: '2026-08-11',
    title: 'Kekuatan dari Firman',
    verse: 'Mazmur 119:105',
    image: { caption: 'Ilustrasi renungan' },
    text: [
      'Sebelum ada lampu senter, orang-orang berjalan malam hari dengan pelita kecil yang diikat di kaki atau dibawa di tangan. Cahayanya tidak jauh — hanya cukup untuk melihat beberapa langkah di depan, tidak sampai ke ujung jalan. Untuk sampai ke tujuan, orang harus terus melangkah, percaya bahwa cahaya berikutnya akan muncul begitu langkah berikutnya diambil.',
      'Pemazmur menuliskan gambaran ini dalam Mazmur 119:105 — "Firman-Mu itu pelita bagi kakiku dan terang bagi jalanku." Bukan lampu sorot yang menerangi seluruh jalan sekaligus, tapi pelita yang cukup untuk langkah berikutnya. Ini mengajarkan kita sesuatu yang penting tentang bagaimana Tuhan memimpin: Ia jarang menunjukkan seluruh rencana-Nya sekaligus, tapi Ia selalu memberi cukup terang untuk langkah yang ada di depan kita hari ini.',
      'Banyak dari kita ingin tahu seluruh jalan sebelum melangkah — bagaimana kelanjutan pekerjaan, bagaimana masa depan pelayanan, bagaimana ujung dari pergumulan yang sedang dihadapi. Firman Tuhan tidak selalu menjawab semua itu sekaligus. Tapi Ia menjanjikan cukup terang untuk hari ini, cukup hikmat untuk keputusan yang harus diambil sekarang, cukup kekuatan untuk melangkah satu langkah lagi.',
      'Mungkin kamu sedang berada di titik gelap, tidak tahu apa yang akan terjadi bulan depan atau tahun depan. Firman Tuhan mengundangmu bukan untuk melihat seluruh jalan, tapi untuk percaya dan melangkah — satu ayat, satu hari, satu langkah pada satu waktu.',
    ],
    audioLabel: 'Dengarkan (3:58)',
    prayerGuide: 'Bapa, jadikan Firman-Mu pelita yang menuntun setiap langkahku hari ini. Amin.',
    likes: 5,
    comments: [],
  },
]

// Achievement ladder for consistent daily Bible reading — evaluated strongest tier first.
export const readingTiers = [
  { id: 'kokoh', label: 'Berakar Kokoh', color: 'hijau', windowDays: 1095, threshold: 1090 },
  { id: 'kuat-merah', label: 'Berakar Kuat', color: 'merah', windowDays: 1095, threshold: 1080 },
  { id: 'kuat-kuning', label: 'Berakar Kuat', color: 'kuning', windowDays: 1095, threshold: 900 },
  { id: 'dalam-merah', label: 'Berakar Dalam', color: 'merah', windowDays: 365, threshold: 360 },
  { id: 'dalam-kuning', label: 'Berakar Dalam', color: 'kuning', windowDays: 365, threshold: 300 },
  { id: 'merah', label: 'Berakar', color: 'merah', windowDays: 90, threshold: 90 },
  { id: 'kuning', label: 'Berakar', color: 'kuning', windowDays: 90, threshold: 75 },
  { id: 'coklat', label: 'Mulai Berakar', color: 'coklat', windowDays: 30, threshold: 25 },
]

function generateDailyCheckins(userId, days, todayStr = '2026-08-13') {
  return Array.from({ length: days }, (_, i) => ({
    id: `br-${userId}-${i}`,
    userId,
    date: shiftDate(todayStr, -i),
  }))
}

// Keyed by account id (not memberId) — daily reading is personal and shouldn't require Care Group membership.
// Andra (u_ketua) has read consistently — enough to have unlocked "Mulai Berakar". Calvin (u_jemaat) is just getting started.
export const bibleReadingCheckinSeed = [
  ...generateDailyCheckins('u_ketua', 26),
  ...generateDailyCheckins('u_jemaat', 5),
]

// Other church-related trainings a member has attended, outside the standard growth track. Keyed by account id.
export const otherTrainingSeed = {
  u_ketua: [{ id: 'ot1', name: 'Pelatihan Konseling Dasar', date: '2025-11-02' }],
}

// Self-reported completion dates for each Shema growth milestone, keyed by account id.
export const growthDatesSeed = {
  u_ketua: { first: '2025-02-04', second: '2025-04-18', third: '2025-09-12', cgLeader: '2026-01-20', cgCoach: null },
  u_jemaat: { first: '2025-05-10', second: '2025-07-22', third: null, cgLeader: null, cgCoach: null },
}

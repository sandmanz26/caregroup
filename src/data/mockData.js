// Mock data only — no backend. Everything here is static seed data for the prototype.

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

export const roleLabels = {
  jemaat: 'Anggota',
  admin: 'Ketua Komsel',
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
    id: 'u_member',
    username: 'anggota',
    password: 'demo123',
    role: 'jemaat',
    name: 'Dinda Ayu',
    initials: 'DA',
    phone: '0812-4444-5555',
    journeyStageId: 'active',
    careGroupId: 'cg1',
    memberId: 'm4',
  },
  {
    id: 'u_newcomer',
    username: 'baru',
    password: 'demo123',
    role: 'jemaat',
    name: 'Gilbert Prakoso',
    initials: 'GP',
    phone: '0812-6666-7777',
    journeyStageId: 'second',
    careGroupId: 'cg1',
    memberId: 'm7',
  },
]

export const careGroupsSeed = [
  {
    id: 'cg1',
    name: 'Care Group "Kasih Setia"',
    category: 'Komunitas Persekutuan',
    leaderId: 'm1',
    leaderName: 'Andra Wijaya',
    meetingDay: 'Rabu',
    meetingTime: '19:00',
    meetingLocation: 'Rumah Kel. Santoso, Jl. Gejayan No. 12',
    frequency: '2x per bulan',
    members: [
      { id: 'm1', name: 'Andra Wijaya', initials: 'AW', role: 'Leader', phone: '0812-3456-7890', address: 'Jl. Gejayan No. 12, Depok, Sleman', university: '-' },
      { id: 'm2', name: 'Bunga Lestari', initials: 'BL', role: 'Pengurus CG', phone: '0813-2222-1111', address: 'Jl. Affandi No. 5, Sleman', university: 'UGM' },
      { id: 'm3', name: 'Calvin Tanto', initials: 'CT', role: 'Anggota', phone: '0812-1111-2222', address: 'Jl. Kaliurang Km 6, Sleman', university: 'UAJY' },
      { id: 'm4', name: 'Dinda Ayu', initials: 'DA', role: 'Anggota', phone: '0812-4444-5555', address: 'Jl. Colombo No. 8, Sleman', university: 'UNY' },
      { id: 'm5', name: 'Erik Susanto', initials: 'ES', role: 'Anggota', phone: '0813-5555-6666', address: 'Jl. Gejayan Gg. 3, Sleman', university: '-' },
      { id: 'm6', name: 'Felicia Halim', initials: 'FH', role: 'Anggota', phone: '0812-7777-8888', address: 'Jl. Nologaten No. 2, Sleman', university: 'UII' },
      { id: 'm7', name: 'Gilbert Prakoso', initials: 'GP', role: 'Anggota Baru', phone: '0812-6666-7777', address: 'Jl. Seturan No. 9, Sleman', university: 'UPN Veteran' },
    ],
    meetings: [
      { id: 'mt1', date: '2026-07-16', topic: 'Bersekutu dalam Kasih', attendance: { m1: true, m2: true, m3: true, m4: true, m5: true, m6: true, m7: false } },
      { id: 'mt2', date: '2026-07-30', topic: 'Melayani Bersama', attendance: { m1: true, m2: true, m3: false, m4: true, m5: true, m6: false, m7: true } },
      { id: 'mt5', date: '2026-08-09', topic: 'Doa & Sharing Singkat', attendance: { m1: true, m2: true, m3: true, m4: true, m5: true, m6: false, m7: true } },
      { id: 'mt3', date: '2026-08-13', topic: 'Bertumbuh dalam Firman', attendance: {} },
    ],
  },
  {
    id: 'cg2',
    name: 'Care Group "Sukacita"',
    category: 'Komunitas Kegiatan',
    leaderId: 'm8',
    leaderName: 'Hana Puspita',
    meetingDay: 'Jumat',
    meetingTime: '19:30',
    meetingLocation: 'GKI Gejayan, Ruang 4',
    frequency: '2x per bulan',
    members: [
      { id: 'm8', name: 'Hana Puspita', initials: 'HP', role: 'Leader', phone: '0813-1111-0000', address: 'Jl. Sagan No. 1, Sleman', university: '-' },
      { id: 'm9', name: 'Indra Kusuma', initials: 'IK', role: 'Anggota', phone: '0813-2222-0000', address: 'Jl. Kledokan No. 4, Sleman', university: 'UGM' },
      { id: 'm10', name: 'Joyce Aritonang', initials: 'JA', role: 'Anggota', phone: '0813-3333-0000', address: 'Jl. Babarsari No. 6, Sleman', university: 'UPN Veteran' },
    ],
    meetings: [
      { id: 'mt4', date: '2026-08-14', topic: 'Melayani dengan Sukacita', attendance: {} },
    ],
  },
  {
    id: 'cg3',
    name: 'Care Group "Damai Sejahtera"',
    category: 'Komunitas Badan Pelayanan',
    leaderId: 'm11',
    leaderName: 'Kevin Halim',
    meetingDay: 'Sabtu',
    meetingTime: '16:00',
    meetingLocation: 'Rumah Kel. Halim',
    frequency: '1x per bulan',
    members: [
      { id: 'm11', name: 'Kevin Halim', initials: 'KH', role: 'Leader', phone: '0813-4444-0000', address: 'Jl. Nologaten No. 10, Sleman', university: '-' },
      { id: 'm12', name: 'Lidya Wijaya', initials: 'LW', role: 'Anggota', phone: '0813-5555-0000', address: 'Jl. Seturan No. 3, Sleman', university: 'UII' },
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
  { id: 'e1', date: '2026-08-12', time: '18:00', title: 'First Coaching', category: 'Coaching', location: 'Ruang 2, GKI Gejayan', note: 'Tiap Selasa' },
  { id: 'e2', date: '2026-08-13', time: '19:00', title: 'Pertemuan Care Group "Kasih Setia"', category: 'Care Group', location: 'Rumah Kel. Santoso' },
  { id: 'e3', date: '2026-08-16', time: '07:00', title: 'Ibadah Minggu Pagi', category: 'Ibadah', location: 'Gedung Utama' },
  { id: 'e4', date: '2026-08-16', time: '09:30', title: 'Ibadah Multikultural', category: 'Ibadah', location: 'Youth Centre' },
  { id: 'e5', date: '2026-08-19', time: '18:00', title: 'First Coaching', category: 'Coaching', location: 'Ruang 2, GKI Gejayan', note: 'Tiap Selasa' },
  { id: 'e6', date: '2026-08-22', time: '09:00', title: 'Training Leader Care Group', category: 'Training', location: 'Aula Youth Centre' },
  { id: 'e7', date: '2026-08-23', time: '07:00', title: 'Ibadah Minggu Pagi', category: 'Ibadah', location: 'Gedung Utama' },
  { id: 'e8', date: '2026-08-27', time: '19:00', title: 'Second Coaching + Latihan Care Group', category: 'Coaching', location: 'Ruang 3, GKI Gejayan' },
]

export const eventCategories = ['Semua', 'Ibadah', 'Care Group', 'Coaching', 'Training', 'Acara Khusus']

export const announcements = [
  { id: 'a1', date: '2026-08-10', title: 'Pendaftaran Coach baru dibuka', body: 'Bagi Leader Care Group yang sudah aktif minimal 6 bulan, pendaftaran Training Coach dibuka sampai akhir Agustus.' },
  { id: 'a2', date: '2026-08-05', title: 'Target 20 Care Group di 2027', body: 'Tim SDA mengajak seluruh jemaat untuk ambil bagian — 1 orang, 1 Care Group, 1 pelayanan.' },
  { id: 'a3', date: '2026-07-28', title: 'Modul Second Coaching sudah tersedia', body: 'Modul dapat diambil di sekretariat atau diunduh lewat aplikasi ini.' },
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

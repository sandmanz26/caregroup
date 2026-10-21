import { Card, SectionTitle } from './ui'

const QA = [
  {
    q: 'Bagaimana cara mengubah data diriku?',
    a: 'Nama, alamat, universitas, dan tanggal lahir bisa kamu ubah sendiri lewat Profil → ikon pengaturan. Untuk data yang tidak bisa diubah sendiri (misalnya Nomor WA yang dipakai masuk), sampaikan ke Leader CG-mu, lalu Leader menyampaikannya ke Admin.',
  },
  {
    q: 'Bagaimana cara pindah Care Group?',
    a: 'Sampaikan keinginanmu kepada Leader CG-mu. Leader meneruskannya ke Admin Utama, lalu Admin yang mengubah keanggotaanmu ke CG yang baru.',
  },
]

export default function QASection() {
  return (
    <Card id="qa">
      <SectionTitle>Q&amp;A</SectionTitle>
      <ul className="flex flex-col divide-y divide-ink-100">
        {QA.map((item) => (
          <li key={item.q} className="first:pt-0 last:pb-0">
            <details className="group py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-ink-900">
                {item.q}
                <span className="text-ink-400 transition-transform group-open:rotate-180">&#9662;</span>
              </summary>
              <p className="mt-2 text-sm text-ink-600">{item.a}</p>
            </details>
          </li>
        ))}
      </ul>
    </Card>
  )
}

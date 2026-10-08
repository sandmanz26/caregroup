import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, SectionTitle } from '../components/ui'

const inputClass = 'w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400'
const FONT_OPTIONS = [
  { label: 'Kecil', value: 0.9 },
  { label: 'Normal', value: 1 },
  { label: 'Besar', value: 1.15 },
  { label: 'Sangat besar', value: 1.3 },
]

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-500">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  )
}

function ProfileForm() {
  const { user, myCareGroup, updateProfile } = useApp()
  const member = myCareGroup?.members.find((m) => m.id === user.memberId)
  const [name, setName] = useState(user.name)
  const [address, setAddress] = useState(member?.address || '')
  const [university, setUniversity] = useState(member?.university || '')
  const [birthDate, setBirthDate] = useState(member?.birthDate || '')
  const [message, setMessage] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    const result = updateProfile({ name, address, university, birthDate })
    setMessage(result.ok ? { ok: true, text: 'Profil tersimpan.' } : { ok: false, text: result.error })
  }

  return (
    <Card>
      <SectionTitle>Ubah Profil</SectionTitle>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field label="Nama lengkap">
          <input value={name} onChange={(e) => { setName(e.target.value); setMessage(null) }} required className={inputClass} />
        </Field>
        {member && (
          <>
            <Field label="Alamat">
              <input value={address} onChange={(e) => { setAddress(e.target.value); setMessage(null) }} className={inputClass} />
            </Field>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Universitas">
                <input value={university} onChange={(e) => { setUniversity(e.target.value); setMessage(null) }} className={inputClass} />
              </Field>
              <Field label="Tanggal lahir (BB-TT)" hint="Contoh: 08-25">
                <input value={birthDate} onChange={(e) => { setBirthDate(e.target.value); setMessage(null) }} placeholder="08-25" className={inputClass} />
              </Field>
            </div>
          </>
        )}
        <Field
          label="Nomor WA (dipakai untuk masuk)"
          hint="Untuk mengganti Nomor WA, sampaikan ke Leader CG-mu. Leader akan meneruskannya ke Admin."
        >
          <input value={user.phone} disabled className={`${inputClass} bg-ink-100 text-ink-500`} />
        </Field>
        <div className="flex items-center justify-between">
          {message ? (
            <span className={`flex items-center gap-1.5 text-sm font-medium ${message.ok ? 'text-good-500' : 'text-red-600'}`}>
              {message.ok && <CheckCircle2 size={15} />} {message.text}
            </span>
          ) : (
            <span />
          )}
          <button type="submit" className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            Simpan profil
          </button>
        </div>
      </form>
    </Card>
  )
}

function PasswordForm() {
  const { changePassword } = useApp()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (next !== confirm) {
      setMessage({ ok: false, text: 'Kode sandi baru dan ulangannya tidak sama.' })
      return
    }
    const result = changePassword(current, next)
    if (result.ok) {
      setCurrent('')
      setNext('')
      setConfirm('')
      setMessage({ ok: true, text: 'Kode sandi diubah.' })
    } else {
      setMessage({ ok: false, text: result.error })
    }
  }

  return (
    <Card>
      <SectionTitle>Kode Sandi</SectionTitle>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field label="Kode sandi saat ini">
          <input type="password" value={current} onChange={(e) => { setCurrent(e.target.value); setMessage(null) }} required className={inputClass} />
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Kode sandi baru" hint="Minimal 6 karakter">
            <input type="password" value={next} onChange={(e) => { setNext(e.target.value); setMessage(null) }} required className={inputClass} />
          </Field>
          <Field label="Ulangi kode sandi baru">
            <input type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setMessage(null) }} required className={inputClass} />
          </Field>
        </div>
        <div className="flex items-center justify-between">
          {message ? (
            <span className={`flex items-center gap-1.5 text-sm font-medium ${message.ok ? 'text-good-500' : 'text-red-600'}`}>
              {message.ok && <CheckCircle2 size={15} />} {message.text}
            </span>
          ) : (
            <span />
          )}
          <button type="submit" className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            Ubah kode sandi
          </button>
        </div>
      </form>
    </Card>
  )
}

function FontSizeCard() {
  const { fontScale, setFontScale } = useApp()

  return (
    <Card>
      <SectionTitle>Ukuran Font</SectionTitle>
      <div className="flex gap-1 rounded-lg border border-ink-200 bg-ink-50 p-1">
        {FONT_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setFontScale(o.value)}
            className={`flex-1 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              fontScale === o.value ? 'bg-brand-500 text-white' : 'text-ink-500 hover:bg-ink-100'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-600">
        &ldquo;Siapa setia dalam perkara-perkara kecil, ia setia juga dalam perkara-perkara besar.&rdquo; — Lukas 16:10
      </p>
      <p className="mt-1 text-xs text-ink-400">Berlaku di seluruh halaman dan tersimpan di perangkat ini.</p>
    </Card>
  )
}

export default function Pengaturan() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/profil" className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
          <ChevronLeft size={16} /> Profil
        </Link>
        <h1 className="text-2xl font-semibold text-ink-900">Pengaturan</h1>
        <p className="mt-1 text-sm text-ink-500">Ubah profil, kode sandi, dan ukuran font.</p>
      </div>
      <ProfileForm />
      <PasswordForm />
      <FontSizeCard />
    </div>
  )
}

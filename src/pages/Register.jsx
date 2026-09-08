import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

const inputClass = 'w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400'

export default function Register() {
  const { registerUser } = useApp()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const result = registerUser({ name, phone })
    if (result.ok) {
      setSubmitted(true)
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-500 text-white">
            <Users size={22} />
          </span>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Shema</p>
          <h1 className="text-xl font-semibold text-ink-900">Daftar Akun Baru</h1>
          <p className="text-sm text-ink-500">Isi data singkat ini untuk mulai bergabung di GKI Gejayan.</p>
        </div>

        <div className="rounded-lg border border-ink-200 bg-white p-5">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-good-100 text-good-500">
                <CheckCircle2 size={24} />
              </span>
              <p className="font-medium text-ink-900">Pendaftaran terkirim</p>
              <p className="text-sm text-ink-500">
                Admin akan meninjau dan menempatkanmu di salah satu Care Group. Kamu akan dihubungi lewat
                Nomor WA yang kamu daftarkan begitu akun dan kata sandimu siap.
              </p>
              <Link to="/login" className="mt-1 text-sm font-medium text-brand-600">Kembali ke halaman masuk</Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-500">Nama Lengkap</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Nama sesuai KTP"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-500">Nomor WA</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="0812-3456-7890"
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-ink-400">
                    Admin akan menghubungi nomor ini untuk mengaktifkan akunmu.
                  </p>
                </div>
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button
                  type="submit"
                  className="mt-1 rounded-md bg-brand-500 py-2 text-sm font-medium text-white hover:bg-brand-600"
                >
                  Daftar
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-ink-500">
                Sudah punya akun?{' '}
                <Link to="/login" className="font-medium text-brand-600">Masuk</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

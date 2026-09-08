import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { demoUsers, roleLabels, journeyStages } from '../data/mockData'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const from = location.state?.from?.pathname || '/'

  function handleSubmit(e) {
    e.preventDefault()
    if (login(phone, password)) {
      navigate(from, { replace: true })
    } else {
      setError('Nomor WA atau kata sandi salah.')
    }
  }

  function loginAsDemo(demoPhone) {
    login(demoPhone, 'demo123')
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-500 text-white">
            <Users size={22} />
          </span>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Shema</p>
          <h1 className="text-xl font-semibold text-ink-900">GKI Gejayan</h1>
        </div>

        <div className="rounded-lg border border-ink-200 bg-white p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Nomor WA</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="0812-3456-7890"
                className="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Kata Sandi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="demo123"
                className="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              className="mt-1 rounded-md bg-brand-500 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Masuk
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-ink-500">
            Baru pertama kali di sini?{' '}
            <Link to="/register" className="font-medium text-brand-600">Daftar akun</Link>
          </p>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-center text-xs text-ink-400">Mode demo — coba tampilan sesuai peran</p>
          <div className="flex flex-col gap-2">
            {demoUsers.map((u) => {
              const stageLabel = journeyStages.find((s) => s.id === u.journeyStageId)?.label
              return (
                <button
                  key={u.id}
                  onClick={() => loginAsDemo(u.phone)}
                  className="flex items-center justify-between rounded-md border border-ink-200 bg-white px-3.5 py-2.5 text-sm hover:bg-ink-100"
                >
                  <span className="font-medium text-ink-800">{u.name}</span>
                  <span className="text-right text-xs text-ink-400">
                    <span className="block">{roleLabels[u.role]}</span>
                    {stageLabel && <span className="block text-ink-300">{stageLabel}</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

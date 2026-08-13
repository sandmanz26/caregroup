import { useState } from 'react'
import { HandHeart, Plus, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, Badge } from '../components/ui'
import { prayerCategories } from '../data/mockData'
import { formatShortDate } from '../utils/date'

export default function Doa() {
  const { prayers, addPrayer, prayFor, prayedIds } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState(prayerCategories[0])
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    addPrayer({ name, text, category })
    setName('')
    setText('')
    setCategory(prayerCategories[0])
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Pokok Doa</h1>
          <p className="mt-1 text-sm text-ink-400">Saling mendoakan sebagai satu Care Group</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-brand-500 px-3.5 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Tutup' : 'Tambah'}
        </button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Nama (opsional)</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonim"
                className="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              >
                {prayerCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Pokok doa</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={3}
                placeholder="Tuliskan pokok doamu..."
                className="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
            </div>
            <button
              type="submit"
              className="self-end rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Kirim
            </button>
          </form>
        </Card>
      )}

      <ul className="flex flex-col gap-3">
        {prayers.map((p) => {
          const prayed = prayedIds.includes(p.id)
          return (
            <li key={p.id}>
              <Card>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink-900">{p.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge color="ink">{p.category}</Badge>
                    <span className="text-xs text-ink-400">{formatShortDate(p.date)}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-ink-600">{p.text}</p>
                <button
                  onClick={() => prayFor(p.id)}
                  aria-pressed={prayed}
                  className={`mt-3 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    prayed
                      ? 'border-good-500 bg-good-100 text-good-500 cursor-default'
                      : 'border-ink-200 text-ink-600 hover:bg-ink-100'
                  }`}
                >
                  <HandHeart size={14} />
                  {prayed ? 'Sudah didoakan' : 'Doakan'} &middot; {p.prayedCount}
                </button>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

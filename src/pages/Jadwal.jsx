import { useState } from 'react'
import { Clock, MapPin } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, Badge } from '../components/ui'
import { eventCategories } from '../data/mockData'
import { formatLongDate } from '../utils/date'

const categoryColor = {
  Ibadah: 'brand',
  'Care Group': 'good',
  Coaching: 'warn',
  Training: 'ink',
  'Acara Khusus': 'brand',
}

export default function Jadwal() {
  const { events } = useApp()
  const [filter, setFilter] = useState('Semua')

  const filtered = filter === 'Semua' ? events : events.filter((e) => e.category === filter)

  const grouped = filtered.reduce((acc, e) => {
    ;(acc[e.date] ||= []).push(e)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Jadwal</h1>
        <p className="mt-1 text-sm text-ink-400">Agenda pelayanan &amp; Care Group GKI Gejayan</p>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {eventCategories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === c
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-100'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <p className="mb-2 text-sm font-medium text-ink-500">{formatLongDate(date)}</p>
            <div className="flex flex-col gap-2">
              {items.map((e) => (
                <Card key={e.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink-900">{e.title}</p>
                      <div className="mt-1.5 flex flex-wrap gap-3 text-sm text-ink-500">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-ink-400" /> {e.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-ink-400" /> {e.location}
                        </span>
                      </div>
                      {e.note && <p className="mt-1 text-xs text-ink-400">{e.note}</p>}
                    </div>
                    <Badge color={categoryColor[e.category] || 'ink'}>{e.category}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-400">Belum ada agenda untuk kategori ini.</p>
        )}
      </div>
    </div>
  )
}

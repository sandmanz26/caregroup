import { Check } from 'lucide-react'
import { journeyStages } from '../data/mockData'

export default function JourneyStepper({ currentStageId, compact = false }) {
  const currentIndex = journeyStages.findIndex((s) => s.id === currentStageId)

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-thin">
      {journeyStages.map((stage, i) => {
        const done = i < currentIndex
        const active = i === currentIndex
        return (
          <div key={stage.id} className="flex min-w-[86px] flex-1 flex-col items-center gap-1.5 text-center">
            <div
              className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                done
                  ? 'bg-good-500 text-white'
                  : active
                  ? 'bg-brand-500 text-white'
                  : 'bg-ink-200 text-ink-500'
              }`}
            >
              {done ? <Check size={14} /> : i + 1}
            </div>
            {!compact && (
              <span className={`text-[11px] leading-tight ${active ? 'font-medium text-ink-900' : 'text-ink-400'}`}>
                {stage.label}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

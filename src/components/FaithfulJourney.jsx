import { useState } from 'react'
import BottomSheet from './BottomSheet'
import { Badge } from './ui'
import { windowLabel } from './TierProgress'
import { useJourneyProgress } from './useJourneyProgress'
import {
  faithfulJourneys,
  readingTiers,
  cgGrowthTiers,
  invitationTiers,
  roleProgressionStages,
  tierColorToBadge,
} from '../data/mockData'

const TIERS = { rooted: readingTiers, branching: invitationTiers, growing: cgGrowthTiers }
const UNIT = { rooted: 'hari', branching: 'orang', growing: 'kali hadir' }

function TierList({ tiers, stats, unit }) {
  return (
    <ul className="flex flex-col gap-2">
      {[...tiers].reverse().map((tier) => {
        const achieved = stats.currentTier && tiers.indexOf(tier) >= tiers.indexOf(stats.currentTier)
        return (
          <li key={tier.id} className="flex items-center justify-between gap-2">
            <span className={`text-sm ${achieved ? 'font-medium text-ink-900' : 'text-ink-400'}`}>{tier.label}</span>
            <span className="flex items-center gap-2">
              <span className="text-xs text-ink-400">{tier.threshold} {unit} / {windowLabel(tier.windowDays)}</span>
              <Badge color={achieved ? tierColorToBadge[tier.color] : 'ink'}>{achieved ? 'Tercapai' : '-'}</Badge>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function JourneyDetail({ journey, progress }) {
  const p = progress[journey.id]
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <img src={`/journey/${journey.id}.svg`} alt={journey.en} className="size-24 shrink-0 rounded-2xl" />
        <div>
          <p className="font-medium text-ink-900">{journey.en}</p>
          <p className="text-sm text-ink-500">Kesan: {journey.kesan}</p>
          <p className="mt-1 text-sm font-medium text-brand-600">{p.meta}</p>
        </div>
      </div>
      <p className="text-sm text-ink-600">{journey.source}</p>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Tangga perjalanan</p>
        {journey.id === 'fruitful' ? (
          <ul className="flex flex-col gap-2">
            {roleProgressionStages.map((s, i) => (
              <li key={s.id} className="flex items-center justify-between gap-2">
                <span className={`text-sm ${i <= p.stageIndex ? 'font-medium text-ink-900' : 'text-ink-400'}`}>{s.label}</span>
                <Badge color={i < p.stageIndex ? 'good' : i === p.stageIndex ? 'brand' : 'ink'}>
                  {i < p.stageIndex ? 'Terlewati' : i === p.stageIndex ? 'Sekarang' : '-'}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <TierList tiers={TIERS[journey.id]} stats={p.stats} unit={UNIT[journey.id]} />
        )}
      </div>
    </div>
  )
}

// Empat kartu bergambar. Mengetuk kartu membuka penjelasan lengkap + tangga perjalanannya.
export default function FaithfulJourneyGrid() {
  const progress = useJourneyProgress()
  const [openId, setOpenId] = useState(null)
  const open = faithfulJourneys.find((j) => j.id === openId)

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {faithfulJourneys.map((j) => (
          <button
            key={j.id}
            type="button"
            onClick={() => setOpenId(j.id)}
            className="rounded-lg border border-ink-200 bg-white p-2.5 text-center hover:bg-ink-50"
          >
            <img src={`/journey/${j.id}.svg`} alt={j.en} className="mb-2 aspect-square w-full rounded-xl" />
            <p className="text-sm font-medium text-ink-900">{j.emoji} {j.name.replace('Perjalanan ', '')}</p>
            <p className="text-[11px] italic text-ink-400">{j.en}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-200">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${progress[j.id].pct}%` }} />
            </div>
            <p className="mt-1.5 text-[11px] leading-tight text-ink-500">{progress[j.id].meta}</p>
          </button>
        ))}
      </div>

      <BottomSheet open={!!open} onClose={() => setOpenId(null)} title={open ? `${open.emoji} ${open.name}` : ''}>
        {open && <JourneyDetail journey={open} progress={progress} />}
      </BottomSheet>
    </>
  )
}

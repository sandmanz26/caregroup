import { Card, SectionTitle, Badge } from './ui'
import { tierColorToBadge } from '../data/mockData'

export function windowLabel(days) {
  if (days === 30) return 'sebulan'
  if (days === 90) return '3 bulan'
  if (days === 180) return '6 bulan'
  if (days === 365) return '1 tahun'
  if (days === 1095) return '3 tahun'
  return `${days} hari`
}

export function TierStatusCard({ icon: Icon, total, unitLabel, caption, stats, tierUnit = '' }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <Icon size={22} />
        </span>
        <div>
          <p className="text-2xl font-semibold text-ink-900">
            {total} <span className="text-sm font-normal text-ink-400">{unitLabel}</span>
          </p>
          <p className="text-sm text-ink-500">{caption}</p>
        </div>
      </div>

      {stats.currentTier && (
        <div className="mt-3 flex items-center gap-2 border-t border-ink-100 pt-3">
          <Badge color={tierColorToBadge[stats.currentTier.color]}>{stats.currentTier.label}</Badge>
          <span className="text-xs text-ink-400">Status saat ini</span>
        </div>
      )}

      {stats.nextTier && (
        <p className="mt-2 text-xs text-ink-400">
          {stats.nextTierCount} dari {stats.nextTier.threshold}{tierUnit} dalam {windowLabel(stats.nextTier.windowDays)} menuju{' '}
          <span className="font-medium text-ink-600">{stats.nextTier.label}</span>
        </p>
      )}
    </Card>
  )
}

export function TierLadderCard({ title, tiers, stats, unit = '' }) {
  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>
      <ul className="flex flex-col gap-2">
        {[...tiers].reverse().map((tier) => {
          const achieved = stats.currentTier && tiers.indexOf(tier) >= tiers.indexOf(stats.currentTier)
          return (
            <li key={tier.id} className="flex items-center justify-between gap-2">
              <span className={`text-sm ${achieved ? 'font-medium text-ink-900' : 'text-ink-400'}`}>{tier.label}</span>
              <span className="flex items-center gap-2">
                <span className="text-xs text-ink-400">{tier.threshold}{unit} / {windowLabel(tier.windowDays)}</span>
                <Badge color={achieved ? tierColorToBadge[tier.color] : 'ink'}>{achieved ? 'Tercapai' : '-'}</Badge>
              </span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

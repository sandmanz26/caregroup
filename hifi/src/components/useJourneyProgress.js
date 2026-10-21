import { useApp } from '../context/AppContext'
import { cgGrowthTiers, invitationTiers, roleProgressionStages, cgRoleToStageId } from '../data/mockData'
import { computeReadingStats } from '../utils/reading'
import { computeTierStats } from '../utils/tiers'

const UNIT = { rooted: 'hari', branching: 'orang', growing: 'kali hadir' }

// Hitung progres keempat perjalanan untuk pengguna yang sedang masuk.
// Tingkat (ambang & jendela waktu) memakai tangga lama; yang baru hanyalah istilah, gambar, dan Berbuah.
export function useJourneyProgress() {
  const { user, myCareGroup, bibleReadingCheckins, invitations } = useApp()

  const reading = computeReadingStats(bibleReadingCheckins, user.id)
  const attended = myCareGroup && user.memberId
    ? myCareGroup.meetings.filter((m) => m.attendance[user.memberId]).map((m) => m.date)
    : []
  const growing = computeTierStats(attended, cgGrowthTiers)
  const branching = computeTierStats(
    invitations.filter((i) => i.memberId === user.memberId).map((i) => i.date),
    invitationTiers
  )
  const myRole = myCareGroup?.members.find((m) => m.id === user.memberId)?.role
  const stageIndex = Math.max(0, roleProgressionStages.findIndex((s) => s.id === (cgRoleToStageId[myRole] || 'member')))

  function fromTier(stats, unit) {
    const next = stats.nextTier
    const label = stats.currentTier ? stats.currentTier.label : 'Belum dimulai'
    const pct = next ? Math.min(100, Math.round((stats.nextTierCount / next.threshold) * 100)) : 100
    const meta = next ? `${label} · ${stats.nextTierCount}/${next.threshold} ${unit}` : `${label} ✓`
    return { stats, pct, meta, total: stats.totalAllTime }
  }

  return {
    rooted: fromTier(reading, UNIT.rooted),
    branching: fromTier(branching, UNIT.branching),
    growing: fromTier(growing, UNIT.growing),
    fruitful: {
      stageIndex,
      pct: Math.round((stageIndex / (roleProgressionStages.length - 1)) * 100),
      meta: `Tahap ${stageIndex + 1} dari ${roleProgressionStages.length} · ${roleProgressionStages[stageIndex].label}`,
    },
  }
}


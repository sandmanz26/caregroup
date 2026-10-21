import { shiftDate, TODAY } from './date'

// Generic rolling-window achievement ladder: tiers must be ordered strongest-first.
// A member holds the strongest tier whose window-count meets its threshold.
export function computeTierStats(dates, tiers, todayStr = TODAY) {
  const dateSet = new Set(dates)
  const totalAllTime = dates.length

  function countInWindow(days) {
    let count = 0
    for (let i = 0; i < days; i++) {
      if (dateSet.has(shiftDate(todayStr, -i))) count++
    }
    return count
  }

  let currentTier = null
  let currentIndex = -1
  for (let i = 0; i < tiers.length; i++) {
    if (countInWindow(tiers[i].windowDays) >= tiers[i].threshold) {
      currentTier = tiers[i]
      currentIndex = i
      break
    }
  }

  const nextTier = currentIndex > 0 ? tiers[currentIndex - 1] : currentIndex === -1 ? tiers[tiers.length - 1] : null
  const nextTierCount = nextTier ? countInWindow(nextTier.windowDays) : 0

  return { totalAllTime, currentTier, nextTier, nextTierCount }
}

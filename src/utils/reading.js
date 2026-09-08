import { readingTiers } from '../data/mockData'
import { TODAY } from './date'
import { computeTierStats } from './tiers'

export function computeReadingStats(checkins, userId, todayStr = TODAY) {
  const mine = checkins.filter((c) => c.userId === userId)
  const dates = mine.map((c) => c.date)
  return { ...computeTierStats(dates, readingTiers, todayStr), readToday: dates.includes(todayStr) }
}

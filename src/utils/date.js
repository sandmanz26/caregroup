// Fixed "today" for this mockup — no backend clock to sync against.
export const TODAY = '2026-08-13'

export function formatLongDate(dateStr) {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(dateStr)
  )
}

export function formatShortDate(dateStr) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(dateStr))
}

export function greetingForHour(hour) {
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

function daysBetween(dateStr, todayStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  const today = new Date(`${todayStr}T00:00:00`)
  return Math.round((today - d) / 86400000)
}

// Inclusive 7-day window ending today — used for the Kehadiran tab's "last week" view.
export function isWithinLastWeek(dateStr, todayStr = TODAY) {
  const diff = daysBetween(dateStr, todayStr)
  return diff >= 0 && diff <= 6
}

// A meeting counts toward attendance stats once its day has fully passed.
export function isPastMeeting(dateStr, todayStr = TODAY) {
  return daysBetween(dateStr, todayStr) > 0
}

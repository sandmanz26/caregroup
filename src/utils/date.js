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

export function shiftDate(dateStr, offsetDays) {
  const d = new Date(`${dateStr}T00:00:00`)
  d.setDate(d.getDate() + offsetDays)
  // Build the string from local date parts, not toISOString() — that converts through UTC,
  // which silently shifts the calendar day by one in any timezone ahead of UTC (e.g. this
  // app's own Asia/Jakarta, UTC+7). Went unnoticed elsewhere because every other caller only
  // uses shiftDate for internal same-convention comparisons, where a consistent off-by-one
  // cancels out — but a date meant to be displayed to the user must be exactly right.
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
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

// Leader/admin can only fill or edit a meeting's attendance for this many days after it happens.
export const ATTENDANCE_EDIT_WINDOW_DAYS = 14

export function isAttendanceLocked(dateStr, todayStr = TODAY) {
  return daysBetween(dateStr, todayStr) > ATTENDANCE_EDIT_WINDOW_DAYS
}

export function attendanceEditDeadline(dateStr) {
  return shiftDate(dateStr, ATTENDANCE_EDIT_WINDOW_DAYS)
}

// Formats a "MM-DD" birth date as "20 Agustus" (year-agnostic).
export function formatBirthDate(mmdd) {
  const [month, day] = mmdd.split('-').map(Number)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long' }).format(new Date(2000, month - 1, day))
}

// Days remaining until the next occurrence of a "MM-DD" birthday, rolling over to next year if already passed.
export function daysUntilBirthday(mmdd, todayStr = TODAY) {
  const [month, day] = mmdd.split('-').map(Number)
  const today = new Date(`${todayStr}T00:00:00`)
  let next = new Date(today.getFullYear(), month - 1, day)
  if (next < today) next = new Date(today.getFullYear() + 1, month - 1, day)
  return Math.round((next - today) / 86400000)
}

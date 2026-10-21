import { isPastMeeting, TODAY } from './date'

// Streak = consecutive past meetings attended, counting back from the most recent.
// Breaks on the first miss; meetings that haven't happened yet don't count either way.
export function computeAttendanceStats(meetings, memberId, todayStr = TODAY) {
  const past = meetings
    .filter((m) => isPastMeeting(m.date, todayStr))
    .sort((a, b) => b.date.localeCompare(a.date))

  let streak = 0
  for (const m of past) {
    if (m.attendance[memberId]) streak++
    else break
  }

  const totalHadir = past.filter((m) => m.attendance[memberId]).length

  return { streak, totalHadir, totalPertemuan: past.length }
}

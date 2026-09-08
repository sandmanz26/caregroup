import { createContext, useContext, useEffect, useState } from 'react'
import {
  careGroupsSeed,
  demoUsers,
  eventsSeed,
  materiSeed,
  prayerSeed,
  serviceApplicationSeed,
  pelayananCheckinSeed,
  renunganHarianSeed,
  bibleReadingCheckinSeed,
  otherTrainingSeed,
  growthDatesSeed,
  invitationSeed,
  pendingRegistrationSeed,
  nextPromotionRole,
} from '../data/mockData'
import { TODAY } from '../utils/date'

const AppContext = createContext(null)

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable — ignore, state still works for this session
  }
}

function generatePassword() {
  return Math.random().toString(36).slice(-8)
}

function initialsOf(name) {
  return name.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

export function AppProvider({ children }) {
  const [authUserId, setAuthUserId] = useState(() => loadJSON('cg_auth_user_id', null))
  const [registeredUsers, setRegisteredUsers] = useState(() => loadJSON('cg_registered_users', []))
  const [careGroups, setCareGroups] = useState(() => loadJSON('cg_care_groups', careGroupsSeed))
  const [materi, setMateri] = useState(() => loadJSON('cg_materi', materiSeed))
  const [events, setEvents] = useState(() => loadJSON('cg_events', eventsSeed))
  const [prayers, setPrayers] = useState(() => loadJSON('cg_prayers', prayerSeed))
  const [prayedIds, setPrayedIds] = useState(() => loadJSON('cg_prayed_ids', []))
  const [serviceApplications, setServiceApplications] = useState(() =>
    loadJSON('cg_service_applications', serviceApplicationSeed)
  )
  const [pelayananCheckins, setPelayananCheckins] = useState(() =>
    loadJSON('cg_pelayanan_checkins', pelayananCheckinSeed)
  )
  const [renunganList, setRenunganList] = useState(() => loadJSON('cg_renungan', renunganHarianSeed))
  const [renunganLikedIds, setRenunganLikedIds] = useState(() => loadJSON('cg_renungan_liked_ids', {}))
  const [bibleReadingCheckins, setBibleReadingCheckins] = useState(() =>
    loadJSON('cg_bible_reading_checkins', bibleReadingCheckinSeed)
  )
  const [growthDates, setGrowthDates] = useState(() => loadJSON('cg_growth_dates', growthDatesSeed))
  const [otherTrainings, setOtherTrainings] = useState(() => loadJSON('cg_other_trainings', otherTrainingSeed))
  const [invitations, setInvitations] = useState(() => loadJSON('cg_invitations', invitationSeed))
  const [pendingRegistrations, setPendingRegistrations] = useState(() =>
    loadJSON('cg_pending_registrations', pendingRegistrationSeed)
  )

  useEffect(() => saveJSON('cg_pending_registrations', pendingRegistrations), [pendingRegistrations])
  useEffect(() => saveJSON('cg_invitations', invitations), [invitations])
  useEffect(() => saveJSON('cg_auth_user_id', authUserId), [authUserId])
  useEffect(() => saveJSON('cg_registered_users', registeredUsers), [registeredUsers])
  useEffect(() => saveJSON('cg_care_groups', careGroups), [careGroups])
  useEffect(() => saveJSON('cg_materi', materi), [materi])
  useEffect(() => saveJSON('cg_renungan', renunganList), [renunganList])
  useEffect(() => saveJSON('cg_renungan_liked_ids', renunganLikedIds), [renunganLikedIds])
  useEffect(() => saveJSON('cg_bible_reading_checkins', bibleReadingCheckins), [bibleReadingCheckins])
  useEffect(() => saveJSON('cg_growth_dates', growthDates), [growthDates])
  useEffect(() => saveJSON('cg_other_trainings', otherTrainings), [otherTrainings])
  useEffect(() => saveJSON('cg_events', events), [events])
  useEffect(() => saveJSON('cg_prayers', prayers), [prayers])
  useEffect(() => saveJSON('cg_prayed_ids', prayedIds), [prayedIds])
  useEffect(() => saveJSON('cg_service_applications', serviceApplications), [serviceApplications])
  useEffect(() => saveJSON('cg_pelayanan_checkins', pelayananCheckins), [pelayananCheckins])

  const allUsers = [...demoUsers, ...registeredUsers]
  const authUser = allUsers.find((u) => u.id === authUserId) || null
  const user = authUser
    ? {
        id: authUser.id,
        name: authUser.name,
        initials: authUser.initials,
        phone: authUser.phone,
        role: authUser.role,
        journeyStageId: authUser.journeyStageId,
        careGroupId: authUser.careGroupId,
        memberId: authUser.memberId,
      }
    : null

  const myCareGroup = careGroups.find((g) => g.id === user?.careGroupId) || null
  const myCoachedGroups = user?.role === 'coach' ? careGroups.filter((g) => g.coachId === user.id) : []

  function login(phone, password) {
    const match = allUsers.find((u) => u.phone === phone && u.password === password)
    if (!match) return false
    setAuthUserId(match.id)
    return true
  }

  function logout() {
    setAuthUserId(null)
  }

  // Self-registration no longer creates an active account — it queues a pending
  // request. An admin approves it (assigning a Care Group), which is when a
  // password gets generated and the account actually starts existing.
  function registerUser({ name, phone }) {
    const cleanPhone = phone.trim()
    if (allUsers.some((u) => u.phone === cleanPhone)) {
      return { ok: false, error: 'Nomor WA ini sudah terdaftar. Silakan masuk.' }
    }
    if (pendingRegistrations.some((p) => p.phone === cleanPhone)) {
      return { ok: false, error: 'Nomor WA ini sudah mengajukan pendaftaran. Mohon tunggu persetujuan admin.' }
    }
    const entry = { id: `pend${Date.now()}`, name: name.trim(), phone: cleanPhone, date: TODAY }
    setPendingRegistrations((prev) => [...prev, entry])
    return { ok: true, pending: true }
  }

  // Creates a fully active account with a generated password. Every jemaat
  // account is placed into a Care Group immediately — there is no more
  // "registered but unplaced" state.
  function createUser({ name, phone, role = 'jemaat', careGroupId = null }) {
    const cleanPhone = phone.trim()
    if (allUsers.some((u) => u.phone === cleanPhone)) {
      return { ok: false, error: 'Nomor WA ini sudah terdaftar.' }
    }
    if (role === 'jemaat' && !careGroupId) {
      return { ok: false, error: 'Anggota harus ditempatkan ke sebuah Care Group.' }
    }
    const password = generatePassword()
    const userId = `u${Date.now()}`
    const initials = initialsOf(name)
    let memberId = null

    if (role === 'jemaat' && careGroupId) {
      memberId = `m${Date.now()}`
      setCareGroups((prev) =>
        prev.map((g) =>
          g.id !== careGroupId
            ? g
            : { ...g, members: [...g.members, { id: memberId, name: name.trim(), initials, role: 'Anggota Baru', phone: cleanPhone }] }
        )
      )
    }

    const newUser = {
      id: userId,
      name: name.trim(),
      initials,
      phone: cleanPhone,
      password,
      role,
      journeyStageId: role === 'jemaat' ? 'newcomer' : role === 'admin' ? 'leader' : 'coach',
      careGroupId: memberId ? careGroupId : null,
      memberId,
    }
    setRegisteredUsers((prev) => [...prev, newUser])
    return { ok: true, password, userId }
  }

  function approvePendingRegistration(pendingId, careGroupId) {
    const pending = pendingRegistrations.find((p) => p.id === pendingId)
    if (!pending) return { ok: false, error: 'Pendaftaran tidak ditemukan.' }
    if (!careGroupId) return { ok: false, error: 'Pilih Care Group untuk menempatkan peserta ini.' }
    const result = createUser({ name: pending.name, phone: pending.phone, role: 'jemaat', careGroupId })
    if (result.ok) {
      setPendingRegistrations((prev) => prev.filter((p) => p.id !== pendingId))
    }
    return result
  }

  function rejectPendingRegistration(pendingId) {
    setPendingRegistrations((prev) => prev.filter((p) => p.id !== pendingId))
  }

  function checkInPelayanan({ roleName, note, date }) {
    const entry = {
      id: `pc${Date.now()}`,
      memberId: user?.memberId,
      memberName: user?.name,
      careGroupId: user?.careGroupId,
      careGroupName: myCareGroup?.name ?? '-',
      roleName,
      date: date || TODAY,
      note: note?.trim(),
    }
    setPelayananCheckins((prev) => [entry, ...prev])
  }

  function markSaatTeduhDone() {
    if (!user) return
    const alreadyToday = bibleReadingCheckins.some((c) => c.userId === user.id && c.date === TODAY)
    if (alreadyToday) return
    setBibleReadingCheckins((prev) => [...prev, { id: `br${Date.now()}`, userId: user.id, date: TODAY }])
  }

  function toggleRenunganLike(renunganId) {
    if (!user) return
    const likedHere = renunganLikedIds[user.id] || []
    const alreadyLiked = likedHere.includes(renunganId)
    setRenunganList((prev) =>
      prev.map((r) => (r.id === renunganId ? { ...r, likes: r.likes + (alreadyLiked ? -1 : 1) } : r))
    )
    setRenunganLikedIds((prev) => ({
      ...prev,
      [user.id]: alreadyLiked ? likedHere.filter((id) => id !== renunganId) : [...likedHere, renunganId],
    }))
  }

  function addRenunganComment(renunganId, text) {
    if (!user || !text.trim()) return
    const item = renunganList.find((r) => r.id === renunganId)
    if (item?.comments.some((c) => c.userId === user.id)) return // one comment per person
    const comment = { id: `c${Date.now()}`, userId: user.id, memberName: user.name, text: text.trim(), date: TODAY }
    setRenunganList((prev) =>
      prev.map((r) => (r.id === renunganId ? { ...r, comments: [...r.comments, comment] } : r))
    )
  }

  function setGrowthDate(milestoneId, date) {
    if (!user) return
    setGrowthDates((prev) => ({
      ...prev,
      [user.id]: { ...prev[user.id], [milestoneId]: date || null },
    }))
  }

  function addOtherTraining({ name, date }) {
    if (!user || !name.trim()) return
    const entry = { id: `ot${Date.now()}`, name: name.trim(), date }
    setOtherTrainings((prev) => ({
      ...prev,
      [user.id]: [...(prev[user.id] || []), entry],
    }))
  }

  function removeOtherTraining(id) {
    if (!user) return
    setOtherTrainings((prev) => ({
      ...prev,
      [user.id]: (prev[user.id] || []).filter((t) => t.id !== id),
    }))
  }

  function addInvitation(invitedName) {
    if (!user?.memberId || !invitedName.trim()) return
    const entry = {
      id: `inv${Date.now()}`,
      memberId: user.memberId,
      careGroupId: user.careGroupId,
      invitedName: invitedName.trim(),
      date: TODAY,
    }
    setInvitations((prev) => [entry, ...prev])
  }

  function addPrayer({ name, text, category }) {
    const entry = {
      id: `p${Date.now()}`,
      name: name?.trim() || 'Anonim',
      text: text.trim(),
      category,
      prayedCount: 0,
      date: new Date().toISOString().slice(0, 10),
    }
    setPrayers((prev) => [entry, ...prev])
  }

  function prayFor(id) {
    if (prayedIds.includes(id)) return
    setPrayers((prev) => prev.map((p) => (p.id === id ? { ...p, prayedCount: p.prayedCount + 1 } : p)))
    setPrayedIds((prev) => [...prev, id])
  }

  function submitServiceApplication({ roleId, roleName, reason, availability }) {
    const entry = {
      id: `sa${Date.now()}`,
      memberId: user?.memberId,
      memberName: user?.name,
      careGroupId: user?.careGroupId,
      careGroupName: myCareGroup?.name ?? '-',
      roleId,
      roleName,
      reason: reason.trim(),
      availability: availability.trim(),
      date: TODAY,
      reviewed: false,
    }
    setServiceApplications((prev) => [entry, ...prev])
  }

  function toggleApplicationReviewed(id) {
    setServiceApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, reviewed: !a.reviewed } : a))
    )
  }

  function toggleAttendance(groupId, meetingId, memberId) {
    setCareGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              meetings: g.meetings.map((m) =>
                m.id === meetingId
                  ? { ...m, attendance: { ...m.attendance, [memberId]: !m.attendance[memberId] } }
                  : m
              ),
            }
      )
    )
  }

  // Optional reason for a "Tidak hadir" mark (e.g. "Sakit", "Izin") — kept separate from the
  // attendance boolean itself so toggling presence never wipes a previously-recorded reason.
  function setAttendanceNote(groupId, meetingId, memberId, note) {
    setCareGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              meetings: g.meetings.map((m) =>
                m.id === meetingId
                  ? { ...m, attendanceNotes: { ...m.attendanceNotes, [memberId]: note } }
                  : m
              ),
            }
      )
    )
  }

  function addMemberToGroup(groupId, { name, phone, address, university, birthDate }) {
    const id = `m${Date.now()}`
    setCareGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              members: [
                ...g.members,
                {
                  id,
                  name: name.trim(),
                  phone: phone?.trim(),
                  address: address?.trim(),
                  university: university?.trim(),
                  birthDate: birthDate?.trim() || null,
                  initials: name.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase(),
                  role: 'Anggota Baru',
                },
              ],
            }
      )
    )
  }

  function moveMember(memberId, fromGroupId, toGroupId) {
    if (fromGroupId === toGroupId) return
    setCareGroups((prev) => {
      const fromGroup = prev.find((g) => g.id === fromGroupId)
      const member = fromGroup?.members.find((m) => m.id === memberId)
      if (!member) return prev
      return prev.map((g) => {
        if (g.id === fromGroupId) {
          return {
            ...g,
            leaderId: g.leaderId === memberId ? null : g.leaderId,
            leaderName: g.leaderId === memberId ? 'Belum ditentukan' : g.leaderName,
            members: g.members.filter((m) => m.id !== memberId),
          }
        }
        if (g.id === toGroupId) {
          return { ...g, members: [...g.members, { ...member, role: 'Anggota' }] }
        }
        return g
      })
    })
  }

  function addMeetingToGroup(groupId, { date, topic, description }) {
    const id = `mt${Date.now()}`
    setCareGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId
          ? g
          : { ...g, meetings: [...g.meetings, { id, date, topic, description: description?.trim() || '', attendance: {} }] }
      )
    )
    const group = careGroups.find((g) => g.id === groupId)
    if (group) {
      addEvent({
        date,
        time: group.meetingTime,
        title: `Pertemuan ${group.name}`,
        category: 'Care Group',
        location: group.meetingLocation,
      })
    }
  }

  // Edits an existing meeting's own fields (date/topic/description) — gated in the UI to
  // meetings that haven't happened yet (isPastMeeting), unrelated to the 14-day attendance lock,
  // which is about editing *who attended*, not the meeting's own agenda details.
  function updateMeeting(groupId, meetingId, { date, topic, description }) {
    setCareGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              meetings: g.meetings.map((m) =>
                m.id === meetingId ? { ...m, date, topic, description: description?.trim() || '' } : m
              ),
            }
      )
    )
  }

  // One-step promotion (Anggota -> Pengurus CG -> Calon Leader -> Kandidat Leader), enforced in
  // that exact order — a member can't be pushed past the stage right after their current one.
  // Reaching "Kandidat Leader" grants real Ketua Komsel access to this same Care Group (a
  // co-leader), not just a status label: if the member has no login account yet, one is created
  // here (needs a phone number already on file); if they already have a jemaat account, it's
  // upgraded to admin in place.
  function promoteMember(groupId, memberId) {
    const group = careGroups.find((g) => g.id === groupId)
    const member = group?.members.find((m) => m.id === memberId)
    if (!member) return { ok: false, error: 'Anggota tidak ditemukan.' }

    const nextRole = nextPromotionRole(member.role)
    if (!nextRole) {
      return { ok: false, error: `${member.name} sudah berada di tahap tertinggi yang bisa dinaikkan lewat panel ini.` }
    }

    let grant = null
    if (nextRole === 'Kandidat Leader') {
      const existingAccount = allUsers.find((u) => u.memberId === memberId)
      if (existingAccount) {
        if (existingAccount.role !== 'admin' && existingAccount.role !== 'super_admin') {
          if (demoUsers.some((u) => u.id === existingAccount.id)) {
            return { ok: false, error: 'Akun demo bawaan tidak bisa diubah otomatis lewat sini.' }
          }
          setRegisteredUsers((prev) =>
            prev.map((u) => (u.id === existingAccount.id ? { ...u, role: 'admin', careGroupId: groupId, journeyStageId: 'leader' } : u))
          )
        }
        grant = { alreadyHadAccount: true, password: null }
      } else {
        if (!member.phone) {
          return { ok: false, error: 'Isi dulu Nomor HP anggota ini (di tab Peserta Komsel) sebelum menaikkan ke Kandidat Leader — dipakai untuk akun login barunya.' }
        }
        if (allUsers.some((u) => u.phone === member.phone)) {
          return { ok: false, error: 'Nomor HP anggota ini sudah dipakai akun lain. Perbarui datanya dulu.' }
        }
        const password = generatePassword()
        const newUser = {
          id: `u${Date.now()}`,
          name: member.name,
          initials: member.initials,
          phone: member.phone,
          password,
          role: 'admin',
          journeyStageId: 'leader',
          careGroupId: groupId,
          memberId: member.id,
        }
        setRegisteredUsers((prev) => [...prev, newUser])
        grant = { alreadyHadAccount: false, password }
      }
    }

    setCareGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId ? g : { ...g, members: g.members.map((m) => (m.id === memberId ? { ...m, role: nextRole } : m)) }
      )
    )

    return { ok: true, newRole: nextRole, grant }
  }

  // A single editable free-text field on the CG's own profile (like a bio) — not a feed of
  // posts. Overwrites whatever was there before, same as editing any other profile field.
  function setCgDescription(groupId, description) {
    setCareGroups((prev) =>
      prev.map((g) => (g.id !== groupId ? g : { ...g, description: description.trim() }))
    )
  }

  function addCareGroup({ name, category, leaderName, meetingDay, meetingTime, meetingLocation, frequency }) {
    const id = `cg${Date.now()}`
    const leaderId = `m${Date.now()}`
    setCareGroups((prev) => [
      ...prev,
      {
        id,
        name,
        category,
        leaderId,
        leaderName,
        meetingDay,
        meetingTime,
        meetingLocation,
        frequency,
        members: [
          {
            id: leaderId,
            name: leaderName,
            initials: leaderName.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase(),
            role: 'Leader',
          },
        ],
        meetings: [],
      },
    ])
  }

  function setCareGroupLeader(groupId, memberId) {
    setCareGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g
        const newLeader = g.members.find((m) => m.id === memberId)
        if (!newLeader) return g
        return {
          ...g,
          leaderId: newLeader.id,
          leaderName: newLeader.name,
          members: g.members.map((m) =>
            m.id === memberId
              ? { ...m, role: 'Leader' }
              : m.role === 'Leader'
              ? { ...m, role: 'Anggota' }
              : m
          ),
        }
      })
    )
  }

  // Assigns which Coach oversees a Care Group — one Coach per CG, mirroring how
  // setCareGroupLeader assigns the single Leader. coachUserId is a login account id
  // (role 'coach'), not a CG member — a Coach isn't a member of the groups they oversee.
  function setCareGroupCoach(groupId, coachUserId) {
    const coach = allUsers.find((u) => u.id === coachUserId)
    setCareGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId ? g : { ...g, coachId: coachUserId || null, coachName: coach ? coach.name : 'Belum ditentukan' }
      )
    )
  }

  function addMateri({ week, title, verse, summary, questions }) {
    const entry = {
      id: `mat${Date.now()}`,
      week,
      title,
      verse,
      summary,
      questions: questions.split('\n').map((q) => q.trim()).filter(Boolean),
    }
    setMateri((prev) => [entry, ...prev])
  }

  function addEvent({ date, time, title, category, location, note }) {
    const entry = { id: `e${Date.now()}`, date, time, title, category, location, note }
    setEvents((prev) =>
      [...prev, entry].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    )
  }

  return (
    <AppContext.Provider
      value={{
        authUser,
        user,
        login,
        logout,
        registerUser,
        createUser,
        allUsers,
        pendingRegistrations,
        approvePendingRegistration,
        rejectPendingRegistration,
        careGroups,
        myCareGroup,
        myCoachedGroups,
        materi,
        events,
        prayers,
        prayedIds,
        addPrayer,
        prayFor,
        serviceApplications,
        submitServiceApplication,
        toggleApplicationReviewed,
        pelayananCheckins,
        checkInPelayanan,
        renunganList,
        renunganLikedIds,
        toggleRenunganLike,
        addRenunganComment,
        bibleReadingCheckins,
        markSaatTeduhDone,
        growthDates,
        setGrowthDate,
        otherTrainings,
        addOtherTraining,
        removeOtherTraining,
        invitations,
        addInvitation,
        toggleAttendance,
        setAttendanceNote,
        addMemberToGroup,
        addMeetingToGroup,
        updateMeeting,
        promoteMember,
        setCgDescription,
        addCareGroup,
        setCareGroupLeader,
        setCareGroupCoach,
        moveMember,
        addMateri,
        addEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

import { createContext, useContext, useEffect, useState } from 'react'
import {
  careGroupsSeed,
  demoUsers,
  eventsSeed,
  materiSeed,
  prayerSeed,
  serviceApplicationSeed,
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

export function AppProvider({ children }) {
  const [authUserId, setAuthUserId] = useState(() => loadJSON('cg_auth_user_id', null))
  const [careGroups, setCareGroups] = useState(() => loadJSON('cg_care_groups', careGroupsSeed))
  const [materi, setMateri] = useState(() => loadJSON('cg_materi', materiSeed))
  const [events, setEvents] = useState(() => loadJSON('cg_events', eventsSeed))
  const [prayers, setPrayers] = useState(() => loadJSON('cg_prayers', prayerSeed))
  const [prayedIds, setPrayedIds] = useState(() => loadJSON('cg_prayed_ids', []))
  const [serviceApplications, setServiceApplications] = useState(() =>
    loadJSON('cg_service_applications', serviceApplicationSeed)
  )

  useEffect(() => saveJSON('cg_auth_user_id', authUserId), [authUserId])
  useEffect(() => saveJSON('cg_care_groups', careGroups), [careGroups])
  useEffect(() => saveJSON('cg_materi', materi), [materi])
  useEffect(() => saveJSON('cg_events', events), [events])
  useEffect(() => saveJSON('cg_prayers', prayers), [prayers])
  useEffect(() => saveJSON('cg_prayed_ids', prayedIds), [prayedIds])
  useEffect(() => saveJSON('cg_service_applications', serviceApplications), [serviceApplications])

  const authUser = demoUsers.find((u) => u.id === authUserId) || null
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

  function login(username, password) {
    const match = demoUsers.find((u) => u.username === username && u.password === password)
    if (!match) return false
    setAuthUserId(match.id)
    return true
  }

  function logout() {
    setAuthUserId(null)
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

  function addMemberToGroup(groupId, { name, phone, address, university }) {
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

  function addMeetingToGroup(groupId, { date, topic }) {
    const id = `mt${Date.now()}`
    setCareGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId ? g : { ...g, meetings: [...g.meetings, { id, date, topic, attendance: {} }] }
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
        careGroups,
        myCareGroup,
        materi,
        events,
        prayers,
        prayedIds,
        addPrayer,
        prayFor,
        serviceApplications,
        submitServiceApplication,
        toggleApplicationReviewed,
        toggleAttendance,
        addMemberToGroup,
        addMeetingToGroup,
        addCareGroup,
        setCareGroupLeader,
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

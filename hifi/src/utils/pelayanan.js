// Rekap pelayanan: dikelompokkan per bidang, jumlah anggota = orang yang berbeda (bukan jumlah presensi).
export function computeServiceRecap(checkins) {
  const byRole = new Map()
  for (const c of checkins) {
    if (!byRole.has(c.roleName)) byRole.set(c.roleName, new Map())
    const people = byRole.get(c.roleName)
    const prev = people.get(c.memberId)
    people.set(c.memberId, {
      memberId: c.memberId,
      name: c.memberName,
      careGroupName: c.careGroupName,
      count: (prev?.count || 0) + 1,
      last: prev && prev.last > c.date ? prev.last : c.date,
    })
  }
  return [...byRole.entries()]
    .map(([roleName, people]) => {
      const members = [...people.values()].sort((a, b) => a.name.localeCompare(b.name))
      return { roleName, memberCount: members.length, totalCheckins: members.reduce((s, m) => s + m.count, 0), members }
    })
    .sort((a, b) => b.memberCount - a.memberCount || a.roleName.localeCompare(b.roleName))
}

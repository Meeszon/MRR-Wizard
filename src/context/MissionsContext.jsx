import React, { createContext, useState, useMemo } from 'react'
import { mockMissions, mockCompletedMissions } from '../data/mockMissions'

export const MissionsContext = createContext(null)

export function MissionsProvider({ children }) {
  const [missions, setMissions] = useState(mockMissions)
  const [completedMissions] = useState(mockCompletedMissions)
  const [lastMissionName, setLastMissionName] = useState('')

  function addMission(mission) {
    setMissions((prev) => [{ id: Date.now().toString(), ...mission }, ...prev])
  }

  function updateMission(id, updates) {
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }

  const value = useMemo(
    () => ({
      missions,
      completedMissions,
      lastMissionName,
      setLastMissionName,
      addMission,
      updateMission,
    }),
    [missions, completedMissions, lastMissionName],
  )

  return <MissionsContext.Provider value={value}>{children}</MissionsContext.Provider>
}

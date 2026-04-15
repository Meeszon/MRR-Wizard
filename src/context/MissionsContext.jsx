import { createContext, useState, useMemo } from 'react'
import { mockMissions } from '../data/mockMissions'

export const MissionsContext = createContext(null)

export function MissionsProvider({ children }) {
  const [missions, setMissions] = useState(mockMissions)
  const [lastMissionName, setLastMissionName] = useState('')

  function addMission(mission) {
    setMissions((prev) => [{ id: Date.now().toString(), ...mission }, ...prev])
  }

  function updateMission(id, updates) {
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }

  const value = useMemo(
    () => ({ missions, lastMissionName, setLastMissionName, addMission, updateMission }),
    [missions, lastMissionName],
  )

  return <MissionsContext.Provider value={value}>{children}</MissionsContext.Provider>
}

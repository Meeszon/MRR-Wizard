import React, { createContext, useState, useMemo } from 'react'

const defaultWizard = {
  editingMission: null,
  name: '',
  quality: 50,
  app: 'OpenDroneMap',
  rtkEnabled: false,
  highestPointMeters: 10,
  homePoint: null,
  areaPolygon: [],
  polygonClosed: false,
  areaHectares: null,
}

export const WizardContext = createContext(null)

export function WizardProvider({ children }) {
  const [wizard, setWizard] = useState(defaultWizard)
  const [isEdit, setIsEdit] = useState(false)

  function updateWizard(updates) {
    setWizard((prev) => ({ ...prev, ...updates }))
  }

  function startNewWizard() {
    setWizard(defaultWizard)
    setIsEdit(false)
  }

  function startEditWizard(mission) {
    setWizard({
      editingMission: mission,
      name: mission.name,
      quality: mission.quality,
      app: mission.app,
      rtkEnabled: mission.rtkEnabled,
      highestPointMeters: mission.highestPointMeters,
      homePoint: null,
      areaPolygon: [],
      polygonClosed: false,
      areaHectares: null,
    })
    setIsEdit(true)
  }

  function resetWizard() {
    setWizard(defaultWizard)
    setIsEdit(false)
  }

  const value = useMemo(
    () => ({ wizard, isEdit, updateWizard, startNewWizard, startEditWizard, resetWizard }),
    [wizard, isEdit],
  )

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
}

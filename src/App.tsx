import { useState } from 'react'
import type { Screen, WizardState, Mission } from './types'
import { mockMissions } from './data'
import HomeScreen from './screens/HomeScreen'
import MissionListScreen from './screens/MissionListScreen'
import Step1_HomePoint from './screens/wizard/Step1_HomePoint'
import Step2_Area from './screens/wizard/Step2_Area'
import Step3_Settings from './screens/wizard/Step3_Settings'
import Step4_Confirm from './screens/wizard/Step4_Confirm'
import Step4_Ready from './screens/wizard/Step4_Ready'

const defaultWizard: WizardState = {
  editingMission: null,
  name: '',
  quality: 50,
  app: 'OpenDroneMap',
  rtkEnabled: false,
  highestPointMeters: 10,
}

const STEP_SCREENS: Record<number, Screen> = {
  1: 'wizard-step1',
  2: 'wizard-step2',
  3: 'wizard-step3',
  4: 'wizard-step4',
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [wizard, setWizard] = useState<WizardState>(defaultWizard)
  const [missions, setMissions] = useState<Mission[]>(mockMissions)
  const [lastMissionName, setLastMissionName] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [hintsVisible, setHintsVisible] = useState(true)

  function goHome() {
    setScreen('home')
    setWizard(defaultWizard)
    setIsEdit(false)
  }

  function startNewMission() {
    setWizard(defaultWizard)
    setIsEdit(false)
    setScreen('wizard-step1')
  }

  function startEditMission(mission: Mission) {
    setWizard({
      editingMission: mission,
      name: mission.name,
      quality: mission.quality,
      app: mission.app,
      rtkEnabled: mission.rtkEnabled,
      highestPointMeters: mission.highestPointMeters,
    })
    setIsEdit(true)
    setScreen('wizard-step3')
  }

  function startExistingMission(mission: Mission) {
    setLastMissionName(mission.name)
    setIsEdit(false)
    setScreen('wizard-ready')
  }

  function handleSubmit() {
    const name = wizard.name.trim()
    if (!name) return
    setLastMissionName(name)

    if (isEdit && wizard.editingMission) {
      setMissions((prev) =>
        prev.map((m) =>
          m.id === wizard.editingMission!.id
            ? {
                ...m,
                name,
                quality: wizard.quality,
                app: wizard.app,
                rtkEnabled: wizard.rtkEnabled,
                highestPointMeters: wizard.highestPointMeters,
              }
            : m,
        ),
      )
    } else {
      setMissions((prev) => [
        {
          id: Date.now().toString(),
          name,
          createdAt: new Date().toISOString().slice(0, 10),
          areaHectares: 3.4,
          quality: wizard.quality,
          app: wizard.app,
          rtkEnabled: wizard.rtkEnabled,
          highestPointMeters: wizard.highestPointMeters,
        },
        ...prev,
      ])
    }

    setScreen('wizard-ready')
  }

  function updateWizard(updates: Partial<WizardState>) {
    setWizard((prev) => ({ ...prev, ...updates }))
  }

  function handleStepClick(step: number) {
    const target = STEP_SCREENS[step]
    if (target) setScreen(target)
  }

  const wizardBarProps = {
    hintsVisible,
    onToggleHints: () => setHintsVisible((v) => !v),
    onStepClick: handleStepClick,
  }

  return (
    <div className="w-[640px] h-[360px] overflow-hidden relative font-sans">
      {screen === 'home' && (
        <HomeScreen onNewMission={startNewMission} onMyMissions={() => setScreen('mission-list')} missionCount={missions.length} />
      )}

      {screen === 'mission-list' && (
        <MissionListScreen missions={missions} onBack={goHome} onStart={startExistingMission} onEdit={startEditMission} />
      )}

      {screen === 'wizard-step1' && (
        <Step1_HomePoint onBack={goHome} onNext={() => setScreen('wizard-step2')} {...wizardBarProps} />
      )}

      {screen === 'wizard-step2' && (
        <Step2_Area onBack={() => setScreen('wizard-step1')} onNext={() => setScreen('wizard-step3')} {...wizardBarProps} />
      )}

      {screen === 'wizard-step3' && (
        <Step3_Settings
          wizard={wizard}
          onChange={updateWizard}
          onBack={() => setScreen(isEdit ? 'mission-list' : 'wizard-step2')}
          onNext={() => setScreen('wizard-step4')}
          {...wizardBarProps}
        />
      )}

      {screen === 'wizard-step4' && (
        <Step4_Confirm
          wizard={wizard}
          onChange={updateWizard}
          onBack={() => setScreen('wizard-step3')}
          onEditMap={() => setScreen('wizard-step2')}
          onSubmit={handleSubmit}
          isEdit={isEdit}
          {...wizardBarProps}
        />
      )}

      {screen === 'wizard-ready' && (
        <Step4_Ready missionName={lastMissionName} isEdit={isEdit} onStart={goHome} onHome={goHome} />
      )}
    </div>
  )
}

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { MissionsProvider } from './context/MissionsContext'
import { WizardProvider } from './context/WizardContext'
import HomePage from './pages/HomePage'
import MissionListPage from './pages/MissionListPage'
import Step1HomePoint from './pages/wizard/Step1_HomePoint'
import Step2Area from './pages/wizard/Step2_Area'
import Step3Settings from './pages/wizard/Step3_Settings'
import Step4Confirm from './pages/wizard/Step4_Confirm'
import Step4Ready from './pages/wizard/Step4_Ready'
import EditMissionPage from './pages/EditMissionPage'
import FlightLogPage from './pages/FlightLogPage'
import StartFlightPage from './pages/StartFlightPage'

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <MissionsProvider>
          <WizardProvider>
            <div className="w-full h-full overflow-hidden relative font-sans bg-bg-secondary">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/missions" element={<MissionListPage />} />
                <Route path="/wizard/step1" element={<Step1HomePoint />} />
                <Route path="/wizard/step2" element={<Step2Area />} />
                <Route path="/wizard/step3" element={<Step3Settings />} />
                <Route path="/wizard/step4" element={<Step4Confirm />} />
                <Route path="/wizard/ready" element={<Step4Ready />} />
                <Route path="/missions/edit" element={<EditMissionPage />} />
                <Route path="/flightlog" element={<FlightLogPage />} />
                <Route path="/start-flight" element={<StartFlightPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </WizardProvider>
        </MissionsProvider>
      </AppProvider>
    </HashRouter>
  )
}

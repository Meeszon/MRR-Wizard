import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { MissionsProvider } from './context/MissionsContext'
import { WizardProvider } from './context/WizardContext'
import DesktopLayout from './components/DesktopLayout'
import HomePage from './pages/HomePage'
import MissionListPage from './pages/MissionListPage'
import EditMissionPage from './pages/EditMissionPage'
import Step4Ready from './pages/wizard/Step4_Ready'
import FlightLogPage from './pages/FlightLogPage'
import StartFlightPage from './pages/StartFlightPage'
import ManualFlightPage from './pages/ManualFlightPage'

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <MissionsProvider>
          <WizardProvider>
            <div className="w-full h-full overflow-hidden relative font-sans bg-bg-secondary">
              <Routes>
                <Route element={<DesktopLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/missions" element={<MissionListPage />} />
                  <Route path="/flightlog" element={<FlightLogPage />} />
                  <Route path="/start-flight" element={<StartFlightPage />} />
                </Route>
                <Route path="/wizard/step1" element={<EditMissionPage />} />
                <Route path="/wizard/ready" element={<Step4Ready />} />
                <Route path="/missions/edit" element={<EditMissionPage />} />
                <Route path="/manual-flight" element={<ManualFlightPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </WizardProvider>
        </MissionsProvider>
      </AppProvider>
    </HashRouter>
  )
}

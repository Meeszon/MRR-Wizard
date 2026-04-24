import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Info, Home, PenLine, RotateCcw } from 'lucide-react'
import * as turf from '@turf/turf'
import MissionMap from '../../components/MissionMap'
import WizardBar from '../../components/WizardBar'
import useWizard from '../../hooks/useWizard'
import useAppPrefs from '../../hooks/useAppPrefs'

function getInitialPhase(wizard) {
  if (wizard.polygonClosed) return 'AREA_DONE'
  if (wizard.homePoint) return 'DRAWING_AREA'
  return 'PLACING_HOME'
}

export default function Step1Map() {
  const navigate = useNavigate()
  const { wizard, updateWizard } = useWizard()
  const { hintsVisible } = useAppPrefs()
  const [phase, setPhase] = useState(() => getInitialPhase(wizard))

  const polygon = wizard.areaPolygon ?? []

  function handleHomePointChange(point) {
    updateWizard({ homePoint: point })
    if (phase === 'PLACING_HOME') setPhase('DRAWING_AREA')
  }

  function handlePolygonChange(newPolygon) {
    updateWizard({ areaPolygon: newPolygon })
  }

  function handlePolygonClose() {
    const closedCoords = [...polygon, polygon[0]].map((p) => [p.lng, p.lat])
    const areaM2 = turf.area(turf.polygon([closedCoords]))
    updateWizard({
      polygonClosed: true,
      areaHectares: Math.round(areaM2 / 100) / 100,
    })
    setPhase('AREA_DONE')
  }

  function handleReset() {
    updateWizard({ areaPolygon: [], polygonClosed: false, areaHectares: null })
    setPhase(wizard.homePoint ? 'DRAWING_AREA' : 'PLACING_HOME')
  }

  const hintText = {
    PLACING_HOME: 'Tap the map to place the home point. The drone takes off and lands here.',
    DRAWING_AREA:
      polygon.length === 0
        ? 'Tap to place the first corner of the scan area.'
        : polygon.length < 3
          ? 'Keep tapping to add more corners.'
          : 'Tap the first corner point to close the area.',
    AREA_DONE: `Area: ${wizard.areaHectares ?? '—'} ha — confirm to continue.`,
  }[phase]

  return (
    <div className="w-full h-full flex flex-col">
      <WizardBar />

      <div className="flex-1 relative min-h-0">
        <MissionMap
          mode={phase === 'PLACING_HOME' ? 'home' : 'area'}
          homePoint={wizard.homePoint}
          onHomePointChange={(pt) => handleHomePointChange(pt)}
          polygon={polygon}
          onPolygonChange={(pts) => handlePolygonChange(pts)}
          polygonClosed={wizard.polygonClosed}
          onPolygonClose={() => handlePolygonClose()}
          className="absolute inset-0"
        />

        {/* Reset button — only shown when there's area data to clear */}
        {(polygon.length > 0 || wizard.polygonClosed) && (
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={handleReset}
              className="bg-white rounded-btn shadow-md border border-border px-2.5 py-2 flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <RotateCcw size={14} color="#5A5A5A" strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Hint */}
        {hintsVisible && (
          <div className="absolute bottom-16 left-3 right-3 flex justify-center pointer-events-none">
            <div className="bg-white/90 rounded-btn px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
              <Info size={12} color="#5A5A5A" className="flex-shrink-0" />
              <span className="text-body font-medium">{hintText}</span>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="absolute bottom-3 left-6 right-6">
          {phase !== 'AREA_DONE' ? (
            <div className="w-full max-w-[560px] mx-auto py-3 px-4 rounded-btn border-2 border-dashed border-body/25 bg-white/80 flex items-center justify-center gap-2.5">
              {phase === 'PLACING_HOME' ? (
                <>
                  <Home size={18} color="#5A5A5A" strokeWidth={2} />
                  <span className="text-body-lg text-body font-semibold">
                    Tap the map to place the home point
                  </span>
                </>
              ) : (
                <>
                  <PenLine size={18} color="#5A5A5A" strokeWidth={2} />
                  <span className="text-body-lg text-body font-semibold">Draw the scan area</span>
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/wizard/step2')}
              className="w-full max-w-[560px] mx-auto py-3 rounded-btn bg-primary flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-transform"
            >
              <Check size={18} color="white" strokeWidth={3} />
              <span className="text-h3 text-white font-bold">Confirm Map</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

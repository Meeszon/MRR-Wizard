import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Drone, Home, ArrowRight, Check, Info } from 'lucide-react'
import MapPlaceholder from '../../components/MapPlaceholder'
import WizardBar from '../../components/WizardBar'
import useAppPrefs from '../../hooks/useAppPrefs'

export default function Step1HomePoint() {
  const navigate = useNavigate()
  const { hintsVisible } = useAppPrefs()
  const [placed, setPlaced] = useState(false)

  return (
    <div className="w-full h-full flex flex-col">
      <WizardBar />

      <div className="flex-1 relative min-h-0">
        <button
          type="button"
          className="absolute inset-0 cursor-crosshair"
          onClick={() => setPlaced(true)}
        >
          <MapPlaceholder mode="location" className="absolute inset-0" />
        </button>

        {placed && (
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                navigate('/wizard/step2')
              }}
              className="bg-white rounded-btn shadow-md border border-border px-2.5 py-2 flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <Home size={15} color="#3D5AF2" strokeWidth={2} />
              <ArrowRight size={13} color="#3D5AF2" strokeWidth={2.5} />
              <Drone size={15} color="#3D5AF2" strokeWidth={2} />
            </button>
          </div>
        )}

        {hintsVisible && (
          <div className="absolute bottom-16 left-3 right-3 flex justify-center pointer-events-none">
            <div className="bg-white/90 rounded-btn px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
              <Info size={12} color="#5A5A5A" className="flex-shrink-0" />
              <span className="text-body font-medium">
                {placed
                  ? 'Drag the pin to the exact takeoff and landing location.'
                  : 'The drone takes off and returns here.'}
              </span>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-6 right-6">
          {!placed ? (
            <div className="w-full max-w-[560px] mx-auto py-3 px-4 rounded-btn border-2 border-dashed border-body/25 bg-white/80 flex items-center justify-center gap-2.5">
              <Home size={18} color="#5A5A5A" strokeWidth={2} />
              <span className="text-body-lg text-body font-semibold">
                Tap the map to place the home point
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/wizard/step2')}
              className="w-full max-w-[560px] mx-auto py-3 rounded-btn bg-primary border border-primary-dark flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-transform"
            >
              <Check size={18} color="white" strokeWidth={3} />
              <span className="text-h3 text-white font-bold">Confirm Home Point</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

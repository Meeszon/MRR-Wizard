import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Info, PenLine, RotateCcw } from 'lucide-react'
import MapPlaceholder from '../../components/MapPlaceholder'
import Button from '../../components/Button'
import WizardBar from '../../components/WizardBar'
import useAppPrefs from '../../hooks/useAppPrefs'

export default function Step2Area() {
  const navigate = useNavigate()
  const { hintsVisible } = useAppPrefs()
  const [clicks, setClicks] = useState(0)
  const isClosed = clicks >= 4

  function reset(e) {
    e.stopPropagation()
    setClicks(0)
  }

  return (
    <div className="w-full h-full flex flex-col">
      <WizardBar />

      <div className="flex-1 relative min-h-0">
        <button
          type="button"
          className="absolute inset-0 cursor-crosshair"
          onClick={() => setClicks((c) => Math.min(c + 1, 4))}
        >
          <MapPlaceholder mode={isClosed ? 'confirm' : 'draw'} className="absolute inset-0" />
        </button>

        {/* Reset button */}
        <div className="absolute top-3 right-3">
          <button
            type="button"
            onClick={reset}
            className="bg-white rounded-btn shadow-md border border-border px-2.5 py-2 flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <RotateCcw size={15} color="#5A5A5A" strokeWidth={2} />
          </button>
        </div>

        {hintsVisible && (
          <div className="absolute bottom-16 left-3 right-3 flex justify-center pointer-events-none">
            <div className="bg-white/90 rounded-btn px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
              <Info size={12} color="#5A5A5A" className="flex-shrink-0" />
              <span className="text-body font-medium">
                {isClosed
                  ? 'Check the area and confirm'
                  : clicks === 0
                    ? 'Tap the map to place your first corner point'
                    : clicks < 3
                      ? 'Tap to add more corner points. Draw the perimeter of the area'
                      : 'When done, tap your first corner point to close the area'}
              </span>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-6 right-6">
          {!isClosed ? (
            <div className="w-full max-w-[560px] mx-auto py-3 px-4 rounded-btn border-2 border-dashed border-body/25 bg-white/80 flex items-center justify-center gap-2.5">
              <PenLine size={18} color="#5A5A5A" strokeWidth={2} />
              <span className="text-body-lg text-body font-semibold">
                Draw the area to be scanned
              </span>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/wizard/step3')}
              icon={<Check size={18} color="white" strokeWidth={2.5} />}
            >
              Confirm Area
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

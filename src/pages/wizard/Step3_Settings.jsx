import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Mountain, Signal, Layers, ChevronRight, Check } from 'lucide-react'
import Toggle from '../../components/Toggle'
import NumberStepper from '../../components/NumberStepper'
import WizardBar from '../../components/WizardBar'
import QualityScreen from '../../components/QualityScreen'
import { useWizard } from '../../hooks/useWizard'
import { useAppPrefs } from '../../hooks/useAppPrefs'
import { BLUE } from '../../constants'
import { qualityLabel } from '../../utils/qualityUtils'

export default function Step3Settings() {
  const navigate = useNavigate()
  const { wizard, updateWizard } = useWizard()
  const { hintsVisible } = useAppPrefs()
  const [showQualityScreen, setShowQualityScreen] = useState(false)

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary relative">
      <WizardBar />

      <div className="flex-1 overflow-y-auto min-h-0 px-4 pt-3 pb-2">
        <div className="bg-bg-primary rounded-card border border-border overflow-hidden max-w-[600px] mx-auto w-full">
          {/* Quality — drill-down */}
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 hover:bg-bg-secondary transition-colors"
            style={{ minHeight: 60, paddingBlock: 10 }}
            onClick={() => setShowQualityScreen(true)}
          >
            <Camera size={16} color={BLUE} className="flex-shrink-0" />
            <span className="font-semibold text-title" style={{ fontSize: 13 }}>
              Quality
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <span style={{ fontSize: 13, color: '#23262F', fontWeight: 600 }}>
                {qualityLabel(wizard.quality)}
              </span>
              <ChevronRight size={16} color="#C0C0C0" className="flex-shrink-0" />
            </div>
          </button>

          <div className="h-px bg-border" />

          {/* Highest point — stepper */}
          <div className="px-4 flex items-center gap-3" style={{ minHeight: 60, paddingBlock: 10 }}>
            <Mountain size={16} color={BLUE} className="flex-shrink-0" />
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="font-semibold text-title" style={{ fontSize: 13 }}>
                Highest point
              </span>
              {hintsVisible && (
                <span style={{ fontSize: 11, color: '#5A5A5A', lineHeight: 1.3 }}>
                  How high is the tallest object in the flight area?
                </span>
              )}
            </div>
            <NumberStepper
              value={wizard.highestPointMeters}
              onChange={(val) => updateWizard({ highestPointMeters: val })}
              size="md"
            />
          </div>

          <div className="h-px bg-border" />

          {/* RTK precision — toggle */}
          <div className="px-4 flex items-center gap-3" style={{ minHeight: 60, paddingBlock: 10 }}>
            <Signal
              size={16}
              color={wizard.rtkEnabled ? BLUE : '#C0C0C0'}
              className="flex-shrink-0"
            />
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="font-semibold text-title" style={{ fontSize: 13 }}>
                RTK Precision
              </span>
              <span style={{ fontSize: 11, color: '#5A5A5A', lineHeight: 1.3 }}>
                Only available for the MRR Pro drone
              </span>
            </div>
            <div className="flex-shrink-0">
              <Toggle
                enabled={wizard.rtkEnabled}
                onChange={(val) => updateWizard({ rtkEnabled: val })}
              />
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Application — read-only */}
          <div className="px-4 flex items-center gap-3" style={{ minHeight: 60 }}>
            <Layers size={16} color={BLUE} className="flex-shrink-0" />
            <span className="font-semibold text-title" style={{ fontSize: 13 }}>
              Application
            </span>
            <span className="ml-auto" style={{ fontSize: 13, color: '#5A5A5A' }}>
              {wizard.app}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="flex-shrink-0 px-8 pt-2 pb-3">
        <button
          type="button"
          onClick={() => navigate('/wizard/step4')}
          className="w-full max-w-[560px] mx-auto py-3 rounded-btn bg-primary flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-transform"
        >
          <Check size={18} color="white" strokeWidth={3} />
          <span className="text-h3 text-white font-bold">Confirm Settings</span>
        </button>
      </div>

      {showQualityScreen && (
        <QualityScreen
          wizard={wizard}
          updateWizard={updateWizard}
          hintsVisible={hintsVisible}
          onClose={() => setShowQualityScreen(false)}
        />
      )}
    </div>
  )
}

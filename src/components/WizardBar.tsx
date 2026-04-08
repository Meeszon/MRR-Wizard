import { ArrowLeft, Check, Info } from 'lucide-react'

interface WizardBarProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onStepClick?: (step: number) => void
  hintsVisible: boolean
  onToggleHints: () => void
}

export default function WizardBar({ currentStep, totalSteps, onBack, onStepClick, hintsVisible, onToggleHints }: WizardBarProps) {
  return (
    <div className="flex items-center bg-white border-b border-border px-4 py-3 flex-shrink-0 gap-3">
      {/* Back */}
      <button
        onClick={onBack}
        className="w-8 h-8 flex items-center justify-center rounded-btn hover:bg-bg-secondary transition-colors flex-shrink-0"
      >
        <ArrowLeft size={20} color="#5A5A5A" />
      </button>

      {/* Step circles */}
      <div className="flex items-center flex-1 justify-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const isDone = step < currentStep
          const isCurrent = step === currentStep
          const isClickable = isDone && !!onStepClick

          return (
            <div key={step} className="flex items-center">
              <div
                onClick={isClickable ? () => onStepClick(step) : undefined}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: isDone ? '#22C55E' : isCurrent ? '#3D5AF2' : '#F8F8F8',
                  border: isDone || isCurrent ? 'none' : '2px solid #E0E0E0',
                  boxShadow: isCurrent ? '0 0 0 5px rgba(61,90,242,0.12)' : 'none',
                  cursor: isClickable ? 'pointer' : 'default',
                  transition: 'opacity 0.15s, transform 0.15s',
                }}
                className={isClickable ? 'hover:opacity-80 active:scale-95' : ''}
              >
                {isDone ? (
                  <Check size={15} strokeWidth={3} color="white" />
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 700, color: isCurrent ? '#fff' : '#5A5A5A', lineHeight: 1 }}>
                    {step}
                  </span>
                )}
              </div>

              {step < totalSteps && (
                <div style={{ width: 56, height: 2, backgroundColor: '#E0E0E0' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Hints toggle */}
      <button
        onClick={onToggleHints}
        title={hintsVisible ? 'Verberg uitleg' : 'Toon uitleg'}
        className="w-8 h-8 flex items-center justify-center rounded-btn hover:bg-bg-secondary transition-colors flex-shrink-0"
      >
        <Info size={18} color={hintsVisible ? '#3D5AF2' : '#C0C0C0'} />
      </button>
    </div>
  )
}

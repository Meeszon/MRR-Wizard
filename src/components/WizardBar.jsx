import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Check, Info } from 'lucide-react'
import useAppPrefs from '../hooks/useAppPrefs'
import useWizard from '../hooks/useWizard'

const TOTAL_STEPS = 3
const STEPS = Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1)

function getBackPath(step, isEdit) {
  if (step === 1) return '/'
  if (step === 2) return isEdit ? '/missions' : '/wizard/step1'
  if (step === 3) return '/wizard/step2'
  return '/'
}

export default function WizardBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { hintsVisible, toggleHints } = useAppPrefs()
  const { isEdit } = useWizard()

  const stepMatch = pathname.match(/\/wizard\/step(\d+)/)
  const currentStep = stepMatch ? parseInt(stepMatch[1], 10) : 0

  function handleBack() {
    navigate(getBackPath(currentStep, isEdit))
  }

  function handleStepClick(step) {
    if (step < currentStep) {
      navigate(`/wizard/step${step}`)
    }
  }

  return (
    <div className="flex items-center bg-white border-b border-border px-4 py-3 flex-shrink-0 gap-3">
      {/* Back */}
      <button
        type="button"
        onClick={handleBack}
        className="w-8 h-8 flex items-center justify-center rounded-btn hover:bg-bg-secondary transition-colors flex-shrink-0"
      >
        <ArrowLeft size={20} color="#5A5A5A" />
      </button>

      {/* Step circles */}
      <div className="flex items-center flex-1 justify-center">
        {STEPS.map((step) => {
          const isDone = step < currentStep
          const isCurrent = step === currentStep
          const isClickable = isDone

          const Tag = isClickable ? 'button' : 'div'

          return (
            <div key={step} className="flex items-center">
              <Tag
                type={isClickable ? 'button' : undefined}
                onClick={isClickable ? () => handleStepClick(step) : undefined}
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
                  padding: 0,
                }}
                className={isClickable ? 'hover:opacity-80 active:scale-95' : ''}
              >
                {isDone ? (
                  <Check size={15} strokeWidth={3} color="white" />
                ) : (
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: isCurrent ? '#fff' : '#5A5A5A',
                      lineHeight: 1,
                    }}
                  >
                    {step}
                  </span>
                )}
              </Tag>

              {step < TOTAL_STEPS && (
                <div style={{ width: 56, height: 2, backgroundColor: '#E0E0E0' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Hints toggle */}
      <button
        type="button"
        onClick={toggleHints}
        title={hintsVisible ? 'Hide hints' : 'Show hints'}
        className="w-8 h-8 flex items-center justify-center rounded-btn hover:bg-bg-secondary transition-colors flex-shrink-0"
      >
        <Info size={18} color={hintsVisible ? '#3D5AF2' : '#C0C0C0'} />
      </button>
    </div>
  )
}

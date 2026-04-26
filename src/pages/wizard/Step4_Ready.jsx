import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Play, Home } from 'lucide-react'
import useMissions from '../../hooks/useMissions'
import useWizard from '../../hooks/useWizard'

export default function Step4Ready() {
  const navigate = useNavigate()
  const { lastMissionName } = useMissions()
  const { isEdit, resetWizard } = useWizard()

  function goHome() {
    resetWizard()
    navigate('/')
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-bg-secondary px-10 py-6">
      {/* Top spacer */}
      <div />

      {/* Centered content */}
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle size={60} color="#22C55E" strokeWidth={1.75} />
        <div className="flex flex-col items-center gap-1">
          <span className="font-bold text-title" style={{ fontSize: 18 }}>
            {isEdit ? 'Mission updated' : 'Ready to fly'}
          </span>
          <span className="font-semibold" style={{ fontSize: 14, color: '#3D5AF2' }}>
            {lastMissionName}
          </span>
          <span style={{ fontSize: 12, color: '#9A9A9A', marginTop: 2 }}>
            {isEdit ? 'Settings have been saved.' : 'Mission has been saved and is ready.'}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-[560px] mx-auto flex gap-2">
        <button
          type="button"
          onClick={goHome}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-btn border border-border bg-white active:scale-[0.98] transition-transform"
          style={{ height: 44 }}
        >
          <Home size={15} color="#5A5A5A" />
          <span className="font-semibold" style={{ fontSize: 13, color: '#5A5A5A' }}>
            Home
          </span>
        </button>

        <button
          type="button"
          onClick={goHome}
          className="flex-1 rounded-btn bg-primary border border-primary-dark flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-transform"
          style={{ height: 44 }}
        >
          <Play size={16} color="white" fill="white" strokeWidth={0} />
          <span className="font-bold text-white" style={{ fontSize: 14 }}>
            Start Mission
          </span>
        </button>
      </div>
    </div>
  )
}

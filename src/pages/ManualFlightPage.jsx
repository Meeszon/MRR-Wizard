import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Joystick } from 'lucide-react'

const BLUE = '#3D5AF2'

export default function ManualFlightPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary">
      <div
        className="relative flex items-center bg-white border-b border-border px-3 flex-shrink-0"
        style={{ height: 50 }}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-8 h-8 flex items-center justify-center rounded-btn hover:bg-bg-secondary transition-colors flex-shrink-0"
        >
          <ArrowLeft size={18} color="#5A5A5A" />
        </button>
        <span
          className="absolute inset-0 flex items-center justify-center font-bold text-title pointer-events-none"
          style={{ fontSize: 14 }}
        >
          Manual Flight
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <div
            className="mx-auto mb-4 flex items-center justify-center rounded-btn"
            style={{ width: 56, height: 56, background: 'rgba(61,90,242,0.10)' }}
          >
            <Joystick size={26} color={BLUE} strokeWidth={1.75} />
          </div>
          <div className="font-bold text-title mb-1" style={{ fontSize: 15 }}>
            Manual Flight Mode
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>Manual control interface coming soon</div>
        </div>
      </div>
    </div>
  )
}

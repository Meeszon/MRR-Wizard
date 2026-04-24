import { useNavigate } from 'react-router-dom'
import { Joystick } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { BLUE } from '../constants'

export default function ManualFlightPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary">
      <PageHeader title="Manual Flight" onBack={() => navigate('/')} />

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

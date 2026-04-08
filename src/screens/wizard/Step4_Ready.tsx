import { CheckCircle, Play, Home } from 'lucide-react'

interface Step4ReadyProps {
  missionName: string
  isEdit: boolean
  onStart: () => void
  onHome: () => void
}

export default function Step4_Ready({ missionName, isEdit, onStart, onHome }: Step4ReadyProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-bg-secondary px-10 py-6">

      {/* Top spacer */}
      <div />

      {/* Centered content */}
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle size={60} color="#22C55E" strokeWidth={1.75} />

        <div className="flex flex-col items-center gap-1">
          <span className="font-bold text-title" style={{ fontSize: 18 }}>
            {isEdit ? 'Missie bijgewerkt' : 'Klaar om te vliegen'}
          </span>
          <span className="font-semibold" style={{ fontSize: 14, color: '#3D5AF2' }}>
            {missionName}
          </span>
          <span style={{ fontSize: 12, color: '#9A9A9A', marginTop: 2 }}>
            {isEdit ? 'Instellingen zijn opgeslagen.' : 'De missie is opgeslagen en gereed.'}
          </span>
        </div>
      </div>

      {/* Buttons — side by side */}
      <div className="w-full max-w-[560px] mx-auto flex gap-2">
        <button
          onClick={onHome}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-btn border border-border bg-white active:scale-[0.98] transition-transform"
          style={{ height: 44 }}
        >
          <Home size={15} color="#5A5A5A" />
          <span className="font-semibold" style={{ fontSize: 13, color: '#5A5A5A' }}>Home</span>
        </button>

        <button
          onClick={onStart}
          className="flex-1 rounded-btn bg-primary flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-transform"
          style={{ height: 44 }}
        >
          <Play size={16} color="white" fill="white" strokeWidth={0} />
          <span className="font-bold text-white" style={{ fontSize: 14 }}>Start Missie</span>
        </button>
      </div>
    </div>
  )
}

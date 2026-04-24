import React from 'react'
import { ArrowLeft } from 'lucide-react'

export default function PageHeader({ title, onBack, right, height = 50 }) {
  return (
    <div
      className="relative flex items-center bg-white border-b border-border px-6 flex-shrink-0"
      style={{ height }}
    >
      <button
        type="button"
        onClick={onBack}
        className="w-8 h-8 flex items-center justify-center rounded-btn border border-border bg-white hover:bg-bg-secondary hover:border-body transition-colors flex-shrink-0"
      >
        <ArrowLeft size={18} color="#23262F" />
      </button>
      <span
        className="absolute inset-0 flex items-center justify-center font-bold text-title pointer-events-none"
        style={{ fontSize: 15 }}
      >
        {title}
      </span>
      {right && <div className="ml-auto relative z-10">{right}</div>}
    </div>
  )
}

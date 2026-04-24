import React from 'react'
import { ArrowLeft, ArrowRight, Clock, Battery, Camera } from 'lucide-react'
import BigSlider from './BigSlider'
import { BLUE, RED, CURRENT_BATTERY, calcMetrics } from '../constants'

function FeasibilityBadge({ feasible }) {
  const color = feasible ? '#2a9d6e' : RED
  const bg = feasible ? 'rgba(103,215,163,0.15)' : 'rgba(224,81,95,0.12)'
  const border = `1px solid ${feasible ? 'rgba(103,215,163,0.5)' : 'rgba(224,81,95,0.5)'}`
  return (
    <div
      className="flex-shrink-0 rounded-full px-3 py-1 flex items-center gap-1.5"
      style={{ background: bg, border }}
    >
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 600, color }}>
        {feasible ? 'Flight possible' : 'Flight too long'}
      </span>
    </div>
  )
}

function MetricCard({ icon, value, label, valueStyle, labelStyle }) {
  return (
    <div className="bg-white rounded-card border border-border flex flex-col items-center justify-center gap-1 py-4">
      {icon}
      <span
        className="font-bold text-title"
        style={{ fontSize: 22, lineHeight: 1.1, ...valueStyle }}
      >
        {value}
      </span>
      <span style={{ fontSize: 10, color: '#5A5A5A', ...labelStyle }}>{label}</span>
    </div>
  )
}

export default function QualityScreen({ wizard, updateWizard, hintsVisible, onClose }) {
  const m = calcMetrics(wizard.quality)

  return (
    <div className="absolute inset-0 bg-bg-secondary flex flex-col z-10 overflow-hidden">
      <div className="relative flex items-center bg-white border-b border-border px-4 py-3 flex-shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-btn hover:bg-bg-secondary transition-colors flex-shrink-0 relative z-10"
        >
          <ArrowLeft size={20} color="#5A5A5A" />
        </button>
        <span
          className="absolute inset-0 flex items-center justify-center font-bold text-title pointer-events-none"
          style={{ fontSize: 15 }}
        >
          Quality
        </span>
        <div className="ml-auto relative z-10">
          <FeasibilityBadge feasible={m.feasible} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-[560px] mx-auto w-full">
          <div className="grid grid-cols-2 gap-2 px-4 py-4 min-[480px]:grid-cols-4">
            <MetricCard icon={<Clock size={16} color={BLUE} />} value={m.flightTime} label="min" />
            <MetricCard
              icon={<ArrowRight size={16} color={BLUE} style={{ transform: 'rotate(90deg)' }} />}
              value={m.flightHeight}
              label="m altitude"
            />
            <MetricCard icon={<Camera size={16} color={BLUE} />} value={m.photos} label="photos" />
            <MetricCard
              icon={<Battery size={16} color={m.feasible ? BLUE : RED} />}
              value={`-${m.batteryNeed}%`}
              label={`Current: ${CURRENT_BATTERY}%`}
              valueStyle={{ color: m.feasible ? '#23262F' : RED }}
              labelStyle={{ color: '#9A9A9A' }}
            />
          </div>

          <div className="px-4 pb-4">
            <div className="bg-white rounded-card border border-border px-5 py-4">
              <div className="flex justify-between mb-4">
                <span style={{ fontSize: 12, fontWeight: 600, color: '#5A5A5A' }}>
                  Fast (Less detail)
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#5A5A5A' }}>
                  Slow (More detail)
                </span>
              </div>
              <BigSlider
                value={wizard.quality}
                onChange={(val) => updateWizard({ quality: val })}
              />
            </div>
            {hintsVisible && (
              <span className="block text-center mt-3" style={{ fontSize: 11, color: '#5A5A5A' }}>
                Higher quality = more battery and slower flight
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

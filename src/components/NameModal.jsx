import React from 'react'
import { X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BLUE, RED } from '../constants'

function ModalStatCell({ label, value, valueColor }) {
  return (
    <div className="flex-1 flex flex-col items-center py-2.5 gap-0.5">
      <span
        style={{
          fontSize: 10,
          fontWeight: 500,
          color: '#9A9AB0',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: valueColor || '#23262F',
        }}
      >
        {value}
      </span>
    </div>
  )
}

export default function NameModal({
  visible,
  onClose,
  nameInput,
  onNameChange,
  onConfirm,
  canCreate,
  wizard,
  metrics,
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="absolute inset-0 z-50 flex items-end overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full bg-white rounded-t-2xl pt-4 pb-6"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
          >
            <div className="max-w-xl mx-auto px-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-title" style={{ fontSize: 15 }}>
                  Name your mission
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center justify-center rounded-btn bg-bg-secondary active:scale-95 transition-transform"
                  style={{ width: 28, height: 28 }}
                >
                  <X size={14} color="#5A5A5A" />
                </button>
              </div>

              <input
                type="text"
                value={nameInput}
                onChange={onNameChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onConfirm()
                }}
                placeholder="e.g. North field scan..."
                className="w-full bg-bg-secondary border border-border rounded-btn outline-none font-medium focus:border-primary transition-colors mb-3"
                style={{ fontSize: 15, color: '#23262F', padding: '10px 12px' }}
                autoComplete="off"
              />

              {/* Mission recap */}
              <div
                className="rounded-btn mb-3 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #ECEFFE 0%, #F5F7FF 100%)',
                  border: '1px solid rgba(61,90,242,0.12)',
                }}
              >
                <div className="flex">
                  <ModalStatCell
                    label="area"
                    value={wizard.areaHectares != null ? `${wizard.areaHectares} ha` : '—'}
                  />
                  <div style={{ width: 1, background: 'rgba(61,90,242,0.10)', margin: '8px 0' }} />
                  <ModalStatCell label="altitude" value={`${metrics.flightHeight}m`} />
                  <div style={{ width: 1, background: 'rgba(61,90,242,0.10)', margin: '8px 0' }} />
                  <ModalStatCell label="flight" value={`${metrics.flightTime} min`} />
                  <div style={{ width: 1, background: 'rgba(61,90,242,0.10)', margin: '8px 0' }} />
                  <ModalStatCell
                    label="battery"
                    value={`−${metrics.batteryNeed}%`}
                    valueColor={metrics.feasible ? undefined : RED}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={onConfirm}
                disabled={!canCreate}
                className={`w-full rounded-btn flex items-center justify-center gap-2 ${canCreate ? 'active:scale-[0.98] transition-transform' : ''}`}
                style={{
                  height: 44,
                  background: canCreate ? BLUE : '#E0E0E0',
                  border: `1px solid ${canCreate ? '#2D47D9' : '#D0D0D0'}`,
                  boxShadow: canCreate ? '0 2px 8px rgba(61,90,242,0.3)' : 'none',
                }}
              >
                <Check size={16} color={canCreate ? 'white' : '#AAAAAA'} strokeWidth={3} />
                <span
                  style={{ fontSize: 14, fontWeight: 700, color: canCreate ? 'white' : '#AAAAAA' }}
                >
                  Create Mission
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

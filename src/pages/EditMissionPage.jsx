/* global window */
import React, { useState, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  X,
  Map,
  SlidersHorizontal,
  Check,
  Clock,
  Battery,
  ArrowUp,
  Undo2,
  Locate,
  Camera,
  Signal,
  Layers,
  Pencil,
  Mountain,
} from 'lucide-react'
import * as turf from '@turf/turf'
import MissionMap from '../components/MissionMap'
import BigSlider from '../components/BigSlider'
import NumberStepper from '../components/NumberStepper'
import Toggle from '../components/Toggle'
import useMissions from '../hooks/useMissions'
import useWizard from '../hooks/useWizard'
import { BLUE, RED, CURRENT_BATTERY, calcMetrics } from '../constants'
import qualityLabel from '../utils/qualityUtils'

export default function EditMissionPage() {
  const navigate = useNavigate()
  const { updateMission } = useMissions()
  const { wizard, updateWizard } = useWizard()
  const [activeTab, setActiveTab] = useState('map')
  const [undoStack, setUndoStack] = useState([])
  const missionMapRef = useRef()

  if (!wizard.editingMission) {
    return <Navigate to="/missions" replace />
  }

  const metrics = calcMetrics(wizard.quality, wizard.highestPointMeters)
  const polygon = wizard.areaPolygon ?? []

  function pushUndo() {
    setUndoStack((prev) => [
      ...prev,
      {
        homePoint: wizard.homePoint,
        areaPolygon: wizard.areaPolygon,
        polygonClosed: wizard.polygonClosed,
        areaHectares: wizard.areaHectares,
      },
    ])
  }

  function handleUndo() {
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    setUndoStack((s) => s.slice(0, -1))
    updateWizard({
      homePoint: prev.homePoint,
      areaPolygon: prev.areaPolygon,
      polygonClosed: prev.polygonClosed,
      areaHectares: prev.areaHectares,
    })
  }

  function handleGoHome() {
    if (wizard.homePoint) {
      missionMapRef.current?.flyTo([wizard.homePoint.lng, wizard.homePoint.lat])
    } else if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (pos) => missionMapRef.current?.flyTo([pos.coords.longitude, pos.coords.latitude]),
        () => {},
      )
    }
  }

  function handleSave() {
    updateMission(wizard.editingMission.id, {
      name: wizard.name || wizard.editingMission.name,
      quality: wizard.quality,
      highestPointMeters: wizard.highestPointMeters,
      rtkEnabled: wizard.rtkEnabled,
      app: wizard.app,
    })
    navigate('/missions')
  }

  function handlePolygonChange(newPolygon) {
    pushUndo()
    const updates = { areaPolygon: newPolygon }
    if (wizard.polygonClosed && newPolygon.length >= 3) {
      const closedCoords = [...newPolygon, newPolygon[0]].map((p) => [p.lng, p.lat])
      const areaM2 = turf.area(turf.polygon([closedCoords]))
      updates.areaHectares = Math.round(areaM2 / 100) / 100
    }
    updateWizard(updates)
  }

  function handlePolygonClose() {
    pushUndo()
    const closedCoords = [...polygon, polygon[0]].map((p) => [p.lng, p.lat])
    const areaM2 = turf.area(turf.polygon([closedCoords]))
    updateWizard({
      polygonClosed: true,
      areaHectares: Math.round(areaM2 / 100) / 100,
    })
  }

  function handleHomePointChange(pt) {
    pushUndo()
    updateWizard({ homePoint: pt })
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-bg-secondary">
      {/* ── Single top bar: Cancel | Tabs | Save ── */}
      <div
        className="relative flex items-center bg-white border-b border-border px-3 flex-shrink-0"
        style={{ height: 52 }}
      >
        {/* Cancel */}
        <button
          type="button"
          onClick={() => navigate('/missions')}
          className="flex items-center gap-1.5 rounded-btn border border-border bg-white active:bg-bg-secondary transition-colors flex-shrink-0 select-none"
          style={{ padding: '6px 12px', fontSize: 13, fontWeight: 600, color: '#5A5A5A' }}
        >
          <X size={14} color="#5A5A5A" strokeWidth={2.5} />
          Cancel
        </button>

        {/* Segmented tab toggle — centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="flex items-center pointer-events-auto rounded-btn border border-border p-0.5"
            style={{ background: '#F0F1F5', gap: 0 }}
          >
            {[
              { key: 'map', icon: Map, label: 'Map' },
              { key: 'settings', icon: SlidersHorizontal, label: 'Settings' },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className="relative flex items-center gap-1.5 rounded-btn select-none transition-all"
                style={{
                  padding: '5px 16px',
                  fontSize: 13,
                  fontWeight: activeTab === key ? 700 : 500,
                  color: activeTab === key ? BLUE : '#888888',
                  background: activeTab === key ? 'white' : 'transparent',
                  boxShadow: activeTab === key ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          type="button"
          onClick={handleSave}
          className="ml-auto flex items-center gap-1.5 rounded-btn active:scale-95 transition-transform select-none"
          style={{
            background: BLUE,
            padding: '6px 14px',
            boxShadow: '0 2px 8px rgba(61,90,242,0.3)',
          }}
        >
          <Check size={14} color="white" strokeWidth={3} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Save</span>
        </button>
      </div>

      {/* ── Carousel ── */}
      <div className="flex-1 relative min-h-0 overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ width: '200%' }}
          animate={{ x: activeTab === 'map' ? '0%' : '-50%' }}
          transition={{ type: 'spring', stiffness: 500, damping: 45, mass: 0.8 }}
        >
          {/* ── Map panel ── */}
          <div className="relative h-full" style={{ width: '50%' }}>
            {/* Map overlay buttons — top right */}
            <div className="absolute top-3 right-3 z-10 flex gap-1.5">
              <button
                type="button"
                onClick={handleGoHome}
                className="bg-white/95 rounded-btn shadow-md border border-border p-2 active:scale-95 transition-transform"
                title="Go to home point"
              >
                <Locate size={13} color="#5A5A5A" />
              </button>
              {undoStack.length > 0 && (
                <button
                  type="button"
                  onClick={handleUndo}
                  className="bg-white/95 rounded-btn shadow-md border border-border p-2 active:scale-95 transition-transform"
                  title="Undo last action"
                >
                  <Undo2 size={13} color="#5A5A5A" />
                </button>
              )}
            </div>

            <MissionMap
              ref={missionMapRef}
              mode="edit"
              homePoint={wizard.homePoint}
              onHomePointChange={(pt) => handleHomePointChange(pt)}
              polygon={polygon}
              onPolygonChange={(pts) => handlePolygonChange(pts)}
              polygonClosed={wizard.polygonClosed}
              onPolygonClose={() => handlePolygonClose()}
              className="absolute inset-0"
            />

            {/* Floating metrics strip — center bottom */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10 pointer-events-none">
              <div className="inline-flex items-stretch bg-white/95 rounded-btn border border-border shadow-lg overflow-hidden">
                <MetricPill
                  icon={<ArrowUp size={11} color={BLUE} />}
                  value={`${metrics.flightHeight}m`}
                />
                <div className="w-px bg-border" />
                <MetricPill
                  icon={<Clock size={11} color={BLUE} />}
                  value={`${metrics.flightTime} min`}
                />
                <div className="w-px bg-border" />
                <MetricPill
                  icon={<Battery size={11} color={metrics.feasible ? BLUE : RED} />}
                  value={`-${metrics.batteryNeed}%`}
                  valueColor={metrics.feasible ? undefined : RED}
                />
              </div>
            </div>
          </div>

          {/* ── Settings panel ── */}
          <div className="h-full overflow-y-auto" style={{ width: '50%' }}>
            <div className="px-4 pt-3 pb-4">
              {/* Infeasibility warning */}
              {!metrics.feasible && (
                <div
                  className="flex items-center gap-2 mb-3 px-3 py-2 rounded-btn"
                  style={{
                    background: 'rgba(224,81,95,0.08)',
                    border: '1px solid rgba(224,81,95,0.25)',
                  }}
                >
                  <Battery size={13} color={RED} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: RED }}>
                    Battery insufficient — reduce quality
                  </span>
                </div>
              )}

              {/* Metrics cards */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <MetricCard
                  icon={<ArrowUp size={14} color={BLUE} />}
                  value={`${metrics.flightHeight}m`}
                  label="altitude"
                />
                <MetricCard
                  icon={<Clock size={14} color={BLUE} />}
                  value={`${metrics.flightTime} min`}
                  label="flight time"
                />
                <MetricCard
                  icon={<Battery size={14} color={metrics.feasible ? BLUE : RED} />}
                  value={`-${metrics.batteryNeed}%`}
                  label={`of ${CURRENT_BATTERY}%`}
                  valueColor={metrics.feasible ? undefined : RED}
                />
              </div>

              {/* Settings list */}
              <div className="bg-white rounded-card border border-border overflow-hidden">
                {/* Name */}
                <div
                  className="flex items-center gap-3 px-4"
                  style={{ minHeight: 52, paddingBlock: 8 }}
                >
                  <Pencil size={15} color={BLUE} className="flex-shrink-0" />
                  <span className="font-semibold text-title flex-shrink-0" style={{ fontSize: 13 }}>
                    Name
                  </span>
                  <input
                    type="text"
                    value={wizard.name}
                    onChange={(e) => updateWizard({ name: e.target.value })}
                    className="flex-1 text-right bg-transparent outline-none font-medium min-w-0"
                    style={{ fontSize: 13, color: '#5A5A5A' }}
                    placeholder="Mission name..."
                  />
                </div>

                <div className="h-px bg-border" />

                {/* Quality */}
                <div className="px-4 pt-3 pb-1">
                  <div className="flex items-center gap-3">
                    <Camera size={15} color={BLUE} className="flex-shrink-0" />
                    <span className="font-semibold text-title" style={{ fontSize: 13 }}>
                      Quality
                    </span>
                    <span
                      className="ml-auto font-semibold"
                      style={{ fontSize: 13, color: '#5A5A5A' }}
                    >
                      {qualityLabel(wizard.quality)}
                    </span>
                  </div>
                  <BigSlider
                    value={wizard.quality}
                    onChange={(val) => updateWizard({ quality: val })}
                  />
                </div>

                <div className="h-px bg-border" />

                {/* Highest point */}
                <div
                  className="px-4 flex items-center gap-3"
                  style={{ minHeight: 52, paddingBlock: 8 }}
                >
                  <Mountain size={15} color={BLUE} className="flex-shrink-0" />
                  <span className="font-semibold text-title flex-shrink-0" style={{ fontSize: 13 }}>
                    Highest point
                  </span>
                  <div className="ml-auto">
                    <NumberStepper
                      value={wizard.highestPointMeters}
                      onChange={(val) => updateWizard({ highestPointMeters: val })}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* RTK Precision */}
                <div
                  className="px-4 flex items-center gap-3"
                  style={{ minHeight: 52, paddingBlock: 8 }}
                >
                  <Signal
                    size={15}
                    color={wizard.rtkEnabled ? BLUE : '#C0C0C0'}
                    className="flex-shrink-0"
                  />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="font-semibold text-title" style={{ fontSize: 13 }}>
                      RTK Precision
                    </span>
                    <span style={{ fontSize: 11, color: '#9A9A9A' }}>MRR Pro only</span>
                  </div>
                  <Toggle
                    enabled={wizard.rtkEnabled}
                    onChange={(val) => updateWizard({ rtkEnabled: val })}
                  />
                </div>

                <div className="h-px bg-border" />

                {/* Application */}
                <div className="px-4 flex items-center gap-3" style={{ minHeight: 52 }}>
                  <Layers size={15} color={BLUE} className="flex-shrink-0" />
                  <span className="font-semibold text-title" style={{ fontSize: 13 }}>
                    Application
                  </span>
                  <span className="ml-auto" style={{ fontSize: 13, color: '#5A5A5A' }}>
                    {wizard.app}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function MetricPill({ icon, value, valueColor }) {
  return (
    <div className="flex items-center gap-1 px-2.5 py-1.5">
      {icon}
      <span className="font-bold" style={{ fontSize: 12, color: valueColor || '#23262F' }}>
        {value}
      </span>
    </div>
  )
}

function MetricCard({ icon, value, label, valueColor }) {
  return (
    <div className="bg-white rounded-card border border-border flex flex-col items-center py-2.5 gap-0.5">
      {icon}
      <span className="font-bold" style={{ fontSize: 15, color: valueColor || '#23262F' }}>
        {value}
      </span>
      <span style={{ fontSize: 10, color: '#9A9A9A' }}>{label}</span>
    </div>
  )
}

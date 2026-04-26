/* global window */
import React, { useState, useRef, useEffect } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Info,
} from 'lucide-react'
import * as turf from '@turf/turf'
import MissionMap from '../components/MissionMap'
import BigSlider from '../components/BigSlider'
import NumberStepper from '../components/NumberStepper'
import Toggle from '../components/Toggle'
import useMissions from '../hooks/useMissions'
import useWizard from '../hooks/useWizard'
import { BLUE, RED, CURRENT_BATTERY, calcMetrics, APPLICATION_OPTIONS } from '../constants'
import qualityLabel from '../utils/qualityUtils'
import { buildMission, buildMissionUpdate } from '../services/missionService'

function getInitialPhase(wizard) {
  if (wizard.polygonClosed) return 'AREA_DONE'
  if (wizard.homePoint) return 'DRAWING_AREA'
  return 'PLACING_HOME'
}

export default function EditMissionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isCreate = location.pathname.startsWith('/wizard')

  const { updateMission, addMission, setLastMissionName } = useMissions()
  const { wizard, updateWizard, resetWizard } = useWizard()
  const [activeTab, setActiveTab] = useState('map')
  const [undoStack, setUndoStack] = useState([])
  const [mapBounds, setMapBounds] = useState(null)
  const [metricsVisible, setMetricsVisible] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const phase = isCreate ? getInitialPhase(wizard) : 'AREA_DONE'
  const [showNameModal, setShowNameModal] = useState(false)
  const [guidanceOpen, setGuidanceOpen] = useState(true)
  const [settingsVisited, setSettingsVisited] = useState(!isCreate)
  const missionMapRef = useRef()
  const nameInputRef = useRef()

  useEffect(() => {
    if (wizard.polygonClosed) setMetricsVisible(true)
  }, [wizard.polygonClosed])

  useEffect(() => {
    if (isEditingName) nameInputRef.current?.focus()
  }, [isEditingName])

  if (!isCreate && !wizard.editingMission) {
    return <Navigate to="/missions" replace />
  }

  const metrics = calcMetrics(wizard.quality, wizard.highestPointMeters ?? 0)
  const polygon = wizard.areaPolygon ?? []

  // home mode only for initial placement; edit mode for everything else so home point stays draggable
  const mapMode = isCreate && phase === 'PLACING_HOME' ? 'home' : 'edit'

  const canConfirm = isCreate ? phase === 'AREA_DONE' && settingsVisited : true
  const canCreate = Boolean(nameInput.trim())

  const homeInView =
    wizard.homePoint &&
    mapBounds &&
    wizard.homePoint.lat >= mapBounds.south &&
    wizard.homePoint.lat <= mapBounds.north &&
    wizard.homePoint.lng >= mapBounds.west &&
    wizard.homePoint.lng <= mapBounds.east

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

  function openNameEdit() {
    setNameInput(wizard.name || '')
    setIsEditingName(true)
  }

  function confirmName() {
    if (nameInput.trim() !== (wizard.name || '')) {
      updateWizard({ name: nameInput.trim() })
    }
    setIsEditingName(false)
  }

  function handleSave() {
    updateMission(wizard.editingMission.id, {
      ...buildMissionUpdate(wizard),
      name: wizard.name || wizard.editingMission.name,
    })
    navigate('/missions')
  }

  function handleCreate() {
    setNameInput('')
    setShowNameModal(true)
  }

  function confirmCreate() {
    const name = nameInput.trim()
    if (!name) return
    setLastMissionName(name)
    addMission(buildMission({ ...wizard, name }))
    resetWizard()
    navigate('/wizard/ready')
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

  function getGuidanceText() {
    if (phase === 'PLACING_HOME') return 'Tap the map to set the take-off & landing point'
    if (phase === 'DRAWING_AREA') {
      if (polygon.length < 3) return 'Tap the map to add corners and outline the flight area'
      return 'Tap the first corner to close the area, or keep adding corners'
    }
    return 'Area set — open Settings to configure the flight'
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-bg-secondary">
      {/* ── Top bar ── */}
      <div
        className="relative flex items-center bg-white border-b border-border px-6 min-[300px]:px-4 flex-shrink-0"
        style={{ height: 52 }}
      >
        {/* Cancel */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              if (isCreate) {
                resetWizard()
                navigate('/')
              } else {
                navigate('/missions')
              }
            }}
            className="flex items-center gap-1.5 rounded-btn border border-border bg-white active:bg-bg-secondary transition-colors select-none"
            style={{ padding: '6px 12px', fontSize: 13, fontWeight: 600, color: '#5A5A5A' }}
          >
            <X size={14} color="#5A5A5A" strokeWidth={2.5} />
            Cancel
          </button>

          {/* Guidance toggle — only in create mode */}
          {isCreate && (
            <button
              type="button"
              onClick={() => setGuidanceOpen((v) => !v)}
              className="flex items-center justify-center rounded-btn border border-border bg-white active:bg-bg-secondary transition-colors select-none"
              style={{ padding: '9px' }}
              title={guidanceOpen ? 'Hide guide' : 'Show guide'}
            >
              <Info size={14} color={guidanceOpen ? BLUE : '#AAAAAA'} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Segmented tab toggle — centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <LayoutGroup>
            <div
              className="flex items-center pointer-events-auto rounded-btn border border-border p-0.5"
              style={{ background: '#F0F1F5', gap: 0 }}
            >
              {[
                { key: 'map', icon: Map, label: 'Flyzone' },
                { key: 'settings', icon: SlidersHorizontal, label: 'Settings' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActiveTab(key)
                    if (key === 'settings') setSettingsVisited(true)
                  }}
                  className="relative flex items-center rounded-btn select-none"
                  style={{
                    padding: '5px 16px',
                    fontSize: 13,
                    fontWeight: activeTab === key ? 700 : 500,
                    color: activeTab === key ? BLUE : '#888888',
                  }}
                >
                  {activeTab === key && (
                    <motion.div
                      layoutId="edit-tab-pill"
                      className="absolute inset-0 bg-white rounded-btn"
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon size={13} />
                    {label}
                    {key === 'settings' &&
                      isCreate &&
                      phase === 'AREA_DONE' &&
                      !settingsVisited && (
                        <motion.span
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                          style={{
                            display: 'inline-block',
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: '#F59E0B',
                            flexShrink: 0,
                          }}
                        />
                      )}
                  </span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        {/* Right action button */}
        {isCreate ? (
          <button
            type="button"
            onClick={canConfirm ? handleCreate : undefined}
            disabled={!canConfirm}
            className={`ml-auto flex items-center gap-1.5 rounded-btn select-none ${canConfirm ? 'active:scale-95 transition-transform' : ''}`}
            style={{
              background: canConfirm ? BLUE : '#E0E0E0',
              border: `1px solid ${canConfirm ? '#2D47D9' : '#D0D0D0'}`,
              padding: '6px 14px',
              boxShadow: canConfirm ? '0 2px 8px rgba(61,90,242,0.3)' : 'none',
            }}
          >
            <Plus size={14} color={canConfirm ? 'white' : '#AAAAAA'} strokeWidth={3} />
            <span
              style={{ fontSize: 13, fontWeight: 700, color: canConfirm ? 'white' : '#AAAAAA' }}
            >
              Create
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            className="ml-auto flex items-center gap-1.5 rounded-btn active:scale-95 transition-transform select-none"
            style={{
              background: BLUE,
              border: '1px solid #2D47D9',
              padding: '6px 14px',
              boxShadow: '0 2px 8px rgba(61,90,242,0.3)',
            }}
          >
            <Check size={14} color="white" strokeWidth={3} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Save</span>
          </button>
        )}
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
          <div className="flex flex-col h-full" style={{ width: '50%' }}>
            {/* Map container — fills full height; guidance floats over the map so its size never changes */}
            <div className="relative flex-1 min-h-0">
              {/* Guidance strip — absolute overlay so the map container stays full-height */}
              {isCreate && (
                <div
                  className="absolute top-0 left-0 right-0 z-10 bg-white overflow-hidden"
                  style={{
                    height: guidanceOpen ? 33 : 0,
                    borderBottom: guidanceOpen ? '1px solid #E0E0E0' : 'none',
                    transition: 'height 0.18s ease',
                  }}
                >
                  <div
                    className="relative flex items-center justify-center gap-2"
                    style={{ height: 33, paddingInline: 32 }}
                  >
                    {/* Step dots */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {[0, 1, 2].map((i) => {
                        const activeIndex =
                          phase === 'PLACING_HOME' ? 0 : phase === 'DRAWING_AREA' ? 1 : 2
                        const isDone = i < activeIndex
                        const isActive = i === activeIndex
                        return (
                          <div
                            key={i}
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              background: isDone ? '#22C55E' : isActive ? BLUE : 'transparent',
                              border: `1.5px solid ${isDone ? '#22C55E' : isActive ? BLUE : '#CCCCCC'}`,
                              transition: 'background 0.3s, border-color 0.3s',
                            }}
                          />
                        )
                      })}
                    </div>

                    {/* Text */}
                    <span
                      className="truncate"
                      style={{ fontSize: 12, fontWeight: 500, color: '#5A5A5A' }}
                    >
                      {getGuidanceText()}
                    </span>

                    {/* Close — pinned right */}
                    <button
                      type="button"
                      onClick={() => setGuidanceOpen(false)}
                      className="absolute right-3 flex items-center justify-center active:opacity-60 transition-opacity"
                      style={{ width: 20, height: 20 }}
                    >
                      <X size={12} color="#BBBBBB" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              )}

              {/* Map overlay buttons — top right, slide down with guidance strip */}
              <div
                className="absolute right-6 min-[300px]:right-4 z-10 flex gap-2"
                style={{
                  top: isCreate && guidanceOpen ? 45 : 12,
                  transition: 'top 0.18s ease',
                }}
              >
                {wizard.homePoint && !homeInView && (
                  <button
                    type="button"
                    onClick={handleGoHome}
                    className="bg-white/95 rounded-btn shadow-md border border-border active:scale-95 transition-transform flex items-center justify-center"
                    style={{ width: 44, height: 44 }}
                    title="Go to home point"
                  >
                    <Locate size={18} color="#5A5A5A" />
                  </button>
                )}
                {undoStack.length > 0 && (
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="bg-white/95 rounded-btn shadow-md border border-border active:scale-95 transition-transform flex items-center justify-center"
                    style={{ width: 44, height: 44 }}
                    title="Undo last action"
                  >
                    <Undo2 size={18} color="#5A5A5A" />
                  </button>
                )}
              </div>

              <MissionMap
                ref={missionMapRef}
                mode={mapMode}
                homePoint={wizard.homePoint}
                onHomePointChange={(pt) => handleHomePointChange(pt)}
                polygon={polygon}
                onPolygonChange={(pts) => handlePolygonChange(pts)}
                polygonClosed={wizard.polygonClosed}
                onPolygonClose={() => handlePolygonClose()}
                onBoundsChange={setMapBounds}
                className="absolute inset-0"
              />

              {/* Metrics card */}
              <AnimatePresence>
                {wizard.polygonClosed && metricsVisible && (
                  <motion.div
                    className="absolute z-10"
                    style={{ bottom: 8, left: 12 }}
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -200, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  >
                    <div
                      style={{
                        background: 'white',
                        borderRadius: 6,
                        border: '1px solid #E4E4E4',
                        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        display: 'flex',
                      }}
                    >
                      <div style={{ display: 'flex' }}>
                        <MapMetricCell value={`${metrics.flightHeight}m`} label="altitude" />
                        <div style={{ width: 1, background: '#F0F0F0', margin: '6px 0' }} />
                        <MapMetricCell value={`${metrics.flightTime} min`} label="flight" />
                        <div style={{ width: 1, background: '#F0F0F0', margin: '6px 0' }} />
                        <MapMetricCell
                          value={`−${metrics.batteryNeed}%`}
                          label="battery"
                          valueColor={metrics.feasible ? undefined : RED}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setMetricsVisible(false)}
                        className="flex items-center justify-center active:bg-gray-50 transition-colors"
                        style={{ width: 24, borderLeft: '1px solid #F0F0F0', flexShrink: 0 }}
                      >
                        <ChevronLeft size={11} color="#C8C8C8" strokeWidth={2} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {wizard.polygonClosed && !metricsVisible && (
                  <motion.button
                    type="button"
                    onClick={() => setMetricsVisible(true)}
                    className="absolute z-10 active:opacity-70 transition-opacity"
                    style={{ bottom: 8, left: 'env(safe-area-inset-left, 0px)' }}
                    initial={{ x: -38, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -38, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  >
                    <div
                      style={{
                        background: 'white',
                        borderRadius: '0 6px 6px 0',
                        border: '1px solid #E4E4E4',
                        borderLeft: 'none',
                        boxShadow: '2px 1px 6px rgba(0,0,0,0.07)',
                        width: 28,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ChevronRight size={13} color={BLUE} strokeWidth={2.5} />
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Settings panel ── */}
          <div className="h-full overflow-y-auto" style={{ width: '50%' }}>
            <div className="px-4 pt-3 pb-4 max-w-[560px] mx-auto">
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

              {/* Metrics strip */}
              <div
                className="rounded-card mb-4 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #ECEFFE 0%, #F5F7FF 100%)',
                  border: '1px solid rgba(61,90,242,0.15)',
                }}
              >
                <div className="flex">
                  <MetricCell
                    icon={<ArrowUp size={14} color={BLUE} />}
                    value={`${metrics.flightHeight}m`}
                    label="altitude"
                  />
                  <div style={{ width: 1, background: 'rgba(61,90,242,0.12)', margin: '10px 0' }} />
                  <MetricCell
                    icon={<Clock size={14} color={BLUE} />}
                    value={`${metrics.flightTime} min`}
                    label="flight time"
                  />
                  <div style={{ width: 1, background: 'rgba(61,90,242,0.12)', margin: '10px 0' }} />
                  <MetricCell
                    icon={<Battery size={14} color={metrics.feasible ? BLUE : RED} />}
                    value={`-${metrics.batteryNeed}%`}
                    label={`of ${CURRENT_BATTERY}%`}
                    valueColor={metrics.feasible ? undefined : RED}
                  />
                </div>
              </div>

              {/* Settings list */}
              <div className="bg-white rounded-card border border-border overflow-hidden">
                {/* Quality */}
                <div className="px-4 pt-3 pb-2">
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
                    trackHeight={8}
                    thumbSize={28}
                  />
                </div>

                <div className="h-px bg-border" />

                {/* Highest point */}
                <div
                  className="px-4 flex items-center gap-3"
                  style={{ minHeight: 52, paddingBlock: 12 }}
                >
                  <Mountain size={15} color={BLUE} className="flex-shrink-0" />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="font-semibold text-title" style={{ fontSize: 13 }}>
                      Highest point
                    </span>
                    <span style={{ fontSize: 11, color: '#9A9A9A', lineHeight: 1.3 }}>
                      The height of the tallest object in the flight area
                    </span>
                  </div>
                  <NumberStepper
                    value={wizard.highestPointMeters}
                    onChange={(val) => updateWizard({ highestPointMeters: val })}
                    size="sm"
                  />
                </div>

                <div className="h-px bg-border" />

                {/* RTK Precision */}
                <div
                  className="px-4 flex items-center gap-3"
                  style={{ minHeight: 52, paddingBlock: 12 }}
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
                    <span style={{ fontSize: 11, color: '#9A9A9A', lineHeight: 1.3 }}>
                      Only available for the MRR Pro drone
                    </span>
                  </div>
                  <Toggle
                    enabled={wizard.rtkEnabled}
                    onChange={(val) => updateWizard({ rtkEnabled: val })}
                  />
                </div>

                <div className="h-px bg-border" />

                {/* Application */}
                <div
                  className="px-4 flex items-center gap-3"
                  style={{ minHeight: 52, paddingBlock: 12 }}
                >
                  <Layers size={15} color={BLUE} className="flex-shrink-0" />
                  <span className="font-semibold text-title" style={{ fontSize: 13 }}>
                    Application
                  </span>
                  <div className="ml-auto relative flex-shrink-0">
                    <select
                      value={wizard.app}
                      onChange={(e) => updateWizard({ app: e.target.value })}
                      className="appearance-none bg-bg-secondary border border-border rounded-btn outline-none cursor-pointer"
                      style={{
                        fontSize: 13,
                        color: '#5A5A5A',
                        fontWeight: 500,
                        padding: '4px 28px 4px 8px',
                      }}
                    >
                      {APPLICATION_OPTIONS.map((app) => (
                        <option key={app} value={app}>
                          {app}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={13}
                      color="#9A9A9A"
                      className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Name row — edit mode only; in create mode the name is set via modal */}
                {!isCreate && (
                  <>
                    <div className="h-px bg-border" />
                    {isEditingName ? (
                      <div
                        className="flex items-center gap-2 px-4"
                        style={{ minHeight: 52, paddingBlock: 10 }}
                      >
                        <Pencil size={15} color={BLUE} className="flex-shrink-0" />
                        <input
                          ref={nameInputRef}
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') confirmName()
                          }}
                          onBlur={confirmName}
                          className="flex-1 min-w-0 bg-bg-secondary border border-border rounded-btn outline-none font-medium focus:border-primary transition-colors"
                          style={{ fontSize: 16, color: '#23262F', padding: '6px 10px' }}
                          placeholder="Mission name..."
                        />
                        <button
                          type="button"
                          onPointerDown={(e) => e.preventDefault()}
                          onClick={confirmName}
                          className="flex-shrink-0 flex items-center justify-center rounded-btn active:scale-95 transition-transform"
                          style={{ width: 32, height: 32, background: BLUE }}
                        >
                          <Check size={14} color="white" strokeWidth={2.5} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={openNameEdit}
                        className="w-full flex items-center gap-3 px-4 active:bg-bg-secondary transition-colors text-left"
                        style={{ minHeight: 52, paddingBlock: 12 }}
                      >
                        <Pencil size={15} color={BLUE} className="flex-shrink-0" />
                        <span
                          className="font-semibold text-title flex-shrink-0"
                          style={{ fontSize: 13 }}
                        >
                          Name
                        </span>
                        <span
                          className="ml-auto font-medium truncate"
                          style={{
                            fontSize: 13,
                            color: wizard.name ? '#5A5A5A' : '#C4C4C4',
                            maxWidth: '55%',
                          }}
                        >
                          {wizard.name || 'Add name...'}
                        </span>
                        <ChevronRight size={13} color="#D0D0D0" className="flex-shrink-0" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Name modal — create mode only ── */}
      {isCreate && (
        <AnimatePresence>
          {showNameModal && (
            <motion.div className="absolute inset-0 z-50 flex items-end overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowNameModal(false)}
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
                      onClick={() => setShowNameModal(false)}
                      className="flex items-center justify-center rounded-btn bg-bg-secondary active:scale-95 transition-transform"
                      style={{ width: 28, height: 28 }}
                    >
                      <X size={14} color="#5A5A5A" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmCreate()
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
                          area
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: '#23262F',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {wizard.areaHectares != null ? `${wizard.areaHectares} ha` : '—'}
                        </span>
                      </div>
                      <div
                        style={{ width: 1, background: 'rgba(61,90,242,0.10)', margin: '8px 0' }}
                      />
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
                          altitude
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: '#23262F',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {metrics.flightHeight}m
                        </span>
                      </div>
                      <div
                        style={{ width: 1, background: 'rgba(61,90,242,0.10)', margin: '8px 0' }}
                      />
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
                          flight
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: '#23262F',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {metrics.flightTime} min
                        </span>
                      </div>
                      <div
                        style={{ width: 1, background: 'rgba(61,90,242,0.10)', margin: '8px 0' }}
                      />
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
                          battery
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            color: metrics.feasible ? '#23262F' : RED,
                          }}
                        >
                          −{metrics.batteryNeed}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={confirmCreate}
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
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: canCreate ? 'white' : '#AAAAAA',
                      }}
                    >
                      Create Mission
                    </span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

function MapMetricCell({ value, label, valueColor }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '9px 10px',
        gap: 2,
        minWidth: 44,
      }}
    >
      <span
        style={{
          fontSize: 8,
          fontWeight: 700,
          color: '#C4C4C4',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: valueColor || '#23262F',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}
      >
        {value}
      </span>
    </div>
  )
}

function MetricCell({ icon, value, label, valueColor }) {
  return (
    <div className="flex-1 flex flex-col items-center py-3 gap-0.5">
      {icon}
      <span
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: valueColor || '#23262F',
          letterSpacing: '-0.02em',
          lineHeight: 1.25,
          marginTop: 2,
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: 10, fontWeight: 500, color: '#9A9AB0', letterSpacing: '0.04em' }}>
        {label}
      </span>
    </div>
  )
}

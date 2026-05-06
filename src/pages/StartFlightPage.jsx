import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Clock, Battery, Info, ChevronUp, Settings, Play, MapPin, Plus } from 'lucide-react'
import MissionMap from '../components/MissionMap'
import PageHeader from '../components/PageHeader'
import useMissions from '../hooks/useMissions'
import useWizard from '../hooks/useWizard'
import { calcMetrics, BLUE, RED, GREEN } from '../constants'
import mockDrones from '../data/mockDrones'

const connectedDrones = mockDrones.filter((d) => d.connected)
const isSingleDrone = connectedDrones.length === 1

function NewMissionButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-1.5 rounded-card active:scale-[0.98] hover:bg-[#F8F9FF] hover:border-[rgba(61,90,242,0.4)] transition-colors"
      style={{
        marginTop: 6,
        padding: '10px',
        border: '1.5px dashed #D8D8D8',
        background: 'white',
        fontSize: 12.5,
        fontWeight: 600,
        color: '#B0B0B0',
        cursor: 'pointer',
      }}
    >
      <Plus size={13} strokeWidth={2.5} />
      New Mission
    </button>
  )
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: '#ABABAB',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  )
}

export default function StartFlightPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { missions, setLastMissionName } = useMissions()
  const { startEditWizard, startNewWizard } = useWizard()
  const mobileScrollRef = useRef(null)
  const missionRefs = useRef({})

  const [selectedMissionId, setSelectedMissionId] = useState(
    location.state?.selectedMissionId ?? null,
  )
  const [selectedDroneId, setSelectedDroneId] = useState(null)
  const [openDetailId, setOpenDetailId] = useState(null)

  useEffect(() => {
    if (connectedDrones.length === 1) setSelectedDroneId(connectedDrones[0].id)
  }, [])

  const selectedMission = missions.find((m) => m.id === selectedMissionId) ?? null
  const selectedDrone = mockDrones.find((d) => d.id === selectedDroneId) ?? null
  const canStart = selectedMissionId !== null && selectedDroneId !== null

  function handleNewMission() {
    startNewWizard()
    navigate('/wizard/step1')
  }

  function handleEditMission(mission) {
    startEditWizard(mission)
    navigate('/missions/edit', {
      state: { from: '/start-flight', missionId: mission.id },
    })
  }

  function handleStart() {
    if (!canStart || !selectedMission) return
    setLastMissionName(selectedMission.name)
    navigate('/wizard/ready')
  }

  function toggleDetail(id) {
    const isOpening = openDetailId !== id
    setOpenDetailId((prev) => (prev === id ? null : id))

    if (isOpening) {
      if (selectedMissionId !== id) setSelectedMissionId(null)
      setTimeout(() => {
        const el = missionRefs.current[id]
        if (el && mobileScrollRef.current) {
          const container = mobileScrollRef.current
          const containerRect = container.getBoundingClientRect()
          const elRect = el.getBoundingClientRect()
          container.scrollTo({
            top: elRect.top - containerRect.top + container.scrollTop,
            behavior: 'smooth',
          })
        }
      }, 50)
    }
  }

  const mobileStartButton = (
    <button
      type="button"
      onClick={handleStart}
      disabled={!canStart}
      className="flex items-center gap-1.5 rounded-btn active:scale-95 z-10"
      style={{
        padding: '7px 14px',
        background: canStart ? BLUE : '#EBEBEB',
        border: canStart ? '1px solid #2D47D9' : '1px solid #D8D8D8',
        cursor: canStart ? 'pointer' : 'not-allowed',
        boxShadow: canStart ? '0 2px 8px rgba(61,90,242,0.25)' : 'none',
        transition: 'background 0.2s, box-shadow 0.2s, border-color 0.2s',
      }}
    >
      <Play
        size={13}
        color={canStart ? 'white' : '#B8B8B8'}
        fill={canStart ? 'white' : '#B8B8B8'}
        strokeWidth={0}
      />
      <span style={{ fontSize: 13, fontWeight: 700, color: canStart ? 'white' : '#B8B8B8' }}>
        Start Flight
      </span>
    </button>
  )

  return (
    <>
      {/* ══ Mobile layout (< lg) ══ */}
      <div className="w-full h-full flex flex-col bg-bg-secondary lg:hidden">
        <PageHeader
          title="Select a Mission"
          onBack={() => navigate('/')}
          right={mobileStartButton}
        />

        <div ref={mobileScrollRef} className="flex-1 overflow-y-auto min-h-0 flex flex-col">
          {/* Multi-drone selector */}
          {!isSingleDrone && (
            <div className="flex-shrink-0 bg-white border-b border-border px-3 py-2">
              <div className="w-full max-w-[560px] mx-auto">
                <SectionLabel>Drone</SectionLabel>
                <div className="flex gap-2">
                  {mockDrones.map((drone) => {
                    const sel = drone.id === selectedDroneId
                    return (
                      <button
                        key={drone.id}
                        type="button"
                        onClick={() => setSelectedDroneId(drone.id)}
                        className="flex items-center gap-2.5 flex-1 rounded-btn transition-all text-left"
                        style={{
                          padding: '8px 12px',
                          background: sel ? '#EEF1FE' : '#F4F4F4',
                          border: `1.5px solid ${sel ? BLUE : '#E4E4E4'}`,
                        }}
                      >
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: drone.connected ? GREEN : '#CBCBCB',
                            flexShrink: 0,
                          }}
                        />
                        <span
                          className="font-semibold text-title flex-1 truncate"
                          style={{ fontSize: 13 }}
                        >
                          {drone.name}
                        </span>
                        <span
                          className="flex items-center gap-1 flex-shrink-0"
                          style={{ fontSize: 12, color: '#5A5A5A' }}
                        >
                          <Battery size={12} color="#5A5A5A" />
                          {drone.droneBattery}%
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Single drone indicator */}
          {isSingleDrone && selectedDrone && (
            <div
              className="flex-shrink-0 bg-white border-b border-border px-3"
              style={{ paddingTop: 8, paddingBottom: 8 }}
            >
              <div className="flex items-center justify-center gap-2">
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: selectedDrone.connected ? GREEN : '#CBCBCB',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: '#5A5A5A' }}>Flying with</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#23262F' }}>
                  {selectedDrone.name}
                </span>
                <span
                  className="flex items-center gap-1"
                  style={{ fontSize: 12, color: '#5A5A5A' }}
                >
                  <Battery size={12} color="#5A5A5A" style={{ position: 'relative', top: -1 }} />
                  <span style={{ position: 'relative', top: -1 }}>
                    {selectedDrone.droneBattery}%
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Missions section */}
          <div className="px-3 py-2.5">
            <div className="w-full max-w-[560px] mx-auto">
              <SectionLabel>Mission</SectionLabel>

              <div className="flex flex-col gap-1.5">
                {missions.map((mission) => {
                  const m = calcMetrics(mission.quality, mission.highestPointMeters)
                  const selected = mission.id === selectedMissionId
                  const detailOpen = mission.id === openDetailId

                  return (
                    <div
                      key={mission.id}
                      ref={(el) => {
                        missionRefs.current[mission.id] = el
                      }}
                      className="rounded-card overflow-hidden"
                      style={{
                        border: `1.5px solid ${selected ? BLUE : '#E4E4E4'}`,
                        boxShadow: selected
                          ? '0 1px 8px rgba(61,90,242,0.12)'
                          : '0 1px 3px rgba(0,0,0,0.04)',
                        background: 'white',
                      }}
                    >
                      <div className="flex items-stretch">
                        <button
                          type="button"
                          onClick={() => {
                            if (openDetailId !== mission.id) setOpenDetailId(null)
                            setSelectedMissionId((prev) =>
                              prev === mission.id ? null : mission.id,
                            )
                          }}
                          className="flex items-center gap-3 flex-1 min-w-0 text-left transition-colors"
                          style={{
                            padding: '13px 12px',
                            background: selected ? '#EEF1FE' : 'transparent',
                          }}
                        >
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              border: `2px solid ${selected ? BLUE : '#D0D0D0'}`,
                              background: selected ? BLUE : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              transition: 'all 0.15s',
                            }}
                          />
                          <span
                            className="font-bold text-title truncate flex-1"
                            style={{ fontSize: 14 }}
                          >
                            {mission.name}
                          </span>
                          <span
                            className="flex items-center gap-1 flex-shrink-0"
                            style={{ fontSize: 12, color: '#5A5A5A' }}
                          >
                            <Clock size={13} color="#888" />
                            {m.flightTime} min
                          </span>
                          <span style={{ fontSize: 12, color: '#D8D8D8', flexShrink: 0 }}>·</span>
                          <span
                            className="flex items-center gap-1 flex-shrink-0 font-semibold"
                            style={{ fontSize: 12, color: m.feasible ? '#5A5A5A' : RED }}
                          >
                            <Battery size={13} color={m.feasible ? '#888' : RED} />-{m.batteryNeed}%
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleDetail(mission.id)}
                          className="flex items-center justify-center flex-shrink-0 transition-colors"
                          style={{
                            width: 50,
                            borderLeft: `1px solid ${selected ? 'rgba(61,90,242,0.15)' : '#F0F0F0'}`,
                            background: detailOpen
                              ? 'rgba(61,90,242,0.06)'
                              : selected
                                ? '#EEF1FE'
                                : 'transparent',
                            color: detailOpen ? BLUE : '#ABABAB',
                          }}
                        >
                          {detailOpen ? <ChevronUp size={17} /> : <Info size={17} />}
                        </button>
                      </div>

                      {detailOpen && (
                        <div
                          className="relative overflow-hidden"
                          style={{
                            height: 190,
                            borderTop: `1px solid ${selected ? 'rgba(61,90,242,0.12)' : '#F0F0F0'}`,
                          }}
                        >
                          <MissionMap
                            mode="readonly"
                            homePoint={mission.homePoint}
                            polygon={mission.polygon ?? []}
                            polygonClosed={mission.polygonClosed ?? false}
                            showControls={false}
                            initialCenter={
                              mission.homePoint
                                ? {
                                    lat: mission.homePoint.lat,
                                    lng: mission.homePoint.lng,
                                    zoom: 14,
                                  }
                                : null
                            }
                            className="absolute inset-0"
                          />
                          <button
                            type="button"
                            onClick={() => handleEditMission(mission)}
                            className="absolute flex items-center gap-1.5 rounded-btn active:scale-95 transition-transform"
                            style={{
                              bottom: 8,
                              right: 8,
                              padding: '6px 14px',
                              background: 'white',
                              border: '1.5px solid #D8D8D8',
                              fontSize: 13,
                              fontWeight: 600,
                              color: '#23262F',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                            }}
                          >
                            <Settings
                              size={13}
                              color="#5A5A5A"
                              style={{ position: 'relative', top: -1 }}
                            />
                            Edit Mission
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <NewMissionButton onClick={() => handleNewMission()} />
            </div>
          </div>
        </div>
      </div>

      {/* ══ Desktop layout (≥ lg) ══ */}
      <div className="w-full h-full hidden lg:flex">
        {/* Left panel */}
        <div
          className="flex flex-col bg-white border-r border-border flex-shrink-0"
          style={{ width: 400 }}
        >
          {/* Panel header */}
          <div className="px-6 py-5 border-b border-border flex-shrink-0">
            <h1
              className="font-bold text-title"
              style={{ fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1.2 }}
            >
              Select a Mission
            </h1>
            <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
              Choose a saved mission to send to the drone
            </p>
          </div>

          {/* Drone status */}
          {isSingleDrone && selectedDrone && (
            <div
              className="flex items-center gap-2.5 px-6 border-b border-border flex-shrink-0"
              style={{ paddingTop: 10, paddingBottom: 10 }}
            >
              <div
                className={selectedDrone.connected ? 'pulse-soft' : ''}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: selectedDrone.connected ? GREEN : '#CBCBCB',
                  flexShrink: 0,
                  boxShadow: selectedDrone.connected ? '0 0 0 3px rgba(34,197,94,0.15)' : 'none',
                }}
              />
              <span style={{ fontSize: 13, color: '#5A5A5A' }}>Flying with</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#23262F' }}>
                {selectedDrone.name}
              </span>
              <div
                className="ml-auto flex items-center gap-1"
                style={{ fontSize: 12, color: '#5A5A5A' }}
              >
                <Battery size={13} color="#888" style={{ position: 'relative', top: -1 }} />
                <span style={{ position: 'relative', top: -1 }}>{selectedDrone.droneBattery}%</span>
              </div>
            </div>
          )}
          {!isSingleDrone && (
            <div className="px-4 py-3 border-b border-border flex-shrink-0">
              <SectionLabel>Drone</SectionLabel>
              <div className="flex gap-2">
                {mockDrones.map((drone) => {
                  const sel = drone.id === selectedDroneId
                  return (
                    <button
                      key={drone.id}
                      type="button"
                      onClick={() => setSelectedDroneId(drone.id)}
                      className="flex items-center gap-2.5 flex-1 rounded-btn transition-all text-left"
                      style={{
                        padding: '8px 12px',
                        background: sel ? '#EEF1FE' : '#F4F4F4',
                        border: `1.5px solid ${sel ? BLUE : '#E4E4E4'}`,
                      }}
                    >
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: drone.connected ? GREEN : '#CBCBCB',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="font-semibold text-title flex-1 truncate"
                        style={{ fontSize: 13 }}
                      >
                        {drone.name}
                      </span>
                      <span
                        className="flex items-center gap-1 flex-shrink-0"
                        style={{ fontSize: 12, color: '#5A5A5A' }}
                      >
                        <Battery size={12} color="#5A5A5A" />
                        {drone.droneBattery}%
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Mission list */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="px-4 py-3">
              <SectionLabel>Mission</SectionLabel>
              <div className="flex flex-col gap-1.5">
                {missions.map((mission) => {
                  const m = calcMetrics(mission.quality, mission.highestPointMeters)
                  const selected = mission.id === selectedMissionId
                  return (
                    <button
                      key={mission.id}
                      type="button"
                      onClick={() =>
                        setSelectedMissionId((prev) => (prev === mission.id ? null : mission.id))
                      }
                      className="w-full rounded-card text-left transition-all"
                      style={{
                        padding: '12px 14px',
                        border: `1.5px solid ${selected ? BLUE : '#E4E4E4'}`,
                        background: selected ? '#EEF1FE' : 'white',
                        boxShadow: selected
                          ? '0 1px 8px rgba(61,90,242,0.12)'
                          : '0 1px 3px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            border: `2px solid ${selected ? BLUE : '#D0D0D0'}`,
                            background: selected ? BLUE : 'transparent',
                            flexShrink: 0,
                            transition: 'all 0.15s',
                          }}
                        />
                        <span
                          className="font-bold text-title flex-1 truncate"
                          style={{ fontSize: 14 }}
                        >
                          {mission.name}
                        </span>
                        <span
                          className="flex items-center gap-1 flex-shrink-0"
                          style={{ fontSize: 12, color: '#5A5A5A' }}
                        >
                          <Clock size={12} color="#888" />
                          {m.flightTime} min
                        </span>
                        <span style={{ fontSize: 12, color: '#D8D8D8', flexShrink: 0 }}>·</span>
                        <span
                          className="flex items-center gap-1 flex-shrink-0 font-semibold"
                          style={{ fontSize: 12, color: m.feasible ? '#5A5A5A' : RED }}
                        >
                          <Battery size={12} color={m.feasible ? '#888' : RED} />-{m.batteryNeed}%
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
              <NewMissionButton onClick={() => handleNewMission()} />
            </div>
          </div>

          {/* Start button */}
          <div className="px-4 py-4 border-t border-border flex-shrink-0">
            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
              className="w-full flex items-center justify-center gap-2 rounded-btn active:scale-95 transition-transform"
              style={{
                padding: '11px 20px',
                background: canStart ? BLUE : '#EBEBEB',
                border: canStart ? '1px solid #2D47D9' : '1px solid #D8D8D8',
                cursor: canStart ? 'pointer' : 'not-allowed',
                boxShadow: canStart ? '0 3px 10px rgba(61,90,242,0.28)' : 'none',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
            >
              <Play
                size={14}
                color={canStart ? 'white' : '#B8B8B8'}
                fill={canStart ? 'white' : '#B8B8B8'}
                strokeWidth={0}
              />
              <span
                style={{ fontSize: 14, fontWeight: 700, color: canStart ? 'white' : '#B8B8B8' }}
              >
                Start Flight
              </span>
            </button>
            {!canStart && (
              <p className="text-center" style={{ fontSize: 11, color: '#ABABAB', marginTop: 8 }}>
                {selectedMissionId === null ? 'Select a mission above' : 'Select a drone above'}
              </p>
            )}
          </div>
        </div>

        {/* Right panel — map preview */}
        <div className="flex-1 relative overflow-hidden bg-[#EEF0F4]">
          {selectedMission ? (
            <>
              <MissionMap
                mode="readonly"
                homePoint={selectedMission.homePoint}
                polygon={selectedMission.polygon ?? []}
                polygonClosed={selectedMission.polygonClosed ?? false}
                showControls={false}
                initialCenter={
                  selectedMission.homePoint
                    ? {
                        lat: selectedMission.homePoint.lat,
                        lng: selectedMission.homePoint.lng,
                        zoom: 14,
                      }
                    : null
                }
                className="absolute inset-0"
              />
              {/* Edit button */}
              <button
                type="button"
                onClick={() => handleEditMission(selectedMission)}
                className="absolute flex items-center gap-1.5 rounded-btn active:scale-95 transition-transform"
                style={{
                  bottom: 16,
                  right: 16,
                  padding: '7px 14px',
                  background: 'white',
                  border: '1.5px solid #D8D8D8',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#23262F',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.18)',
                }}
              >
                <Settings size={13} color="#5A5A5A" style={{ position: 'relative', top: -1 }} />
                Edit Mission
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: 'rgba(61,90,242,0.08)',
                  borderRadius: 16,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <MapPin size={26} color={BLUE} strokeWidth={1.75} />
              </div>
              <div className="text-center">
                <div className="font-semibold text-title" style={{ fontSize: 15 }}>
                  No mission selected
                </div>
                <div style={{ fontSize: 13, color: '#888', marginTop: 5, maxWidth: 240 }}>
                  Select a mission from the list to preview it on the map
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

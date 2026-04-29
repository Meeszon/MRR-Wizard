/* global window, ResizeObserver */
import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react'
import Map, { Marker, Source, Layer } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'
import { distance as turfDistance, midpoint as turfMidpoint, point as turfPoint } from '@turf/turf'
import { motion } from 'framer-motion'
import { Home, Plus, Minus, Check } from 'lucide-react'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const PRIMARY = '#3D5AF2'
const GREEN = '#22C55E'

const MissionMap = forwardRef(
  (
    {
      mode = 'home',
      homePoint = null,
      onHomePointChange,
      polygon = [],
      onPolygonChange,
      polygonClosed = false,
      onPolygonClose,
      onBoundsChange,
      initialCenter = null,
      showControls = true,
      className = '',
    },
    ref,
  ) => {
    const [mapStyle, setMapStyle] = useState(
      () => window.localStorage.getItem('mapStyle') ?? 'streets-v11',
    )

    const mapRef = useRef()
    const containerRef = useRef()
    const isDraggingRef = useRef(false)
    const pendingCenterRef = useRef(null)
    const mapLoadedRef = useRef(false)

    useEffect(() => {
      const el = containerRef.current
      if (!el) return undefined
      const ro = new ResizeObserver(() => {
        mapRef.current?.resize()
      })
      ro.observe(el)
      return () => ro.disconnect()
    }, [])

    useImperativeHandle(ref, () => ({
      flyTo(center, zoom = 16) {
        mapRef.current?.flyTo({ center, zoom, duration: 1200 })
      },
      resize() {
        mapRef.current?.resize()
      },
    }))

    // Call getCurrentPosition from a React effect — this is the main browser JS thread,
    // which is the only context where the browser will show a location permission prompt.
    // Skip when an explicit initialCenter is provided — no need to overwrite it.
    useEffect(() => {
      if (initialCenter) return
      if (!window.navigator.geolocation) return
      window.navigator.geolocation.getCurrentPosition(
        (pos) => {
          const center = [pos.coords.longitude, pos.coords.latitude]
          if (mapLoadedRef.current && mapRef.current) {
            mapRef.current.flyTo({ center, zoom: 16, duration: 1500 })
          } else {
            pendingCenterRef.current = center
          }
        },
        () => {},
        { enableHighAccuracy: false },
      )
    }, [])

    useEffect(() => {
      window.localStorage.setItem('mapStyle', mapStyle)
    }, [mapStyle])

    function fireBoundsChange(mapInstance) {
      if (!onBoundsChange || !mapInstance) return
      const b = mapInstance.getBounds()
      onBoundsChange({
        west: b.getWest(),
        south: b.getSouth(),
        east: b.getEast(),
        north: b.getNorth(),
      })
    }

    function handleMapLoad(e) {
      mapLoadedRef.current = true
      if (pendingCenterRef.current && mapRef.current) {
        mapRef.current.flyTo({ center: pendingCenterRef.current, zoom: 16, duration: 1500 })
        pendingCenterRef.current = null
      }
      fireBoundsChange(e.target)
    }

    function handleMoveEnd(e) {
      fireBoundsChange(e.target)
    }

    const handleMapClick = useCallback(
      (e) => {
        if (isDraggingRef.current) return
        if (mode === 'home') {
          onHomePointChange?.({ lat: e.lngLat.lat, lng: e.lngLat.lng })
        } else if (mode === 'area' && !polygonClosed) {
          onPolygonChange?.([...polygon, { lat: e.lngLat.lat, lng: e.lngLat.lng }])
        } else if (mode === 'edit') {
          if (!homePoint) {
            onHomePointChange?.({ lat: e.lngLat.lat, lng: e.lngLat.lng })
          } else if (!polygonClosed) {
            onPolygonChange?.([...polygon, { lat: e.lngLat.lat, lng: e.lngLat.lng }])
          }
        }
      },
      [mode, polygon, polygonClosed, homePoint, onHomePointChange, onPolygonChange],
    )

    function handleInsertMidpoint(afterIndex) {
      const p1 = polygon[afterIndex]
      const p2 = polygon[(afterIndex + 1) % polygon.length]
      const mid = turfMidpoint(turfPoint([p1.lng, p1.lat]), turfPoint([p2.lng, p2.lat]))
      const newPt = { lat: mid.geometry.coordinates[1], lng: mid.geometry.coordinates[0] }
      const newPoly = [...polygon.slice(0, afterIndex + 1), newPt, ...polygon.slice(afterIndex + 1)]
      onPolygonChange?.(newPoly)
    }

    const coords = useMemo(() => polygon.map((p) => [p.lng, p.lat]), [polygon])
    const canClose = !polygonClosed && polygon.length >= 3
    const isInteractive = mode !== 'readonly'

    const lineFeatures = useMemo(() => {
      if (coords.length < 2 || polygonClosed) return []
      const features = []
      for (let i = 0; i < coords.length - 1; i += 1) {
        features.push({
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [coords[i], coords[i + 1]] },
        })
      }
      return features
    }, [coords, polygonClosed])

    const fillData = useMemo(
      () =>
        polygonClosed && polygon.length >= 3
          ? {
              type: 'Feature',
              properties: {},
              geometry: { type: 'Polygon', coordinates: [[...coords, coords[0]]] },
            }
          : null,
      [polygonClosed, polygon.length, coords],
    )

    const midpoints = useMemo(() => {
      if (mode !== 'area' && mode !== 'edit') return []
      if (polygon.length < 2) return []
      const segCount = polygonClosed ? polygon.length : polygon.length - 1
      const pts = []
      for (let i = 0; i < segCount; i += 1) {
        const p1 = polygon[i]
        const p2 = polygon[(i + 1) % polygon.length]
        const mid = turfMidpoint(turfPoint([p1.lng, p1.lat]), turfPoint([p2.lng, p2.lat]))
        pts.push({
          key: `mp-${i}`,
          mp: { lat: mid.geometry.coordinates[1], lng: mid.geometry.coordinates[0] },
          dist: Math.round(
            turfDistance(turfPoint([p1.lng, p1.lat]), turfPoint([p2.lng, p2.lat]), {
              units: 'meters',
            }),
          ),
          afterIndex: i,
        })
      }
      return pts
    }, [mode, polygon, polygonClosed])

    return (
      <div
        ref={containerRef}
        className={className}
        style={{ cursor: isInteractive ? 'crosshair' : 'default' }}
      >
        <Map
          ref={mapRef}
          mapLib={mapboxgl}
          initialViewState={
            initialCenter
              ? {
                  longitude: initialCenter.lng,
                  latitude: initialCenter.lat,
                  zoom: initialCenter.zoom ?? 15,
                }
              : { longitude: 5.29, latitude: 52.13, zoom: 7 }
          }
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
          onClick={isInteractive ? handleMapClick : undefined}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
          antialias={false}
          preserveDrawingBuffer={false}
          failIfMajorPerformanceCaveat={false}
          onLoad={(e) => handleMapLoad(e)}
          onMoveEnd={(e) => handleMoveEnd(e)}
        >
          {/* Bottom-right controls: style toggle + zoom in/out */}
          {showControls &&
            (() => {
              const nextStyle = mapStyle === 'streets-v11' ? 'satellite-streets-v11' : 'streets-v11'
              return (
                <div className="absolute z-10 flex flex-col gap-2 bottom-2 right-6 min-[300px]:right-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setMapStyle(nextStyle)
                    }}
                    className="bg-white/95 rounded-btn shadow-md border border-border active:scale-95 transition-transform overflow-hidden"
                    style={{ width: 44, height: 44 }}
                  >
                    <img
                      src={`https://api.mapbox.com/styles/v1/mapbox/${nextStyle}/static/5.29,52.13,10/88x88?access_token=${MAPBOX_TOKEN}`}
                      alt={nextStyle.includes('satellite') ? 'Satellite' : 'Map'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </button>
                  <div className="bg-white/95 rounded-btn shadow-md border border-border overflow-hidden flex flex-col">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        mapRef.current?.zoomIn()
                      }}
                      className="flex items-center justify-center active:bg-gray-100 transition-colors"
                      style={{ width: 44, height: 44 }}
                    >
                      <Plus size={18} color="#5A5A5A" strokeWidth={2} />
                    </button>
                    <div className="bg-border" style={{ height: 1 }} />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        mapRef.current?.zoomOut()
                      }}
                      className="flex items-center justify-center active:bg-gray-100 transition-colors"
                      style={{ width: 44, height: 44 }}
                    >
                      <Minus size={18} color="#5A5A5A" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              )
            })()}

          {/* Polygon fill + stroke (shown only when closed) */}
          {fillData && (
            <Source id="poly-fill" type="geojson" data={fillData}>
              <Layer
                id="poly-fill-layer"
                type="fill"
                paint={{ 'fill-color': PRIMARY, 'fill-opacity': 0.1 }}
              />
              <Layer
                id="poly-stroke-layer"
                type="line"
                paint={{ 'line-color': PRIMARY, 'line-width': 2, 'line-opacity': 0.55 }}
              />
            </Source>
          )}

          {/* Blue dashed lines while polygon is open */}
          {lineFeatures.length > 0 && (
            <Source
              id="poly-lines"
              type="geojson"
              data={{ type: 'FeatureCollection', features: lineFeatures }}
            >
              <Layer
                id="poly-lines-layer"
                type="line"
                paint={{
                  'line-color': PRIMARY,
                  'line-width': 2,
                  'line-opacity': 0.65,
                  'line-dasharray': [4, 3],
                }}
              />
            </Source>
          )}

          {/* Midpoint markers with distance label and insert button */}
          {midpoints.map(({ key, mp, dist, afterIndex }) => (
            <Marker key={key} longitude={mp.lng} latitude={mp.lat} anchor="center">
              <button
                type="button"
                className="relative group"
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleInsertMidpoint(afterIndex)
                }}
              >
                {/* Extended touch target */}
                <div className="absolute -inset-4" />

                {/* Distance pill */}
                <div
                  className="absolute pointer-events-none whitespace-nowrap group-hover:-translate-y-0.5 transition-transform duration-150"
                  style={{
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: 6,
                    background: 'rgba(23,25,35,0.80)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 20,
                    letterSpacing: '0.03em',
                  }}
                >
                  {dist}m
                </div>

                {/* Insert button */}
                <motion.div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'white',
                    border: `1.5px solid ${PRIMARY}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={11} color={PRIMARY} strokeWidth={2.5} />
                </motion.div>
              </button>
            </Marker>
          ))}

          {/* Polygon vertex markers */}
          {(mode === 'area' || mode === 'readonly' || mode === 'edit') &&
            polygon.map((pt, i) => {
              const isFirst = i === 0
              const isCloseable = isFirst && canClose
              const isDraggableVertex = mode === 'edit' || (mode === 'area' && !polygonClosed)
              return (
                <Marker
                  key={`v-${pt.lat}-${pt.lng}`}
                  longitude={pt.lng}
                  latitude={pt.lat}
                  anchor="center"
                  draggable={isDraggableVertex}
                  onDragStart={() => {
                    isDraggingRef.current = true
                  }}
                  onDragEnd={(e) => {
                    setTimeout(() => {
                      isDraggingRef.current = false
                    }, 100)
                    if (mode === 'area' || mode === 'edit') {
                      const updated = [...polygon]
                      updated[i] = { lat: e.lngLat.lat, lng: e.lngLat.lng }
                      onPolygonChange?.(updated)
                    }
                  }}
                  onClick={(e) => {
                    e.originalEvent.stopPropagation()
                    if (isCloseable) onPolygonClose?.()
                  }}
                >
                  {/* 44×44 touch target */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isCloseable ? 'pointer' : isDraggableVertex ? 'grab' : 'default',
                    }}
                  >
                    {isCloseable ? (
                      /* First vertex in closeable state — green with checkmark + pulsing ring */
                      <div style={{ position: 'relative', width: 26, height: 26 }}>
                        {/* Pulsing ring */}
                        <motion.div
                          style={{
                            position: 'absolute',
                            top: -9,
                            left: -9,
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            border: `2px solid ${GREEN}`,
                            pointerEvents: 'none',
                          }}
                          animate={{ opacity: [0, 0.65, 0], scale: [0.75, 1.1, 0.75] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: '50%',
                            background: GREEN,
                            border: '2.5px solid white',
                            boxShadow: '0 2px 12px rgba(34,197,94,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Check size={12} color="white" strokeWidth={3} />
                        </motion.div>
                      </div>
                    ) : (
                      /* Normal vertex — solid blue circle with white border */
                      <motion.div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: PRIMARY,
                          border: '2.5px solid white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.28)',
                        }}
                        whileHover={isDraggableVertex ? { scale: 1.25 } : undefined}
                        whileTap={isDraggableVertex ? { scale: 0.9 } : undefined}
                      />
                    )}
                  </div>
                </Marker>
              )
            })}

          {/* Home point marker */}
          {homePoint && (
            <Marker
              longitude={homePoint.lng}
              latitude={homePoint.lat}
              anchor="center"
              draggable={mode === 'home' || mode === 'edit'}
              onDragStart={() => {
                isDraggingRef.current = true
              }}
              onDragEnd={(e) => {
                setTimeout(() => {
                  isDraggingRef.current = false
                }, 100)
                onHomePointChange?.({ lat: e.lngLat.lat, lng: e.lngLat.lng })
              }}
            >
              {/* 44×44 touch target */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: mode === 'home' || mode === 'edit' ? 'grab' : 'default',
                }}
              >
                <motion.div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: PRIMARY,
                    border: '3px solid white',
                    boxShadow: '0 3px 14px rgba(61,90,242,0.45), 0 1px 4px rgba(0,0,0,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  whileHover={{ scale: 1.1, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.93 }}
                >
                  <Home size={15} strokeWidth={2.5} color="white" />
                </motion.div>
              </div>
            </Marker>
          )}
        </Map>
      </div>
    )
  },
)

export default MissionMap

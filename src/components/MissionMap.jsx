/* global window */
import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react'
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'
import { distance as turfDistance, midpoint as turfMidpoint, point as turfPoint } from '@turf/turf'
import { motion } from 'framer-motion'
import { Home, MapPin, Plus } from 'lucide-react'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

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
      className = '',
    },
    ref,
  ) => {
    const [mapStyle, setMapStyle] = useState(
      () => window.localStorage.getItem('mapStyle') ?? 'streets-v11',
    )

    const mapRef = useRef()
    const isDraggingRef = useRef(false)
    // Holds coords if geolocation resolves before the map finishes loading
    const pendingCenterRef = useRef(null)
    const mapLoadedRef = useRef(false)

    useImperativeHandle(ref, () => ({
      flyTo(center, zoom = 16) {
        mapRef.current?.flyTo({ center, zoom, duration: 1200 })
      },
    }))

    // Call getCurrentPosition from a React effect — this is the main browser JS thread,
    // which is the only context where the browser will show a location permission prompt.
    // Calling it from inside a Mapbox onLoad callback (a Mapbox-internal event) does not
    // reliably trigger the prompt in all browsers.
    useEffect(() => {
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

    function handleMapLoad() {
      mapLoadedRef.current = true
      if (pendingCenterRef.current && mapRef.current) {
        mapRef.current.flyTo({ center: pendingCenterRef.current, zoom: 16, duration: 1500 })
        pendingCenterRef.current = null
      }
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
      <div className={className} style={{ cursor: isInteractive ? 'crosshair' : 'default' }}>
        <Map
          ref={mapRef}
          mapLib={mapboxgl}
          initialViewState={{ longitude: 5.29, latitude: 52.13, zoom: 7 }}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
          onClick={isInteractive ? handleMapClick : undefined}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
          antialias={false}
          preserveDrawingBuffer={false}
          failIfMajorPerformanceCaveat={false}
          onLoad={() => handleMapLoad()}
        >
          <NavigationControl position="bottom-right" showCompass={false} />

          {/* Style toggle — single button showing the OTHER style, sits above +/- controls */}
          {(() => {
            const nextStyle = mapStyle === 'streets-v11' ? 'satellite-streets-v11' : 'streets-v11'
            return (
              <div className="absolute z-10" style={{ bottom: 80, right: 10 }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setMapStyle(nextStyle)
                  }}
                  className="overflow-hidden active:scale-95 transition-transform"
                  style={{
                    width: 29,
                    height: 29,
                    borderRadius: 4,
                    border: '2px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    display: 'block',
                  }}
                >
                  <img
                    src={`https://api.mapbox.com/styles/v1/mapbox/${nextStyle}/static/5.29,52.13,10/58x58?access_token=${MAPBOX_TOKEN}`}
                    alt={nextStyle.includes('satellite') ? 'Satelliet' : 'Kaart'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </button>
              </div>
            )
          })()}

          {/* Polygon fill (shown only when closed) */}
          {fillData && (
            <Source id="poly-fill" type="geojson" data={fillData}>
              <Layer
                id="poly-fill-layer"
                type="fill"
                paint={{ 'fill-color': '#d4d7e4', 'fill-opacity': 0.4 }}
              />
            </Source>
          )}

          {/* White connecting lines while polygon is open (hidden when closed, fill takes over) */}
          {lineFeatures.length > 0 && (
            <Source
              id="poly-lines"
              type="geojson"
              data={{ type: 'FeatureCollection', features: lineFeatures }}
            >
              <Layer
                id="poly-lines-layer"
                type="line"
                paint={{ 'line-color': 'rgba(255, 255, 255, 0.8)', 'line-width': 2 }}
              />
            </Source>
          )}

          {/* Midpoint markers with distance label and insert button */}
          {midpoints.map(({ key, mp, dist, afterIndex }) => (
            <Marker key={key} longitude={mp.lng} latitude={mp.lat} anchor="center">
              <button
                type="button"
                className="relative group"
                onClick={(e) => {
                  e.stopPropagation()
                  handleInsertMidpoint(afterIndex)
                }}
              >
                <div className="absolute -inset-4 cursor-pointer" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow text-xs text-gray-600 pointer-events-none whitespace-nowrap group-hover:-translate-y-1 transition-transform duration-200">
                  {dist}m
                </div>
                <motion.div
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer border border-gray-200 group-hover:bg-blue-50 group-hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} className="text-blue-500" />
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
                    <motion.div
                      className={`rounded-full flex items-center justify-center shadow-lg ${
                        isCloseable ? 'bg-[#2563eb] w-12 h-12' : 'bg-white w-10 h-10'
                      }`}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                    >
                      <MapPin
                        size={20}
                        strokeWidth={2}
                        className={isCloseable ? 'text-white' : 'text-gray-700'}
                      />
                    </motion.div>
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
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                >
                  <Home size={20} strokeWidth={2} className="text-gray-700" />
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

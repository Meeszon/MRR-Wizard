export const BLUE = '#3D5AF2'

export const APPLICATION_OPTIONS = ['OpenDroneMap', 'Pix4D', 'DJI Terra', 'Agisoft Metashape']
export const DARK = '#23262F'
export const RED = '#E0515F'
export const GREEN = '#22C55E'

// Simulated device battery level — would come from device in production
export const CURRENT_BATTERY = 65

export function calcMetrics(quality, highestPointMeters = 0) {
  const q = (Number.isNaN(quality) ? 50 : quality) / 100
  const flightTime = Math.round(10 + 35 * q) // 10–45 min
  const baseHeight = Math.round(80 - 65 * q) // 80–15 m
  const flightHeight = baseHeight + highestPointMeters
  const photos = Math.round(100 + 700 * q) // 100–800
  const batteryNeed = Math.round(20 + 60 * q) // 20–80 %
  const feasible = batteryNeed <= CURRENT_BATTERY
  return { flightTime, flightHeight, photos, batteryNeed, feasible }
}

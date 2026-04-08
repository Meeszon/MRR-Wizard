// Simulated device battery level — would come from device in production
export const CURRENT_BATTERY = 65;

export function calcMetrics(quality: number, highestPointMeters = 0) {
  const q = (isNaN(quality) ? 50 : quality) / 100;
  const flightTime = Math.round(10 + 35 * q); // 10–45 min
  const baseHeight = Math.round(80 - 65 * q); // 80–15 m
  const flightHeight = baseHeight + highestPointMeters;
  const photos = Math.round(100 + 700 * q); // 100–800
  const batteryNeed = Math.round(20 + 60 * q); // 20–80 %
  const feasible = batteryNeed <= CURRENT_BATTERY;
  return { flightTime, flightHeight, photos, batteryNeed, feasible };
}

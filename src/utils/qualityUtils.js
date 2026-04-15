export function qualityLabel(q) {
  if (q <= 25) return 'Snel'
  if (q <= 50) return 'Normaal'
  if (q <= 75) return 'Gedetailleerd'
  return 'Maximaal'
}

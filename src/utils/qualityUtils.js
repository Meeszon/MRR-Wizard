export function qualityLabel(q) {
  if (q <= 25) return 'Fast'
  if (q <= 50) return 'Normal'
  if (q <= 75) return 'Detailed'
  return 'Maximum'
}

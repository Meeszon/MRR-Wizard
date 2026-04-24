export default function EmptyState({ icon, message }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <div
        className="flex items-center justify-center rounded-card"
        style={{ width: 52, height: 52, background: '#EBEBEB' }}
      >
        {icon}
      </div>
      <p style={{ fontSize: 13, color: '#888' }}>{message}</p>
    </div>
  )
}

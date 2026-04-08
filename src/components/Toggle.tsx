interface ToggleProps {
  enabled: boolean
  onChange: (val: boolean) => void
}

export default function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="flex items-center gap-2.5 select-none"
    >
      {/* Track */}
      <div
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          backgroundColor: enabled ? '#3D5AF2' : '#E0E0E0',
          position: 'relative',
          transition: 'background-color 0.2s',
          flexShrink: 0,
        }}
      >
        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: enabled ? 23 : 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            backgroundColor: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: 'left 0.2s',
          }}
        />
      </div>
    </button>
  )
}

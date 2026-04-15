import styles from './Toggle.module.scss'

export default function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      aria-label={enabled ? 'Uitschakelen' : 'Inschakelen'}
      onClick={() => onChange(!enabled)}
      className="flex items-center gap-2.5 select-none"
    >
      <div className={`${styles.track} ${enabled ? styles.trackOn : styles.trackOff}`}>
        <div className={`${styles.thumb} ${enabled ? styles.thumbOn : styles.thumbOff}`} />
      </div>
    </button>
  )
}

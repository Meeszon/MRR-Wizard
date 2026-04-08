interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  className?: string
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  className = '',
}: ButtonProps) {
  const base =
    'items-center justify-center gap-2 font-semibold rounded-btn transition-all duration-150 active:scale-95 select-none'

  const sizes = {
    sm: 'px-3 py-1.5 text-body',
    md: 'px-4 py-2.5 text-body-lg',
    lg: 'px-5 py-3 text-h3',
  }

  const variants = {
    primary: disabled
      ? 'bg-primary/40 text-white cursor-not-allowed'
      : 'bg-primary text-white hover:bg-primary-dark shadow-sm',
    outline: disabled
      ? 'border-2 border-border text-border cursor-not-allowed bg-transparent'
      : 'border-2 border-primary text-primary hover:bg-primary/5 bg-transparent',
    ghost: disabled
      ? 'text-border cursor-not-allowed bg-transparent'
      : 'text-body hover:bg-border/40 bg-transparent',
    success: disabled
      ? 'bg-positive/40 text-white cursor-not-allowed'
      : 'bg-positive text-white hover:bg-positive/90 shadow-sm',
    danger: disabled
      ? 'bg-negative/40 text-white cursor-not-allowed'
      : 'bg-negative text-white hover:bg-negative/90 shadow-sm',
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[base, sizes[size], variants[variant], fullWidth ? 'flex w-full max-w-[560px] mx-auto' : 'inline-flex', className].join(
        ' ',
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  )
}

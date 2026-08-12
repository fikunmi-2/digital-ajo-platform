import { Loader2 } from 'lucide-react'



const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  icon: Icon,
}) => {

  const variants = {
    primary: `
      bg-primary text-white
      hover:bg-primary-hover
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    secondary: `
      bg-white text-primary
      border border-primary
      hover:bg-primary-light
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    danger: `
      bg-danger text-white
      hover:bg-red-600
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    ghost: `
      bg-white text-textsecondary
      border border-border
      hover:bg-pagebg
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    "danger-outline": `
      bg-danger-light text-danger
      border border-red-200
      hover:bg-red-100
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
  }

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-sm",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg font-medium
        flex items-center gap-2
        transition-colors duration-150
        ${className}
      `}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : Icon ? (
        <Icon size={14} />
      ) : null}
      {children}
    </button>
  )
}

export default Button
const Avatar = ({ name, size = "md" }) => {
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "??"
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  // Different colors based on first letter
  const colors = [
    "bg-primary-light text-primary",
    "bg-info-light text-info",
    "bg-warning-light text-warning",
    "bg-danger-light text-danger",
    "bg-accent-light text-accent",
  ]

  const colorIndex = name
    ? name.charCodeAt(0) % colors.length
    : 0

  const color = colors[colorIndex]

  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
    xl: "w-12 h-12 text-base",
    "2xl": "w-16 h-16 text-xl",
  }

  const sizeClass = sizes[size] || sizes.md

  return (
    <div className={`
      ${sizeClass} ${color}
      rounded-full flex items-center
      justify-center font-medium flex-shrink-0
    `}>
      {getInitials(name)}
    </div>
  )
}

export default Avatar
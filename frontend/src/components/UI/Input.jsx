const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
  error,
  hint,
  icon: Icon,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>

      {/* Label */}
      {label && (
        <label className="text-xs font-medium text-textprimary">
          {label}
          {required && (
            <span className="text-danger ml-1">*</span>
          )}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2
                          text-textsecondary">
            <Icon size={15} />
          </div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-3 py-2.5 text-sm
            border rounded-lg outline-none
            transition-colors duration-150
            ${Icon ? "pl-9" : ""}
            ${error
              ? "border-danger bg-red-50 focus:border-danger"
              : "border-border focus:border-primary"
            }
            ${disabled
              ? "bg-pagebg text-textsecondary cursor-not-allowed"
              : "bg-white text-textprimary"
            }
          `}
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}

      {/* Hint text */}
      {hint && !error && (
        <p className="text-xs text-textsecondary">{hint}</p>
      )}

    </div>
  )
}

export default Input
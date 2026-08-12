const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  required = false,
  disabled = false,
  error,
  hint,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>

      {label && (
        <label className="text-xs font-medium text-textprimary">
          {label}
          {required && (
            <span className="text-danger ml-1">*</span>
          )}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-3 py-2.5 text-sm
          border rounded-lg outline-none
          transition-colors duration-150
          appearance-none
          bg-no-repeat bg-right
          ${error
            ? "border-danger bg-red-50"
            : "border-border focus:border-primary"
          }
          ${disabled
            ? "bg-pagebg text-textsecondary cursor-not-allowed"
            : "bg-white text-textprimary"
          }
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundPosition: "right 12px center",
          paddingRight: "36px"
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-textsecondary">{hint}</p>
      )}

    </div>
  )
}

export default Select
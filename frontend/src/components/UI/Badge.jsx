const Badge = ({ status }) => {
  const styles = {
    // Customer / Account status
    Active: "bg-success-light text-success",
    Inactive: "bg-danger-light text-danger",
    Suspended: "bg-gray-100 text-gray-500",

    // Contribution status
    Confirmed: "bg-success-light text-success",
    Pending: "bg-warning-light text-warning",
    Cancelled: "bg-danger-light text-danger",

    // Withdrawal status
    Approved: "bg-success-light text-success",
    Rejected: "bg-danger-light text-danger",

    // Package type
    Daily: "bg-primary-light text-primary",
    Monthly: "bg-accent-light text-accent",
    Flexible: "bg-gray-100 text-gray-500",

    // Package status
    Completed: "bg-info-light text-info",
    Defaulted: "bg-gray-100 text-gray-500",
  }

  const style = styles[status] || "bg-gray-100 text-gray-500"

  return (
    <span className={`
      ${style}
      text-xs font-medium px-3 py-1 rounded-full
      whitespace-nowrap
    `}>
      {status}
    </span>
  )
}

export default Badge
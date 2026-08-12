// const MetricCard = ({
//   title,
//   value,
//   trend,
//   trendType,
//   icon: Icon,
//   iconBg = "bg-primary-light",
//   iconColor = "text-primary",
// }) => {
//   return (
//     <div className="bg-white border border-border
//                     rounded-lg p-4 flex flex-col gap-3">

//       {/* Title + Icon */}
//       <div className="flex justify-between items-start">
//         <p className="text-xs text-textsecondary">{title}</p>
//         {Icon && (
//           <div className={`
//             ${iconBg} ${iconColor}
//             w-8 h-8 rounded-lg
//             flex items-center justify-center
//           `}>
//             <Icon size={14} />
//           </div>
//         )}
//       </div>

//       {/* Value */}
//       <p className="text-2xl font-medium text-textprimary">
//         {value}
//       </p>

//       {/* Trend */}
//       {trend && (
//         <p className={`text-xs ${
//           trendType === "up"
//             ? "text-success"
//             : trendType === "down"
//             ? "text-danger"
//             : "text-textsecondary"
//         }`}>
//           {trendType === "up" ? "↑" : trendType === "down" ? "↓" : ""} {trend}
//         </p>
//       )}
//     </div>
//   )
// }

// export default MetricCard

const MetricCard = ({ title, value, trend, icon: Icon }) => {

  const isPositive = trend?.includes("↑")
  const isNegative = trend?.includes("↓")

  return (
    <div className="bg-white border border-border rounded-xl p-4">

      {/* Top Row */}
      <div className="flex justify-between items-center mb-2">

        <p className="text-xs text-textsecondary">
          {title}
        </p>

        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-primary/10
                          flex items-center justify-center">
            <Icon size={16} className="text-primary" />
          </div>
        )}

      </div>

      {/* Value */}
      <p className="text-xl font-semibold text-textprimary mb-1">
        {value}
      </p>

      {/* Trend */}
      <p className={`text-xs font-medium
        ${isPositive ? 'text-green-500' : ''}
        ${isNegative ? 'text-red-500' : ''}
      `}>
        {trend}
      </p>

    </div>
  )
}

export default MetricCard
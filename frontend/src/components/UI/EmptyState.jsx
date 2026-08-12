import { Inbox } from 'lucide-react'

const EmptyState = ({
  title = "No data found",
  message = "Nothing to display here yet.",
  icon: Icon = Inbox,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center
                    py-16 px-4 text-center">
      <div className="w-16 h-16 bg-pagebg rounded-full
                      flex items-center justify-center mb-4">
        <Icon size={28} className="text-textsecondary" />
      </div>
      <h3 className="text-sm font-medium text-textprimary mb-1">
        {title}
      </h3>
      <p className="text-xs text-textsecondary mb-4 max-w-xs">
        {message}
      </p>
      {action && action}
    </div>
  )
}

export default EmptyState
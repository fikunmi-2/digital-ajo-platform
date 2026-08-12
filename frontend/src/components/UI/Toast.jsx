import { useEffect } from 'react'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X
} from 'lucide-react'

const Toast = ({ message, type = "success", onClose }) => {

  // Auto close after 4 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const styles = {
    success: {
      container: "bg-success-light border-success",
      icon: "text-success",
      text: "text-green-800",
      Icon: CheckCircle,
    },
    error: {
      container: "bg-danger-light border-danger",
      icon: "text-danger",
      text: "text-red-800",
      Icon: XCircle,
    },
    warning: {
      container: "bg-warning-light border-warning",
      icon: "text-warning",
      text: "text-yellow-800",
      Icon: AlertCircle,
    },
    info: {
      container: "bg-info-light border-info",
      icon: "text-info",
      text: "text-blue-800",
      Icon: Info,
    },
  }

  const style = styles[type] || styles.success
  const { Icon: ToastIcon } = style

  return (
    <div className={`
      ${style.container}
      border-l-4 rounded-lg
      px-4 py-3
      flex items-start gap-3
      shadow-sm
      animate-fade-in
    `}>
      <ToastIcon size={16} className={`${style.icon} flex-shrink-0 mt-0.5`} />
      <p className={`text-sm font-medium flex-1 ${style.text}`}>
        {message}
      </p>
      <button
        onClick={onClose}
        className="text-textsecondary hover:text-textprimary"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default Toast
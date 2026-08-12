import { X } from 'lucide-react'
import { useEffect } from 'react'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/40 z-50
                 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal box */}
      <div
        className={`
          ${sizes[size]}
          w-full bg-white rounded-xl
          shadow-xl overflow-hidden
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between
                        px-6 py-4 border-b border-border">
          <h2 className="text-base font-medium text-textprimary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-textsecondary hover:text-textprimary
                       hover:bg-pagebg rounded-lg p-1
                       transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
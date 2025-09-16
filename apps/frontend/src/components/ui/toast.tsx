import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"

interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  onClose?: () => void
  duration?: number
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ type = 'info', title, message, onClose, duration = 2000 }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false)
          setTimeout(() => onClose?.(), 300) // Wait for animation
        }, duration)
        return () => clearTimeout(timer)
      }
    }, [duration, onClose])

    const handleClose = () => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    }

    const icons = {
      success: CheckCircle,
      error: XCircle,
      warning: AlertCircle,
      info: Info
    }

    const colors = {
      success: 'bg-[#e6f4ea] border-[#137333] text-[#137333]',
      error: 'bg-[#fce8e6] border-[#d93025] text-[#d93025]',
      warning: 'bg-[#fef7e0] border-[#ea8600] text-[#ea8600]',
      info: 'bg-[#e8f2ff] border-[#0061fe] text-[#0061fe]'
    }

    const Icon = icons[type]

    if (!isVisible) return null

    return (
      <div
        ref={ref}
        className={cn(
          "max-w-sm w-full p-4 rounded-lg border shadow-lg transition-all duration-300",
          colors[type],
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <div className="flex items-start">
          <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{title}</p>
            {message && (
              <p className="text-sm mt-1 opacity-90">{message}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="ml-3 flex-shrink-0 h-5 w-5 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast }

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, User, Building2 } from "lucide-react"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  placeholder?: string
  disabled?: boolean
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onValueChange, children, placeholder, disabled, ...props }, _ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const selectRef = React.useRef<HTMLDivElement>(null)
    
    // Close select when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
      
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])
    
    return (
      <div ref={selectRef} className="relative" {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              isOpen,
              setIsOpen,
              value,
              onValueChange,
              placeholder,
              disabled
            })
          }
          return child
        })}
      </div>
    )
  }
)
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  children: React.ReactNode
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
  placeholder?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}>(
  ({ className, children, isOpen, setIsOpen, placeholder, disabled, onValueChange, ...props }, ref) => {
    return (
      <button
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onClick={() => setIsOpen?.(!isOpen)}
        disabled={disabled}
        {...props}
      >
        {children}
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & {
  placeholder?: string
  value?: string
}>(
  ({ className, children, placeholder, value, ...props }, ref) => {
    const getDisplayValue = () => {
      if (value === 'INDIVIDUAL') return 'Particulier'
      if (value === 'COMPANY') return 'Entreprise'
      return value || placeholder || children
    }
    
    return (
      <span
        className={cn("flex items-center gap-2", className)}
        ref={ref}
        {...props}
      >
        {value === 'INDIVIDUAL' && <User className="h-4 w-4" />}
        {value === 'COMPANY' && <Building2 className="h-4 w-4" />}
        {getDisplayValue()}
      </span>
    )
  }
)
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
  onValueChange?: (value: string) => void
}>(
  ({ className, children, isOpen, setIsOpen, onValueChange, ...props }, ref) => {
    if (!isOpen) return null
    
    return (
      <div
        className={cn(
          "absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md",
          className
        )}
        ref={ref}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              onValueChange,
              setIsOpen
            })
          }
          return child
        })}
      </div>
    )
  }
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { 
  value: string
  onValueChange?: (value: string) => void
  setIsOpen?: (open: boolean) => void
}>(
  ({ className, children, value, onValueChange, setIsOpen, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        ref={ref}
        onClick={() => {
          onValueChange?.(value)
          setIsOpen?.(false)
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }

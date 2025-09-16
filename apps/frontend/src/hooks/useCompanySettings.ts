import { useQuery } from '@tanstack/react-query'
import { companySettingsAPI } from '@/lib/api'

export function useCompanySettings() {
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['company-settings'],
    queryFn: () => companySettingsAPI.get(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Apply custom colors to CSS variables
  const applyCustomColors = () => {
    if (settings) {
      const root = document.documentElement
      
      // Convert hex to RGB for CSS variables
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null
      }

      const primaryRgb = hexToRgb(settings.primaryColor)
      const secondaryRgb = hexToRgb(settings.secondaryColor)
      const accentRgb = hexToRgb(settings.accentColor)
      const successRgb = hexToRgb(settings.successColor || '#10b981')
      const warningRgb = hexToRgb(settings.warningColor || '#f59e0b')
      const dangerRgb = hexToRgb(settings.dangerColor || '#ef4444')

      if (primaryRgb) {
        root.style.setProperty('--primary', `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}`)
        root.style.setProperty('--primary-foreground', '255 255 255')
        root.style.setProperty('--ring', `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}`)
      }

      if (secondaryRgb) {
        root.style.setProperty('--secondary', `${secondaryRgb.r} ${secondaryRgb.g} ${secondaryRgb.b}`)
        root.style.setProperty('--secondary-foreground', '255 255 255')
      }

      if (accentRgb) {
        root.style.setProperty('--accent', `${accentRgb.r} ${accentRgb.g} ${accentRgb.b}`)
        root.style.setProperty('--accent-foreground', '255 255 255')
      }

      if (successRgb) {
        root.style.setProperty('--success', `${successRgb.r} ${successRgb.g} ${successRgb.b}`)
        root.style.setProperty('--success-foreground', '255 255 255')
      }

      if (warningRgb) {
        root.style.setProperty('--warning', `${warningRgb.r} ${warningRgb.g} ${warningRgb.b}`)
        root.style.setProperty('--warning-foreground', '255 255 255')
      }

      if (dangerRgb) {
        root.style.setProperty('--destructive', `${dangerRgb.r} ${dangerRgb.g} ${dangerRgb.b}`)
        root.style.setProperty('--destructive-foreground', '255 255 255')
      }

      // Apply font family
      if (settings.fontFamily) {
        root.style.setProperty('--font-family', settings.fontFamily)
        document.body.style.fontFamily = settings.fontFamily
      }

      // Apply font size
      if (settings.fontSize) {
        const fontSizeMap = {
          small: '14px',
          medium: '16px',
          large: '18px'
        }
        const fontSize = fontSizeMap[settings.fontSize as keyof typeof fontSizeMap] || '16px'
        root.style.setProperty('--font-size-base', fontSize)
        document.body.style.fontSize = fontSize
      }

      // Apply colors to Tailwind CSS classes
      const style = document.createElement('style')
      style.id = 'company-brand-colors'
      style.textContent = `
        /* Fix autofill yellow background */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          -webkit-text-fill-color: inherit !important;
        }
        
        /* Brand colors for buttons and badges */
        .btn-primary, .btn-dropbox-primary {
          background-color: ${settings.primaryColor} !important;
          border-color: ${settings.primaryColor} !important;
        }
        .btn-primary:hover, .btn-dropbox-primary:hover {
          background-color: ${settings.primaryColor}dd !important;
        }
        .btn-success {
          background-color: ${settings.successColor || '#10b981'} !important;
          border-color: ${settings.successColor || '#10b981'} !important;
        }
        .btn-danger {
          background-color: ${settings.dangerColor || '#ef4444'} !important;
          border-color: ${settings.dangerColor || '#ef4444'} !important;
        }
        
        /* Navigation and tabs */
        .nav-item-active {
          background-color: ${settings.primaryColor} !important;
          color: white !important;
        }
        .tab-active {
          background-color: ${settings.primaryColor} !important;
          color: white !important;
        }
        
        /* Badges */
        .badge-primary {
          background-color: ${settings.primaryColor} !important;
          color: white !important;
        }
        .badge-success {
          background-color: ${settings.successColor || '#10b981'} !important;
          color: white !important;
        }
        .badge-warning {
          background-color: ${settings.warningColor || '#f59e0b'} !important;
          color: white !important;
        }
        .badge-danger {
          background-color: ${settings.dangerColor || '#ef4444'} !important;
          color: white !important;
        }
        
        /* Text colors for brand elements */
        .text-blue-600 {
          color: ${settings.primaryColor} !important;
        }
        .border-blue-600 {
          border-color: ${settings.primaryColor} !important;
        }
        .bg-blue-600 {
          background-color: ${settings.primaryColor} !important;
        }
        .text-green-600 {
          color: ${settings.successColor || '#10b981'} !important;
        }
        .text-red-600 {
          color: ${settings.dangerColor || '#ef4444'} !important;
        }
        .text-yellow-600 {
          color: ${settings.warningColor || '#f59e0b'} !important;
        }
        
        /* Focus rings */
        .focus\\:ring-blue-500:focus {
          --tw-ring-color: ${settings.primaryColor} !important;
        }
        
        /* Font settings */
        body {
          font-family: ${settings.fontFamily || 'Inter'}, sans-serif !important;
          font-size: ${settings.fontSize === 'small' ? '14px' : settings.fontSize === 'large' ? '18px' : '16px'} !important;
        }
      `
      
      // Remove existing style if it exists
      const existingStyle = document.getElementById('company-brand-colors')
      if (existingStyle) {
        existingStyle.remove()
      }
      
      document.head.appendChild(style)
    }
  }

  return {
    settings,
    isLoading,
    error,
    applyCustomColors,
  }
}

import React, { createContext, useState, useCallback } from 'react'
import { Toast } from '@/components/ui/toast'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void
  hideNotification: (id: string) => void
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])
  }, [])

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="pointer-events-auto"
            style={{ 
              transform: `translateY(${index * 80}px)`,
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            <Toast
              type={notification.type}
              title={notification.title}
              message={notification.message}
              duration={notification.duration}
              onClose={() => hideNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}



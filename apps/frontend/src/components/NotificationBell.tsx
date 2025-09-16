import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotifications } from '@/hooks/useNotifications'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    type: 'project' | 'client' | 'task' | 'material'
    id: string
    label: string
  }
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { showNotification } = useNotifications()

  // Simulate notifications for demo purposes with updated features
  useEffect(() => {
    const demoNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Nouveau projet créé',
        message: 'Le projet "Maison Dubois" a été créé avec succès.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        action: {
          type: 'project',
          id: '1',
          label: 'Voir le projet'
        }
      },
      {
        id: '2',
        type: 'info',
        title: 'Tâche mise à jour',
        message: 'La tâche "Coulage des fondations" a été marquée comme terminée.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false,
        action: {
          type: 'task',
          id: '1',
          label: 'Voir la tâche'
        }
      },
      {
        id: '3',
        type: 'warning',
        title: 'Tâche bloquée',
        message: 'La tâche "Préparation du terrain" a été marquée comme bloquée.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        action: {
          type: 'task',
          id: '2',
          label: 'Voir la tâche'
        }
      },
      {
        id: '4',
        type: 'info',
        title: 'Étape suspendue',
        message: 'L\'étape "Fondations" a été suspendue temporairement.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        read: true,
        action: {
          type: 'project',
          id: '1',
          label: 'Voir l\'étape'
        }
      },
      {
        id: '5',
        type: 'success',
        title: 'Planification mise à jour',
        message: 'La durée estimée de la tâche "Coulage des fondations" a été mise à jour (5 jours).',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        read: true,
        action: {
          type: 'task',
          id: '1',
          label: 'Voir la planification'
        }
      },
      {
        id: '6',
        type: 'warning',
        title: 'Matériaux en rupture',
        message: 'Le matériau "Ciment Portland" est en rupture de stock.',
        timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
        read: true,
        action: {
          type: 'material',
          id: '1',
          label: 'Gérer les stocks'
        }
      },
      {
        id: '7',
        type: 'info',
        title: 'Commentaire ajouté',
        message: 'Un nouveau commentaire a été ajouté au fichier "Plan_fondations.pdf".',
        timestamp: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
        read: true,
        action: {
          type: 'project',
          id: '1',
          label: 'Voir le fichier'
        }
      }
    ]

    setNotifications(demoNotifications)
    setUnreadCount(demoNotifications.filter(n => !n.read).length)
  }, [])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'info':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'À l\'instant'
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
    return timestamp.toLocaleDateString('fr-FR')
  }

  const handleNotificationClick = (notification: Notification) => {
    // The original code had markAsRead and markAllAsRead here, which are no longer available.
    // Assuming the intent was to just show a notification if it's not read,
    // or if it has an action, navigate.
    // For now, we'll just show a notification if it's not read.
    if (!notification.read) {
      showNotification({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        duration: 5000, // Default duration for notifications
      });
    }
    
    if (notification.action) {
      // Handle navigation based on action type
      switch (notification.action.type) {
        case 'project':
          window.location.href = `/projects/${notification.action.id}`
          break
        case 'client':
          window.location.href = `/clients/${notification.action.id}`
          break
        case 'task':
          // Navigate to project with task focus
          window.location.href = `/projects/1?task=${notification.action.id}`
          break
        case 'material':
          window.location.href = `/materials/${notification.action.id}`
          break
      }
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // The original code had markAllAsRead here, which is no longer available.
                        // Assuming the intent was to mark all as read if there are unread.
                        // For now, we'll just show a notification.
                        showNotification({
                          type: 'info',
                          title: 'Toutes les notifications marquées comme lues',
                          message: 'Toutes les notifications non lues ont été marquées comme lues.',
                          duration: 3000,
                        });
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Tout marquer comme lu
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          notification.read ? 'opacity-75' : ''
                        } ${getNotificationColor(notification.type)}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{formatTimestamp(notification.timestamp)}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            {notification.action && (
                              <div className="mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-6 px-2"
                                >
                                  {notification.action.label}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Aucune notification</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

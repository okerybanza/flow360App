import { useEffect, useRef } from 'react'
import { useNotifications } from './useNotifications'

interface SmartNotificationOptions {
  // Task status changes
  taskStatusChanged?: {
    taskId: string
    taskTitle: string
    oldStatus: string
    newStatus: string
  }
  
  // Step status changes
  stepStatusChanged?: {
    stepId: string
    stepTitle: string
    oldStatus: string
    newStatus: string
  }
  
  // Planning updates
  planningUpdated?: {
    taskId: string
    taskTitle: string
    field: 'estimatedDuration' | 'actualDuration' | 'plannedStartDate' | 'plannedEndDate'
    oldValue: any
    newValue: any
  }
  
  // File comments
  fileCommentAdded?: {
    fileId: string
    fileName: string
    commentContent: string
  }
  
  // Material stock alerts
  materialStockAlert?: {
    materialId: string
    materialName: string
    currentStock: number
    threshold: number
  }
}

export const useSmartNotifications = () => {
  const { showNotification } = useNotifications()
  const lastNotificationRef = useRef<string>('')

  const generateNotificationId = (type: string, id: string) => `${type}-${id}-${Date.now()}`

  const showSmartNotification = (options: SmartNotificationOptions) => {
    // Task status changes
    if (options.taskStatusChanged) {
      const { taskTitle, oldStatus, newStatus } = options.taskStatusChanged
      const notificationId = generateNotificationId('task-status', options.taskStatusChanged.taskId)
      
      // Avoid duplicate notifications
      if (lastNotificationRef.current === notificationId) return
      lastNotificationRef.current = notificationId

      const statusLabels = {
        'TODO': 'À faire',
        'IN_PROGRESS': 'En cours',
        'REVIEW': 'En révision',
        'DONE': 'Terminé',
        'BLOCKED': 'Bloqué',
        'SUSPENDED': 'Suspendu'
      }

      const getStatusColor = (status: string) => {
        switch (status) {
          case 'DONE': return 'success'
          case 'BLOCKED': return 'warning'
          case 'SUSPENDED': return 'warning'
          case 'IN_PROGRESS': return 'info'
          default: return 'info'
        }
      }

      showNotification({
        type: getStatusColor(newStatus),
        title: `Tâche mise à jour`,
        message: `La tâche "${taskTitle}" est passée de "${statusLabels[oldStatus as keyof typeof statusLabels] || oldStatus}" à "${statusLabels[newStatus as keyof typeof statusLabels] || newStatus}".`
      })
    }

    // Step status changes
    if (options.stepStatusChanged) {
      const { stepTitle, oldStatus, newStatus } = options.stepStatusChanged
      const notificationId = generateNotificationId('step-status', options.stepStatusChanged.stepId)
      
      if (lastNotificationRef.current === notificationId) return
      lastNotificationRef.current = notificationId

      const statusLabels = {
        'PENDING': 'En attente',
        'IN_PROGRESS': 'En cours',
        'COMPLETED': 'Terminée',
        'BLOCKED': 'Bloquée',
        'SUSPENDED': 'Suspendue'
      }

      const getStatusColor = (status: string) => {
        switch (status) {
          case 'COMPLETED': return 'success'
          case 'BLOCKED': return 'warning'
          case 'SUSPENDED': return 'warning'
          case 'IN_PROGRESS': return 'info'
          default: return 'info'
        }
      }

      showNotification({
        type: getStatusColor(newStatus),
        title: `Étape mise à jour`,
        message: `L'étape "${stepTitle}" est passée de "${statusLabels[oldStatus as keyof typeof statusLabels] || oldStatus}" à "${statusLabels[newStatus as keyof typeof statusLabels] || newStatus}".`
      })
    }

    // Planning updates
    if (options.planningUpdated) {
      const { taskTitle, field, oldValue, newValue } = options.planningUpdated
      const notificationId = generateNotificationId('planning', options.planningUpdated.taskId)
      
      if (lastNotificationRef.current === notificationId) return
      lastNotificationRef.current = notificationId

      const fieldLabels = {
        'estimatedDuration': 'Durée estimée',
        'actualDuration': 'Durée réelle',
        'plannedStartDate': 'Date de début planifiée',
        'plannedEndDate': 'Date de fin planifiée'
      }

      const formatValue = (value: any, field: string) => {
        if (field.includes('Duration')) {
          return `${value} jour${value > 1 ? 's' : ''}`
        }
        if (field.includes('Date')) {
          return new Date(value).toLocaleDateString('fr-FR')
        }
        return value
      }

      showNotification({
        type: 'info',
        title: `Planification mise à jour`,
        message: `La ${fieldLabels[field]} de la tâche "${taskTitle}" a été mise à jour de "${formatValue(oldValue, field)}" à "${formatValue(newValue, field)}".`
      })
    }

    // File comments
    if (options.fileCommentAdded) {
      const { fileName } = options.fileCommentAdded
      const notificationId = generateNotificationId('file-comment', options.fileCommentAdded.fileId)
      
      if (lastNotificationRef.current === notificationId) return
      lastNotificationRef.current = notificationId

      showNotification({
        type: 'info',
        title: `Commentaire ajouté`,
        message: `Un nouveau commentaire a été ajouté au fichier "${fileName}".`
      })
    }

    // Material stock alerts
    if (options.materialStockAlert) {
      const { materialName, currentStock, threshold } = options.materialStockAlert
      const notificationId = generateNotificationId('material-stock', options.materialStockAlert.materialId)
      
      if (lastNotificationRef.current === notificationId) return
      lastNotificationRef.current = notificationId

      showNotification({
        type: 'warning',
        title: `Stock faible`,
        message: `Le matériau "${materialName}" est en rupture de stock (${currentStock} restant, seuil: ${threshold}).`
      })
    }
  }

  // Clear last notification reference after 5 seconds to allow new notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      lastNotificationRef.current = ''
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return { showSmartNotification }
}

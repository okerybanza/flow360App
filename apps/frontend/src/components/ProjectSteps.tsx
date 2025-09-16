import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  ListTodo
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { projectStepsAPI, projectTemplatesAPI, tasksAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'
import { useSmartNotifications } from '@/hooks/useSmartNotifications'
import BulkMaterialSelector from './BulkMaterialSelector'
import TaskMaterials from './TaskMaterials'

interface ProjectStepsProps {
  projectId: string
}

interface Step {
  id: string
  title: string
  description?: string
  order: number
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'SUSPENDED'
  tasks: Task[]
}

interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'BLOCKED' | 'SUSPENDED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  assignedTo?: string
  dueDate?: string
}

export default function ProjectSteps({ projectId }: ProjectStepsProps) {
  const [showMaterialSelector, setShowMaterialSelector] = useState<string | null>(null)
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [expandedTasks, setExpandedTasks] = useState<Record<string, string | null>>({}) // stepId -> taskId
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [addingTask, setAddingTask] = useState<string | null>(null) // stepId
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH'
  })
  const [editingStepData, setEditingStepData] = useState({
    title: '',
    description: ''
  })
  const [editingTaskData, setEditingTaskData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH'
  })
  const [showCustomStepForm, setShowCustomStepForm] = useState(false)
  const [newStepData, setNewStepData] = useState({
    title: '',
    description: ''
  })
  
  const { showNotification } = useNotifications()
  const { showSmartNotification } = useSmartNotifications()
  const queryClient = useQueryClient()

  // Close all status dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.status-dropdown-container')) {
        // Close all status dropdowns
        document.querySelectorAll('[id^="status-dropdown-"]').forEach(dropdown => {
          dropdown.classList.add('hidden')
        })
        // Reset all chevron rotations
        document.querySelectorAll('[id^="chevron-"]').forEach(chevron => {
          chevron.classList.remove('rotate-180')
        })
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { data: steps, isLoading: stepsLoading } = useQuery({
    queryKey: ['project-steps', projectId],
    queryFn: () => projectStepsAPI.getByProject(projectId),
    refetchOnWindowFocus: false,
    staleTime: 0, // Always consider data stale to ensure fresh data
  })

  const { data: templates } = useQuery({
    queryKey: ['project-templates'],
    queryFn: () => projectTemplatesAPI.getAll(),
  })

  const applyTemplateMutation = useMutation({
    mutationFn: (templateId: string) => projectTemplatesAPI.applyToProject(templateId, projectId),
    onSuccess: (_, templateId) => {
      queryClient.invalidateQueries({ queryKey: ['project-steps', projectId] })
      const templateName = templates?.find((t: any) => t.id === templateId)?.name || 'Template'
      showNotification({
        type: 'success',
        title: 'Template appliqué avec succès',
        message: `Le template "${templateName}" a été appliqué au projet. Toutes les étapes existantes ont été remplacées.`
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur lors de l\'application du template',
        message: error.response?.data?.message || 'Une erreur est survenue lors de l\'application du template au projet.'
      })
    }
  })

  const createStepMutation = useMutation({
    mutationFn: (data: any) => projectStepsAPI.create({ ...data, projectId }),
    onSuccess: () => {
      // Invalidate and refetch to ensure immediate UI updates
      queryClient.invalidateQueries({ queryKey: ['project-steps', projectId] })
      queryClient.refetchQueries({ queryKey: ['project-steps', projectId] })
      setShowCustomStepForm(false)
      setNewStepData({ title: '', description: '' })
      showNotification({
        type: 'success',
        title: 'Étape créée',
        message: 'L\'étape a été créée avec succès.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la création de l\'étape'
      })
    }
  })

  const updateStepMutation = useMutation({
    mutationFn: ({ stepId, data }: { stepId: string; data: any }) => projectStepsAPI.update(stepId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-steps', projectId] })
      setEditingStep(null)
      showNotification({
        type: 'success',
        title: 'Étape mise à jour',
        message: 'L\'étape a été mise à jour avec succès.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la mise à jour de l\'étape'
      })
    }
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: any }) => tasksAPI.update(taskId, data),
    onSuccess: (_, { taskId, data }) => {
      // Check for planning field updates
      const planningFields = ['estimatedDuration', 'actualDuration', 'plannedStartDate', 'plannedEndDate']
      const updatedPlanningFields = planningFields.filter(field => data[field] !== undefined)
      
      if (updatedPlanningFields.length > 0) {
        const task = steps?.flatMap((step: any) => step.tasks).find((t: any) => t.id === taskId)
        if (task) {
          updatedPlanningFields.forEach(field => {
            if (data[field] !== task[field]) {
              showSmartNotification({
                planningUpdated: {
                  taskId,
                  taskTitle: task.title,
                  field: field as any,
                  oldValue: task[field],
                  newValue: data[field]
                }
              })
            }
          })
        }
      }
      
      // Invalidate and refetch to ensure immediate UI updates
      queryClient.invalidateQueries({ queryKey: ['project-steps', projectId] })
      queryClient.refetchQueries({ queryKey: ['project-steps', projectId] })
      setEditingTask(null)
      showNotification({
        type: 'success',
        title: 'Tâche mise à jour',
        message: 'La tâche a été mise à jour avec succès.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la mise à jour de la tâche'
      })
    }
  })

  const createTaskMutation = useMutation({
    mutationFn: ({ stepId, data }: { stepId: string; data: any }) => tasksAPI.create({ ...data, stepId }),
    onSuccess: () => {
      // Invalidate and refetch to ensure immediate UI updates
      queryClient.invalidateQueries({ queryKey: ['project-steps', projectId] })
      queryClient.refetchQueries({ queryKey: ['project-steps', projectId] })
      setAddingTask(null)
      setNewTaskData({ title: '', description: '', priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' })
      showNotification({
        type: 'success',
        title: 'Tâche créée',
        message: 'La tâche a été créée avec succès.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la création de la tâche'
      })
    }
  })

  const handleApplyTemplate = (templateId: string) => {
    // Check if project has any existing steps
    const hasExistingSteps = steps && steps.length > 0
    
    if (hasExistingSteps) {
      const confirmed = window.confirm(
        '⚠️ ATTENTION: Ce projet contient déjà des étapes et tâches.\n\n' +
        'Appliquer un nouveau template remplacera COMPLÈTEMENT toutes les étapes existantes, y compris:\n' +
        '• Toutes les tâches en cours\n' +
        '• Toutes les tâches terminées\n' +
        '• Toutes les matériaux assignés\n' +
        '• Tous les progrès sauvegardés\n\n' +
        'Cette action est irréversible. Voulez-vous vraiment continuer ?'
      )
      if (!confirmed) return
    }

    applyTemplateMutation.mutate(templateId)
  }

  const handleDeleteStep = async (stepId: string, stepTitle: string) => {
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer l'étape "${stepTitle}" ?`)
    if (!confirmed) return

    try {
      await projectStepsAPI.delete(stepId)
      queryClient.invalidateQueries({ queryKey: ['project-steps', projectId] })
      showNotification({
        type: 'success',
        title: 'Étape supprimée',
        message: `L'étape "${stepTitle}" a été supprimée avec succès.`
      })
    } catch (error: any) {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la suppression de l\'étape'
      })
    }
  }

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${taskTitle}" ?`)
    if (!confirmed) return

    try {
      await projectStepsAPI.deleteTask(taskId)
      queryClient.invalidateQueries({ queryKey: ['project-steps', projectId] })
      showNotification({
        type: 'success',
        title: 'Tâche supprimée',
        message: `La tâche "${taskTitle}" a été supprimée avec succès.`
      })
    } catch (error: any) {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la suppression de la tâche'
      })
    }
  }



  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, newStatus }: { taskId: string; newStatus: string }) => 
      tasksAPI.update(taskId, { status: newStatus }),
    onSuccess: async (_, { taskId, newStatus }) => {
      // Find the step that contains this task from current data
      const stepWithTask = steps?.find((step: any) => 
        step.tasks?.some((task: any) => task.id === taskId)
      )
      
      if (stepWithTask) {
        const task = stepWithTask.tasks.find((t: any) => t.id === taskId)
        const oldStatus = task?.status || 'UNKNOWN'
        
        // Show smart notification for task status change
        showSmartNotification({
          taskStatusChanged: {
            taskId,
            taskTitle: task?.title || 'Tâche inconnue',
            oldStatus,
            newStatus
          }
        })
        
        // Calculate new step status based on all task statuses
        const taskStatuses = stepWithTask.tasks.map((task: any) => task.status)
        let newStepStatus = 'PENDING'
        
        // All tasks are done
        if (taskStatuses.every((status: string) => status === 'DONE')) {
          newStepStatus = 'COMPLETED'
        } 
        // At least one task is blocked
        else if (taskStatuses.some((status: string) => status === 'BLOCKED')) {
          newStepStatus = 'BLOCKED'
        }
        // At least one task is suspended
        else if (taskStatuses.some((status: string) => status === 'SUSPENDED')) {
          newStepStatus = 'SUSPENDED'
        }
        // At least one task is in progress or review
        else if (taskStatuses.some((status: string) => status === 'IN_PROGRESS' || status === 'REVIEW')) {
          newStepStatus = 'IN_PROGRESS'
        } 
        // All tasks are pending
        else if (taskStatuses.every((status: string) => status === 'TODO')) {
          newStepStatus = 'PENDING'
        }
        
        // Update step status if it changed
        if (newStepStatus !== stepWithTask.status) {
          try {
            const oldStepStatus = stepWithTask.status
            await projectStepsAPI.update(stepWithTask.id, { status: newStepStatus })
            console.log(`Step status updated from ${oldStepStatus} to ${newStepStatus}`)
            
            // Show smart notification for step status change
            showSmartNotification({
              stepStatusChanged: {
                stepId: stepWithTask.id,
                stepTitle: stepWithTask.title,
                oldStatus: oldStepStatus,
                newStatus: newStepStatus
              }
            })
          } catch (error) {
            console.error('Failed to update step status:', error)
          }
        }
      }
      
      // Invalidate and refetch to ensure immediate UI updates
      queryClient.invalidateQueries({ queryKey: ['project-steps', projectId] })
      queryClient.refetchQueries({ queryKey: ['project-steps', projectId] })
      // Also invalidate project data to reflect project status changes
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la mise à jour du statut'
      })
    }
  })

  const handleUpdateTaskStatus = (taskId: string, newStatus: string) => {
    updateTaskStatusMutation.mutate({ taskId, newStatus })
  }

  const handleEditStep = (step: Step) => {
    setEditingStepData({
      title: step.title,
      description: step.description || ''
    })
    setEditingStep(step.id)
  }

  const handleSaveCustomStep = () => {
    if (!newStepData.title.trim()) return
    
    // Get the next order number for this project
    const nextOrder = steps?.length ? Math.max(...steps.map((s: any) => s.order)) + 1 : 1
    
    createStepMutation.mutate({
      title: newStepData.title,
      description: newStepData.description,
      order: nextOrder,
      status: 'PENDING'
    })
  }

  const handleSaveStep = () => {
    if (!editingStep || !editingStepData.title.trim()) return
    
    updateStepMutation.mutate({
      stepId: editingStep,
      data: editingStepData
    })
  }

  const handleEditTask = (task: Task) => {
    setEditingTaskData({
      title: task.title,
      description: task.description || '',
      priority: task.priority
    })
    setEditingTask(task.id)
  }

  const handleSaveTask = () => {
    if (!editingTask || !editingTaskData.title.trim()) return
    
    updateTaskMutation.mutate({
      taskId: editingTask,
      data: editingTaskData
    })
  }

  const handleAddTask = (stepId: string) => {
    setAddingTask(stepId)
    setNewTaskData({ 
      title: '', 
      description: '', 
      priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' 
    })
  }

  const handleSaveNewTask = () => {
    if (!addingTask || !newTaskData.title.trim()) return
    
    // Get the current user for createdBy
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    
    // Get the next order number for this step
    const currentStep = steps?.find((s: any) => s.id === addingTask)
    const nextOrder = currentStep?.tasks?.length ? Math.max(...currentStep.tasks.map((t: any) => t.order)) + 1 : 1
    
    createTaskMutation.mutate({
      stepId: addingTask,
      data: {
        ...newTaskData,
        order: nextOrder,
        createdBy: currentUser.id,
        status: 'TODO'
      }
    })
  }

  const toggleStepExpansion = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId)
    setSelectedStep(stepId)
    setSelectedTask(null) // Clear task selection when step is selected
    // Clear expanded task when step is collapsed
    if (expandedStep === stepId) {
      setExpandedTasks(prev => ({ ...prev, [stepId]: null }))
    }
  }

  const toggleTaskExpansion = (stepId: string, taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [stepId]: prev[stepId] === taskId ? null : taskId
    }))
    setSelectedTask(taskId)
    setSelectedStep(stepId)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DONE':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'REVIEW':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case 'TODO':
        return <Clock className="h-4 w-4 text-gray-600" />
      case 'BLOCKED':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'SUSPENDED':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }



  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'text-gray-600'
      case 'IN_PROGRESS':
        return 'text-blue-600'
      case 'REVIEW':
        return 'text-orange-600'
      case 'DONE':
        return 'text-green-600'
      case 'BLOCKED':
        return 'text-red-600'
      case 'SUSPENDED':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'À faire'
      case 'IN_PROGRESS':
        return 'En cours'
      case 'REVIEW':
        return 'En révision'
      case 'DONE':
        return 'Terminé'
      case 'BLOCKED':
        return 'Bloqué'
      case 'SUSPENDED':
        return 'Suspendu'
      default:
        return status
    }
  }

  if (stepsLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Étapes du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Unified Step Management */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center">
            <Plus className="h-5 w-5 mr-2 text-indigo-600" />
            Gestion des étapes
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Créez des étapes personnalisées ou appliquez un template existant.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Custom Step Creation */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className="font-medium text-gray-900">Étape personnalisée</h3>
              </div>
              {!showCustomStepForm ? (
                <Button
                  onClick={() => setShowCustomStepForm(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle étape
                </Button>
              ) : (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                  <div>
                    <Label htmlFor="step-title">Titre de l'étape</Label>
                    <Input
                      id="step-title"
                      value={newStepData.title}
                      onChange={(e) => setNewStepData({ ...newStepData, title: e.target.value })}
                      placeholder="Ex: Planification initiale"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="step-description">Description (optionnel)</Label>
                    <Textarea
                      id="step-description"
                      value={newStepData.description}
                      onChange={(e) => setNewStepData({ ...newStepData, description: e.target.value })}
                      placeholder="Description détaillée de l'étape..."
                      className="mt-1"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleSaveCustomStep} 
                      disabled={createStepMutation.isPending || !newStepData.title.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {createStepMutation.isPending ? 'Création...' : 'Créer l\'étape'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowCustomStepForm(false)
                        setNewStepData({ title: '', description: '' })
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Template Selection */}
            {templates && templates.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="font-medium text-gray-900">Template existant</h3>
                </div>
                <div className="space-y-3">
                  <Select onValueChange={(templateId: string) => handleApplyTemplate(templateId)} disabled={applyTemplateMutation.isPending}>
                    <SelectTrigger className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300">
                      <Edit className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sélectionner un template..." />
                      {applyTemplateMutation.isPending && (
                        <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template: any) => (
                        <SelectItem key={template.id} value={template.id} className="cursor-pointer">
                          <div className="flex items-center">
                            <Edit className="h-4 w-4 mr-2 text-blue-600" />
                            <span>{template.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {steps && steps.length > 0 && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800">
                        <strong>Note:</strong> Ce projet contient déjà des étapes. 
                        L'application d'un nouveau template remplacera complètement la structure existante.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Steps */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Étapes du projet</CardTitle>
        </CardHeader>
        <CardContent>
          {steps && steps.length > 0 ? (
            <div className="space-y-4">
              {steps.map((step: Step) => (
                <div key={step.id} className={`border rounded-lg transition-all duration-200 ${
                  selectedStep === step.id 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  {/* Step Header - Clickable */}
                  <div 
                    className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                      selectedStep === step.id 
                        ? 'bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => toggleStepExpansion(step.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                        {step.order}
                      </div>
                      <div>
                        {editingStep === step.id ? (
                          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                            <Input
                              value={editingStepData.title}
                              onChange={(e) => setEditingStepData({ ...editingStepData, title: e.target.value })}
                              placeholder="Titre de l'étape"
                              className="w-64"
                            />
                            <Textarea
                              value={editingStepData.description}
                              onChange={(e) => setEditingStepData({ ...editingStepData, description: e.target.value })}
                              placeholder="Description de l'étape"
                              className="w-64"
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={handleSaveStep} disabled={updateStepMutation.isPending}>
                                <Save className="h-4 w-4 mr-1" />
                                Sauvegarder
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingStep(null)}>
                                <X className="h-4 w-4 mr-1" />
                                Annuler
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h3 className="font-semibold text-gray-900">{step.title}</h3>
                            {step.description && (
                              <p className="text-sm text-gray-600">{step.description}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-8 flex items-center justify-center px-2 bg-gray-100 rounded text-sm">
                        {step.status === 'PENDING' && 'En attente'}
                        {step.status === 'IN_PROGRESS' && 'En cours'}
                        {step.status === 'COMPLETED' && 'Terminé'}
                        {step.status === 'BLOCKED' && 'Bloqué'}
                        {step.status === 'SUSPENDED' && 'Suspendu'}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditStep(step)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteStep(step.id, step.title)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {expandedStep === step.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* Step Content - Collapsible */}
                  {expandedStep === step.id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      {/* Add Task Button */}
                      <div className="mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTask(step.id)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une tâche
                        </Button>
                      </div>

                      {/* Add Task Form */}
                      {addingTask === step.id && (
                        <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200">
                          <h4 className="font-medium text-gray-900 mb-3">Nouvelle tâche</h4>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="task-title">Titre</Label>
                              <Input
                                id="task-title"
                                value={newTaskData.title}
                                onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                                placeholder="Titre de la tâche"
                              />
                            </div>
                            <div>
                              <Label htmlFor="task-description">Description</Label>
                              <Textarea
                                id="task-description"
                                value={newTaskData.description}
                                onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                                placeholder="Description de la tâche"
                              />
                            </div>
                            <div>
                              <Label htmlFor="task-priority">Priorité</Label>
                              <Select
                                value={newTaskData.priority}
                                                                           onValueChange={(value: string) => 
                                  setNewTaskData({ ...newTaskData, priority: value as 'LOW' | 'MEDIUM' | 'HIGH' })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une priorité" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="LOW">Faible</SelectItem>
                                  <SelectItem value="MEDIUM">Moyenne</SelectItem>
                                  <SelectItem value="HIGH">Élevée</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={handleSaveNewTask} disabled={createTaskMutation.isPending}>
                                <Save className="h-4 w-4 mr-1" />
                                Créer
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setAddingTask(null)}>
                                <X className="h-4 w-4 mr-1" />
                                Annuler
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tasks */}
                      {step.tasks && step.tasks.length > 0 ? (
                        <div className="space-y-3">
                          {step.tasks.map((task: Task) => (
                            <div key={task.id} className={`bg-white rounded-lg border transition-all duration-200 ${
                              selectedTask === task.id 
                                ? 'border-blue-400 bg-blue-25 shadow-sm' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              {/* Task Header - Clickable */}
                              <div 
                                className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                                  selectedTask === task.id 
                                    ? 'bg-blue-25' 
                                    : 'hover:bg-gray-50'
                                }`}
                                onClick={() => toggleTaskExpansion(step.id, task.id)}
                              >
                                <div className="flex items-center space-x-3">
                                  {getStatusIcon(task.status)}
                                  <div>
                                    {editingTask === task.id ? (
                                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                                        <Input
                                          value={editingTaskData.title}
                                          onChange={(e) => setEditingTaskData({ ...editingTaskData, title: e.target.value })}
                                          placeholder="Titre de la tâche"
                                          className="w-64"
                                        />
                                        <Textarea
                                          value={editingTaskData.description}
                                          onChange={(e) => setEditingTaskData({ ...editingTaskData, description: e.target.value })}
                                          placeholder="Description de la tâche"
                                          className="w-64"
                                        />
                                        <Select
                                          value={editingTaskData.priority}
                                          onValueChange={(value: string) => 
                                            setEditingTaskData({ ...editingTaskData, priority: value as 'LOW' | 'MEDIUM' | 'HIGH' })
                                          }
                                        >
                                          <SelectTrigger className="w-32">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="LOW">Faible</SelectItem>
                                            <SelectItem value="MEDIUM">Moyenne</SelectItem>
                                            <SelectItem value="HIGH">Élevée</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <div className="flex space-x-2">
                                          <Button size="sm" onClick={handleSaveTask} disabled={updateTaskMutation.isPending}>
                                            <Save className="h-4 w-4 mr-1" />
                                            Sauvegarder
                                          </Button>
                                          <Button size="sm" variant="outline" onClick={() => setEditingTask(null)}>
                                            <X className="h-4 w-4 mr-1" />
                                            Annuler
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                                        {task.description && (
                                          <p className="text-sm text-gray-600">{task.description}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getPriorityColor(task.priority)}>
                                    {task.priority === 'HIGH' ? 'Élevée' :
                                     task.priority === 'MEDIUM' ? 'Moyenne' : 'Faible'}
                                  </Badge>
                                  <div className="relative status-dropdown-container">
                                    <button
                                      className={`w-32 h-8 text-xs border border-gray-300 bg-white hover:bg-gray-50 rounded-md px-2 flex items-center justify-between ${getStatusColor(task.status)}`}
                                                                             onClick={(e) => {
                                         e.stopPropagation()
                                         // Close all other dropdowns first
                                         document.querySelectorAll('[id^="status-dropdown-"]').forEach(dropdown => {
                                           if (dropdown.id !== `status-dropdown-${task.id}`) {
                                             dropdown.classList.add('hidden')
                                           }
                                         })
                                         // Toggle dropdown state for this specific task
                                         const dropdownId = `status-dropdown-${task.id}`
                                         const dropdown = document.getElementById(dropdownId)
                                         const chevron = document.getElementById(`chevron-${task.id}`)
                                         if (dropdown) {
                                           const isHidden = dropdown.classList.contains('hidden')
                                           if (isHidden) {
                                             dropdown.classList.remove('hidden')
                                             chevron?.classList.add('rotate-180')
                                           } else {
                                             dropdown.classList.add('hidden')
                                             chevron?.classList.remove('rotate-180')
                                           }
                                         }
                                       }}
                                    >
                                                                             <div className="flex items-center space-x-1">
                                         {getStatusIcon(task.status)}
                                         <span className="text-xs">{getStatusLabel(task.status)}</span>
                                       </div>
                                       <ChevronDown className="h-3 w-3 transition-transform" id={`chevron-${task.id}`} />
                                    </button>
                                    
                                    <div
                                      id={`sytatus-dropdown-${task.id}`}
                                      className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 shadow-lg rounded-md hidden"
                                    >
                                      <div 
                                        className="cursor-pointer hover:bg-gray-100 p-2 flex items-center space-x-2"
                                                                                 onClick={(e) => {
                                           e.stopPropagation()
                                           handleUpdateTaskStatus(task.id, 'TODO')
                                           document.getElementById(`status-dropdown-${task.id}`)?.classList.add('hidden')
                                           document.getElementById(`chevron-${task.id}`)?.classList.remove('rotate-180')
                                         }}
                                      >
                                        <Clock className="h-3 w-3 text-gray-600" />
                                        <span className="text-sm">À faire</span>
                                      </div>
                                      <div 
                                        className="cursor-pointer hover:bg-gray-100 p-2 flex items-center space-x-2"
                                                                                 onClick={(e) => {
                                           e.stopPropagation()
                                           handleUpdateTaskStatus(task.id, 'IN_PROGRESS')
                                           document.getElementById(`status-dropdown-${task.id}`)?.classList.add('hidden')
                                           document.getElementById(`chevron-${task.id}`)?.classList.remove('rotate-180')
                                         }}
                                      >
                                        <Clock className="h-3 w-3 text-blue-600" />
                                        <span className="text-sm">En cours</span>
                                      </div>
                                      <div 
                                        className="cursor-pointer hover:bg-gray-100 p-2 flex items-center space-x-2"
                                                                                 onClick={(e) => {
                                           e.stopPropagation()
                                           handleUpdateTaskStatus(task.id, 'REVIEW')
                                           document.getElementById(`status-dropdown-${task.id}`)?.classList.add('hidden')
                                           document.getElementById(`chevron-${task.id}`)?.classList.remove('rotate-180')
                                         }}
                                      >
                                        <AlertCircle className="h-3 w-3 text-orange-600" />
                                        <span className="text-sm">En révision</span>
                                      </div>
                                      <div 
                                        className="cursor-pointer hover:bg-gray-100 p-2 flex items-center space-x-2"
                                                                                 onClick={(e) => {
                                           e.stopPropagation()
                                           handleUpdateTaskStatus(task.id, 'DONE')
                                           document.getElementById(`status-dropdown-${task.id}`)?.classList.add('hidden')
                                           document.getElementById(`chevron-${task.id}`)?.classList.remove('rotate-180')
                                         }}
                                      >
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        <span className="text-sm">Terminé</span>
                                      </div>
                                      <div 
                                        className="cursor-pointer hover:bg-gray-100 p-2 flex items-center space-x-2"
                                                                                 onClick={(e) => {
                                           e.stopPropagation()
                                           handleUpdateTaskStatus(task.id, 'BLOCKED')
                                           document.getElementById(`status-dropdown-${task.id}`)?.classList.add('hidden')
                                           document.getElementById(`chevron-${task.id}`)?.classList.remove('rotate-180')
                                         }}
                                      >
                                        <AlertCircle className="h-3 w-3 text-red-600" />
                                        <span className="text-sm">Bloqué</span>
                                      </div>
                                      <div 
                                        className="cursor-pointer hover:bg-gray-100 p-2 flex items-center space-x-2"
                                                                                 onClick={(e) => {
                                           e.stopPropagation()
                                           handleUpdateTaskStatus(task.id, 'SUSPENDED')
                                           document.getElementById(`status-dropdown-${task.id}`)?.classList.add('hidden')
                                           document.getElementById(`chevron-${task.id}`)?.classList.remove('rotate-180')
                                         }}
                                      >
                                        <Clock className="h-3 w-3 text-yellow-600" />
                                        <span className="text-sm">Suspendu</span>
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditTask(task)
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteTask(task.id, task.title)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  {expandedTasks[step.id] === task.id ? (
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-500" />
                                  )}
                                </div>
                              </div>

                              {/* Task Content - Collapsible */}
                              {expandedTasks[step.id] === task.id && (
                                <div className="border-t border-gray-200 p-4 bg-gray-50">
                                  {/* Task Materials */}
                                  <TaskMaterials 
                                    taskId={task.id} 
                                    onAddMaterials={() => {
                                      console.log('Opening material selector for task:', task.id)
                                      setShowMaterialSelector(task.id)
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">Aucune tâche dans cette étape</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ListTodo className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune étape</h3>
              <p className="text-gray-500">
                Aucune étape n'a été créée pour ce projet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Material Selector Modal */}
      <Dialog open={!!showMaterialSelector} onOpenChange={(open) => !open && setShowMaterialSelector(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sélectionner des matériaux</DialogTitle>
          </DialogHeader>
          {showMaterialSelector && (
            <BulkMaterialSelector
              taskId={showMaterialSelector}
              onClose={() => {
                console.log('Closing material selector')
                setShowMaterialSelector(null)
              }}
              onSuccess={() => {
                console.log('Materials added successfully')
                setShowMaterialSelector(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectTemplatesAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  List,
  Settings,
  ArrowLeft
} from 'lucide-react'

interface Template {
  id: string
  name: string
  description?: string
  steps: TemplateStep[]
}

interface TemplateStep {
  id: string
  title: string
  description?: string
  order: number
  tasks: TemplateTask[]
}

interface TemplateTask {
  id: string
  title: string
  description?: string
  order: number
}

interface TemplateStepsEditorProps {
  template: Template
  onClose: () => void
}

export default function TemplateStepsEditor({ template, onClose }: TemplateStepsEditorProps) {
  const [steps] = useState<TemplateStep[]>(template.steps || [])
  const [editingStep, setEditingStep] = useState<TemplateStep | null>(null)
  const [editingTask, setEditingTask] = useState<{ stepId: string; task: TemplateTask } | null>(null)
  const [showStepForm, setShowStepForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  
  const { showNotification } = useNotifications()
  const queryClient = useQueryClient()

  // Add step mutation
  const addStepMutation = useMutation({
    mutationFn: (data: any) => projectTemplatesAPI.addStep(template.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      setShowStepForm(false)
      setEditingStep(null)
      showNotification({
        type: 'success',
        title: 'Étape ajoutée !',
        message: 'L\'étape a été ajoutée avec succès.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de l\'ajout de l\'étape.'
      })
    }
  })

  // Update step mutation
  const updateStepMutation = useMutation({
    mutationFn: ({ stepId, data }: { stepId: string; data: any }) => 
      projectTemplatesAPI.updateStep(template.id, stepId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      setShowStepForm(false)
      setEditingStep(null)
      showNotification({
        type: 'success',
        title: 'Étape mise à jour !',
        message: 'L\'étape a été mise à jour avec succès.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la mise à jour de l\'étape.'
      })
    }
  })

  // Delete step mutation
  const deleteStepMutation = useMutation({
    mutationFn: (stepId: string) => projectTemplatesAPI.deleteStep(template.id, stepId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      showNotification({
        type: 'success',
        title: 'Étape supprimée !',
        message: 'L\'étape a été supprimée avec succès.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la suppression de l\'étape.'
      })
    }
  })

  const handleAddStep = () => {
    setEditingStep(null)
    setShowStepForm(true)
  }

  const handleEditStep = (step: TemplateStep) => {
    setEditingStep(step)
    setShowStepForm(true)
  }

  const handleDeleteStep = (step: TemplateStep) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'étape "${step.title}" ?`)) {
      deleteStepMutation.mutate(step.id)
    }
  }

  const handleStepSubmit = (data: any) => {
    if (editingStep) {
      updateStepMutation.mutate({ stepId: editingStep.id, data })
    } else {
      addStepMutation.mutate(data)
    }
  }

  const handleAddTask = (stepId: string) => {
    setEditingTask({ stepId, task: { id: '', title: '', description: '', order: 0 } })
    setShowTaskForm(true)
  }

  const handleEditTask = (stepId: string, task: TemplateTask) => {
    setEditingTask({ stepId, task })
    setShowTaskForm(true)
  }

  const handleDeleteTask = (_stepId: string, task: TemplateTask) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ?`)) {
      // TODO: Implement task deletion
      showNotification({
        type: 'info',
        title: 'Fonctionnalité à venir',
        message: 'La suppression de tâche sera bientôt disponible.'
      })
    }
  }

  const handleTaskSubmit = (_data: any) => {
    // TODO: Implement task creation/update
    showNotification({
      type: 'info',
      title: 'Fonctionnalité à venir',
      message: 'La gestion des tâches sera bientôt disponible.'
    })
    setShowTaskForm(false)
    setEditingTask(null)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="btn-dropbox-ghost"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold text-[#202124]">
                Éditer les étapes : {template.name}
              </h2>
              <p className="text-[#5f6368] text-sm">
                Gérez les étapes et tâches de ce template
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="btn-dropbox-ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Add Step Button */}
          <div className="mb-6">
            <Button
              onClick={handleAddStep}
              className="btn-dropbox-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une étape
            </Button>
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            {steps.length === 0 ? (
              <div className="text-center py-8">
                <List className="h-12 w-12 text-[#5f6368] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#202124] mb-2">
                  Aucune étape définie
                </h3>
                <p className="text-[#5f6368] mb-4">
                  Commencez par ajouter des étapes à votre template
                </p>
                <Button onClick={handleAddStep} className="btn-dropbox-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une étape
                </Button>
              </div>
            ) : (
              steps.map((step, index) => (
                <Card key={step.id} className="card-dropbox">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <GripVertical className="h-5 w-5 text-[#5f6368] cursor-move" />
                        <div className="flex-1">
                          <CardTitle className="text-[#202124] flex items-center gap-2">
                            Étape {index + 1}: {step.title}
                          </CardTitle>
                          {step.description && (
                            <p className="text-[#5f6368] mt-1">{step.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStep(step)}
                          className="btn-dropbox-ghost"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteStep(step)}
                          className="btn-dropbox-danger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Tasks Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-[#202124] flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Tâches ({step.tasks?.length || 0})
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTask(step.id)}
                          className="btn-dropbox-outline"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une tâche
                        </Button>
                      </div>

                      {step.tasks && step.tasks.length > 0 ? (
                        <div className="space-y-2">
                                                     {step.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between p-3 bg-[#f7f9fa] rounded-lg border border-[#e8eaed]"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <GripVertical className="h-4 w-4 text-[#5f6368] cursor-move" />
                                <div>
                                  <p className="font-medium text-[#202124]">
                                    {task.title}
                                  </p>
                                  {task.description && (
                                    <p className="text-sm text-[#5f6368]">{task.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditTask(step.id, task)}
                                  className="btn-dropbox-ghost"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTask(step.id, task)}
                                  className="btn-dropbox-danger"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-[#5f6368]">
                          Aucune tâche définie pour cette étape
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Step Form Modal */}
        {showStepForm && (
          <StepForm
            step={editingStep}
            onSubmit={handleStepSubmit}
            onCancel={() => {
              setShowStepForm(false)
              setEditingStep(null)
            }}
            isLoading={addStepMutation.isPending || updateStepMutation.isPending}
          />
        )}

        {/* Task Form Modal */}
        {showTaskForm && editingTask && (
          <TaskForm
            task={editingTask.task}
            onSubmit={handleTaskSubmit}
            onCancel={() => {
              setShowTaskForm(false)
              setEditingTask(null)
            }}
            isLoading={false}
          />
        )}
      </div>
    </div>
  )
}

// Step Form Component
interface StepFormProps {
  step?: TemplateStep | null
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

function StepForm({ step, onSubmit, onCancel, isLoading = false }: StepFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0
  })

  useEffect(() => {
    if (step) {
      setFormData({
        title: step.title,
        description: step.description || '',
        order: step.order
      })
    }
  }, [step])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#202124]">
            {step ? 'Modifier l\'étape' : 'Nouvelle étape'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="btn-dropbox-ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="title" className="text-[#202124] font-medium">
              Titre de l'étape *
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Planification"
              className="input-dropbox mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-[#202124] font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de l'étape..."
              className="input-dropbox mt-1"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="btn-dropbox-outline flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="btn-dropbox-primary flex-1"
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? 'Enregistrement...' : (step ? 'Mettre à jour' : 'Créer')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Task Form Component
interface TaskFormProps {
  task?: TemplateTask | null
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

function TaskForm({ task, onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        order: task.order
      })
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#202124]">
            {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="btn-dropbox-ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="taskTitle" className="text-[#202124] font-medium">
              Titre de la tâche *
            </Label>
            <Input
              id="taskTitle"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Créer le plan de construction"
              className="input-dropbox mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="taskDescription" className="text-[#202124] font-medium">
              Description
            </Label>
            <Textarea
              id="taskDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la tâche..."
              className="input-dropbox mt-1"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="btn-dropbox-outline flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="btn-dropbox-primary flex-1"
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? 'Enregistrement...' : (task ? 'Mettre à jour' : 'Créer')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

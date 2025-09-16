import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectTemplatesAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  List, 

} from 'lucide-react'
import TemplateForm from '@/components/TemplateForm'
import TemplateStepsEditor from '@/components/TemplateStepsEditor'

interface Template {
  id: string
  name: string
  description?: string
  isDefault: boolean
  steps: TemplateStep[]
  createdAt: string
  updatedAt: string
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

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [showStepsEditor, setShowStepsEditor] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const { showNotification } = useNotifications()
  const queryClient = useQueryClient()

  // Fetch templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: projectTemplatesAPI.getAll,
  })

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: projectTemplatesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      setShowTemplateForm(false)
      setEditingTemplate(null)
      showNotification({
        type: 'success',
        title: 'Template créé !',
        message: 'Le template a été créé avec succès.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la création du template.'
      })
    }
  })

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => projectTemplatesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      setShowTemplateForm(false)
      setEditingTemplate(null)
      showNotification({
        type: 'success',
        title: 'Template mis à jour !',
        message: 'Le template a été mis à jour avec succès.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la mise à jour du template.'
      })
    }
  })

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: projectTemplatesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      if (selectedTemplate?.id === editingTemplate?.id) {
        setSelectedTemplate(null)
      }
      showNotification({
        type: 'success',
        title: 'Template supprimé !',
        message: 'Le template a été supprimé avec succès.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la suppression du template.'
      })
    }
  })

  // Filter templates based on search term
  const filteredTemplates = templates.filter((template: Template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setShowTemplateForm(true)
  }

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template)
    setShowTemplateForm(true)
  }

  const handleEditSteps = (template: Template) => {
    setSelectedTemplate(template)
    setShowStepsEditor(true)
  }

  const handleDeleteTemplate = (template: Template) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le template "${template.name}" ?`)) {
      deleteTemplateMutation.mutate(template.id)
    }
  }

  const handleTemplateSubmit = (data: any) => {
    if (editingTemplate) {
      updateTemplateMutation.mutate({ id: editingTemplate.id, data })
    } else {
      createTemplateMutation.mutate(data)
    }
  }

  const getStepCount = (template: Template) => {
    return template.steps?.length || 0
  }

  const getTaskCount = (template: Template) => {
    return template.steps?.reduce((total, step) => total + (step.tasks?.length || 0), 0) || 0
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Templates de Projets</h1>
            <p className="text-gray-600 mt-1 text-sm">
              Gérez vos templates de projets pour standardiser vos processus
            </p>
          </div>
          <Button 
            onClick={handleCreateTemplate}
            className="btn-primary mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Template
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un template..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 input-base"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template: Template) => (
          <Card key={template.id} className="card-base hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  {template.description && (
                    <CardDescription className="mt-2">
                      {template.description}
                    </CardDescription>
                  )}
                </div>
                {template.isDefault && (
                  <Badge className="badge-primary ml-2">
                    Par défaut
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Étapes: {getStepCount(template)}</span>
                  <span>Tâches: {getTaskCount(template)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSteps(template)}
                      className="btn-secondary"
                    >
                      <List className="h-4 w-4 mr-1" />
                      Étapes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                      className="btn-secondary"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template)}
                    className="btn-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-[#5f6368] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#202124] mb-2">
            {searchTerm ? 'Aucun template trouvé' : 'Aucun template créé'}
          </h3>
          <p className="text-[#5f6368] mb-4">
            {searchTerm 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Créez votre premier template pour standardiser vos processus'
            }
          </p>
          {!searchTerm && (
            <Button onClick={handleCreateTemplate} className="btn-dropbox-primary">
              <Plus className="h-4 w-4 mr-2" />
              Créer un template
            </Button>
          )}
        </div>
      )}

      {/* Template Form Modal */}
      {showTemplateForm && (
        <TemplateForm
          template={editingTemplate}
          onSubmit={handleTemplateSubmit}
          onCancel={() => {
            setShowTemplateForm(false)
            setEditingTemplate(null)
          }}
          isLoading={createTemplateMutation.isPending || updateTemplateMutation.isPending}
        />
      )}

      {/* Steps Editor Modal */}
      {showStepsEditor && selectedTemplate && (
        <TemplateStepsEditor
          template={selectedTemplate}
          onClose={() => {
            setShowStepsEditor(false)
            setSelectedTemplate(null)
          }}
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  Edit,
  ArrowLeft,
  ListTodo,
  Package,
  FileText,
  MessageSquare,
  Trash2
} from 'lucide-react'
import { projectsAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'
import ProjectOverview from '@/components/ProjectOverview'
import ProjectSteps from '@/components/ProjectSteps'
import ProjectEditForm from '@/components/ProjectEditForm'
import ProjectMaterials from '@/components/ProjectMaterials'
import ProjectFiles from '@/components/ProjectFiles'
import ProjectDiscussions from '@/components/ProjectDiscussions'

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()
  const [activeTab, setActiveTab] = useState('steps')
  const [showEditForm, setShowEditForm] = useState(false)

  // Fetch project data
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsAPI.getById(id!),
    enabled: !!id,
  })

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => projectsAPI.delete(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      showNotification({
        type: 'success',
        title: 'Projet supprimé',
        message: 'Le projet a été supprimé avec succès.'
      })
      navigate('/dashboard')
    },
    onError: () => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de supprimer le projet.'
      })
    }
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0061fe] mx-auto"></div>
          <p className="mt-2 text-[#5f6368]">Chargement du projet...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-red-600">Erreur lors du chargement du projet</p>
          <Button onClick={() => navigate('/projects')} className="mt-4">
            Retour aux projets
          </Button>
        </div>
      </div>
    )
  }

  const handleEdit = () => {
    setShowEditForm(true)
  }

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.')) {
      deleteProjectMutation.mutate(project.id)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/projects')}
        className="mb-6 text-[#5f6368] hover:text-[#202124]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux projets
      </Button>

      {/* Project Overview Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Détails du projet</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="btn-outline"
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="btn-outline text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={deleteProjectMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteProjectMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        </div>
        <ProjectOverview project={project} />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-lg border border-gray-200">
          <TabsTrigger 
            value="steps" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:hover:bg-blue-50 transition-all duration-200"
          >
            <ListTodo className="mr-2 h-4 w-4" />
            Étapes
          </TabsTrigger>
          <TabsTrigger 
            value="materials" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:hover:bg-blue-50 transition-all duration-200"
          >
            <Package className="mr-2 h-4 w-4" />
            Matériaux
          </TabsTrigger>
          <TabsTrigger 
            value="files" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:hover:bg-blue-50 transition-all duration-200"
          >
            <FileText className="mr-2 h-4 w-4" />
            Fichiers
          </TabsTrigger>
          <TabsTrigger 
            value="discussions" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:hover:bg-blue-50 transition-all duration-200"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Discussions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-6">
          <ProjectSteps projectId={project.id} />
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <ProjectMaterials projectId={project.id} />
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <ProjectFiles projectId={project.id} />
        </TabsContent>

        <TabsContent value="discussions" className="space-y-6">
          <ProjectDiscussions projectId={project.id} />
        </TabsContent>
      </Tabs>

      {/* Edit Form Modal */}
      {showEditForm && (
        <ProjectEditForm
          project={project}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  )
}

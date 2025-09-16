import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { Plus } from 'lucide-react'
import { projectsAPI, companySettingsAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'
import { handleApiError, getSuccessMessage } from '@/lib/errorHandler'
import Modal from '@/components/ui/Modal'

interface ProjectFormProps {
  clientId?: string
  project?: any // For editing existing project
  onClose?: () => void
  onSuccess?: () => void
}

export default function ProjectForm({ clientId, project, onClose, onSuccess }: ProjectFormProps) {
  const isEditing = !!project
  
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    budget: project?.budget?.toString() || '',
    status: project?.status || 'DRAFT',
    startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
    endDate: project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''
  })

  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  // Get company settings for currency
  const { data: companySettings } = useQuery({
    queryKey: ['company-settings'],
    queryFn: () => companySettingsAPI.get(),
  })

  // Helper function to get currency symbol
  const getCurrencySymbol = () => {
    switch (companySettings?.currency) {
      case 'USD': return '$'
      case 'EUR': return '€'
      case 'GBP': return '£'
      default: return '€'
    }
  }

  const createProjectMutation = useMutation({
    mutationFn: (data: any) => projectsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      const success = getSuccessMessage('CREATE', 'projet')
      showNotification({
        type: 'success',
        title: success.title,
        message: success.message
      })
      onSuccess?.()
      handleClose()
    },
    onError: (error: any) => {
      const errorNotification = handleApiError(error)
      showNotification({
        type: errorNotification.type,
        title: errorNotification.title,
        message: errorNotification.message
      })
    }
  })

  const updateProjectMutation = useMutation({
    mutationFn: (data: any) => projectsAPI.update(project!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', project!.id] })
      const success = getSuccessMessage('UPDATE', 'projet')
      showNotification({
        type: 'success',
        title: success.title,
        message: success.message
      })
      onSuccess?.()
      handleClose()
    },
    onError: (error: any) => {
      const errorNotification = handleApiError(error)
      showNotification({
        type: errorNotification.type,
        title: errorNotification.title,
        message: errorNotification.message
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const projectData = {
      ...formData,
      clientId: clientId || project?.clientId,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      startDate: formData.startDate ? formData.startDate : null,
      endDate: formData.endDate ? formData.endDate : null
    }
    
    if (isEditing) {
      updateProjectMutation.mutate(projectData)
    } else {
      createProjectMutation.mutate(projectData)
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title={isEditing ? 'Modifier le projet' : 'Nouveau projet'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre du projet *</Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Nom du projet"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description du projet"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget ({getCurrencySymbol()})</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="flex h-10 w-full items-center justify-between rounded-md border border-[#dadce0] bg-white px-3 py-2 text-sm text-[#202124] placeholder:text-[#9aa0a6] focus:outline-none focus:ring-2 focus:ring-[#0061fe] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="DRAFT">Brouillon</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="COMPLETED">Terminé</option>
              <option value="CANCELLED">Annulé</option>
              <option value="SUSPENDED">Suspendu</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Date de début</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Date de fin</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button
            type="submit"
            className="flex-1 btn-dropbox-primary"
            disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            {createProjectMutation.isPending || updateProjectMutation.isPending 
              ? (isEditing ? 'Mise à jour...' : 'Création...') 
              : (isEditing ? 'Mettre à jour' : 'Créer le projet')
            }
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="btn-dropbox-outline"
          >
            Annuler
          </Button>
        </div>
      </form>
    </Modal>
  )
}

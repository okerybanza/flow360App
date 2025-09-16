import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { X, Save, Loader2, AlertTriangle } from 'lucide-react'
import { projectsAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'
import { useCompanySettings } from '@/hooks/useCompanySettings'

interface ProjectEditFormProps {
  project: {
    id: string
    title: string
    description?: string
    status: string
    budget?: number
    startDate?: string
    endDate?: string
    client: {
      id: string
      firstName: string
      lastName: string
      email: string
      type: string
      companyName?: string
    }
  }
  onClose: () => void
  onSuccess?: () => void
}

export default function ProjectEditForm({ project, onClose, onSuccess }: ProjectEditFormProps) {
  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()
  const { settings: companySettings } = useCompanySettings()
  
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description || '',
    status: project.status,
    budget: project.budget || 0,
    startDate: project.startDate ? project.startDate.split('T')[0] : '',
    endDate: project.endDate ? project.endDate.split('T')[0] : '',
  })

  // Calculate automatic status based on project data
  const calculateAutomaticStatus = () => {
    // For now, return a mock calculation
    // In a real implementation, this would be based on project.steps and project.tasks
    return {
      automaticStatus: 'IN_PROGRESS',
      reason: 'Calculé automatiquement basé sur les étapes et tâches'
    }
  }
  
  const automaticStatusData = calculateAutomaticStatus()

  const [statusChanged, setStatusChanged] = useState(false)

  const updateProjectMutation = useMutation({
    mutationFn: (data: any) => projectsAPI.update(project.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', project.id] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      showNotification({
        type: 'success',
        title: 'Projet mis à jour !',
        message: 'Les informations du projet ont été modifiées avec succès.'
      })
      onSuccess?.()
      onClose()
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la mise à jour du projet.'
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const updateData = {
      ...formData,
      budget: formData.budget > 0 ? formData.budget : null,
      // Send plain YYYY-MM-DD strings (or null) so backend can format them
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
    }

    updateProjectMutation.mutate(updateData)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Track if status was manually changed
    if (field === 'status') {
      setStatusChanged(true)
    }
  }

  const handleStatusChange = (value: string) => {
    // Prevent any form submission when changing status
    handleInputChange('status', value)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-[#202124]">Modifier le projet</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-[#5f6368] hover:text-[#202124]"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target !== e.currentTarget) {
              e.preventDefault()
            }
          }} onChange={(e) => {
            // Prevent form submission on select changes
            if (e.target instanceof HTMLSelectElement || (e.target as Element).closest('[role="combobox"]')) {
              e.preventDefault()
            }
          }}>
            {/* Project Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#202124] font-medium">
                Titre du projet *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Titre du projet"
                className="input-dropbox"
                required
              />
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#202124] font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Description du projet"
                className="input-dropbox min-h-[100px]"
                rows={4}
              />
            </div>

            {/* Project Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[#202124] font-medium">
                Statut du projet *
              </Label>
                              <Select
                  value={formData.status} 
                  onValueChange={handleStatusChange}
                >
                <SelectTrigger className="input-dropbox">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Brouillon</SelectItem>
                  <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                  <SelectItem value="COMPLETED">Terminé</SelectItem>
                  <SelectItem value="CANCELLED">Annulé</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Automatic Status Warning */}
              {automaticStatusData && statusChanged && formData.status !== automaticStatusData.automaticStatus && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Attention :</strong> Le statut automatique suggéré est "{automaticStatusData.automaticStatus}" 
                    ({automaticStatusData.reason}). Votre modification manuelle peut créer des incohérences.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Automatic Status Info */}
              {automaticStatusData && !statusChanged && (
                <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                  <strong>Statut automatique :</strong> {automaticStatusData.automaticStatus} 
                  ({automaticStatusData.reason})
                </div>
              )}
              

            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-[#202124] font-medium">
                Budget ({companySettings?.currency || 'USD'})
              </Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="input-dropbox"
                min="0"
                step="0.01"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-[#202124] font-medium">
                  Date de début
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="input-dropbox"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-[#202124] font-medium">
                  Date de fin
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="input-dropbox"
                />
              </div>
            </div>

            {/* Client Information (Read-only) */}
            <div className="space-y-2">
              <Label className="text-[#202124] font-medium">
                Client
              </Label>
              <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e8eaed]">
                <div className="text-[#202124] font-medium">
                  {project.client.type === 'COMPANY' && project.client.companyName 
                    ? project.client.companyName
                    : `${project.client.firstName} ${project.client.lastName}`
                  }
                </div>
                <div className="text-sm text-[#5f6368]">{project.client.email}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="btn-dropbox-outline"
                disabled={updateProjectMutation.isPending}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="btn-dropbox-primary"
                disabled={updateProjectMutation.isPending}
              >
                {updateProjectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

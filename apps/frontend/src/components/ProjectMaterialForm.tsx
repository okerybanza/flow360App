import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Plus, Package } from 'lucide-react'
import { materialsAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'

interface ProjectMaterialFormProps {
  projectId: string
  onSuccess?: () => void
}

export default function ProjectMaterialForm({ projectId, onSuccess }: ProjectMaterialFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    materialId: '',
    quantity: 1
  })

  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()

  // Fetch available materials from catalog
  const { data: materials, isLoading: materialsLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: () => materialsAPI.getAll(),
  })

  const addMaterialToProjectMutation = useMutation({
    mutationFn: (data: { materialId: string; quantity: number }) => 
      materialsAPI.addToProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-materials', projectId] })
      showNotification({
        type: 'success',
        title: 'Matériau ajouté !',
        message: 'Le matériau a été ajouté au projet.'
      })
      setFormData({ materialId: '', quantity: 1 })
      setIsOpen(false)
      onSuccess?.()
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de l\'ajout du matériau au projet.'
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.materialId && formData.quantity > 0) {
      addMaterialToProjectMutation.mutate(formData)
    }
  }

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="btn-dropbox-primary"
      >
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un matériau
      </Button>
    )
  }

  return (
    <Card className="card-dropbox">
      <CardHeader>
        <CardTitle className="text-[#202124] flex items-center">
          <Package className="mr-2 h-5 w-5 text-[#0061fe]" />
          Ajouter un matériau au projet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material">Matériau</Label>
              <select
                value={formData.materialId}
                onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-[#dadce0] bg-white px-3 py-2 text-sm text-[#202124] placeholder:text-[#9aa0a6] focus:outline-none focus:ring-2 focus:ring-[#0061fe] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={materialsLoading}
              >
                <option value="">Sélectionner un matériau</option>
                {materialsLoading ? (
                  <option value="">Chargement...</option>
                ) : (
                  materials?.map((material: any) => (
                    <option key={material.id} value={material.id}>
                      {material.name} - {material.brand} (€{material.price}/{material.unit})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                placeholder="1"
                min="0.01"
                step="0.01"
                required
                className="input-dropbox"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              type="submit" 
              className="btn-dropbox-primary flex-1"
              disabled={addMaterialToProjectMutation.isPending || !formData.materialId}
            >
              <Plus className="mr-2 h-4 w-4" />
              {addMaterialToProjectMutation.isPending ? 'Ajout...' : 'Ajouter au projet'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              className="btn-dropbox-outline"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

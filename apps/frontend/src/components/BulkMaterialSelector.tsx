import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Package, 
  Plus, 
  Search, 
  X,
  Check
} from 'lucide-react'
import { materialsAPI, tasksAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'

interface BulkMaterialSelectorProps {
  taskId: string
  onSuccess?: () => void
  onClose?: () => void
}

interface Material {
  id: string
  name: string
  brand?: string
  unit: string
  price: number
  currency: string
  category?: string
}

interface SelectedMaterial {
  materialId: string
  quantity: number
  material: Material
}

export default function BulkMaterialSelector({ taskId, onSuccess, onClose }: BulkMaterialSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([])
  
  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()

  // Fetch available materials
  const { data: materials, isLoading: materialsLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: () => materialsAPI.getAll(),
  })

  // Fetch task details
  const { data: task } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => tasksAPI.getById(taskId),
  })

  const addMaterialsToTaskMutation = useMutation({
    mutationFn: (materials: { materialId: string; quantity: number }[]) => 
      tasksAPI.addMaterials(taskId, materials),
    onSuccess: () => {
      // Invalidate all related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['task-materials', taskId] })
      queryClient.invalidateQueries({ queryKey: ['project-steps'] })
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      
      // Force refetch the specific task materials
      queryClient.refetchQueries({ queryKey: ['task-materials', taskId] })
      
      showNotification({
        type: 'success',
        title: 'Matériaux ajoutés !',
        message: `${selectedMaterials.length} matériau(x) ajouté(s) à la tâche.`
      })
      setSelectedMaterials([])
      onSuccess?.()
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de l\'ajout des matériaux.'
      })
    }
  })

  const filteredMaterials = materials?.filter((material: Material) => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  const categories = [...new Set(materials?.map((m: Material) => m.category).filter(Boolean) || [])] as string[]

  const handleMaterialToggle = (material: Material) => {
    const existingIndex = selectedMaterials.findIndex(sm => sm.materialId === material.id)
    
    if (existingIndex >= 0) {
      // Remove material
      setSelectedMaterials(prev => prev.filter((_, index) => index !== existingIndex))
    } else {
      // Add material with default quantity 1
      setSelectedMaterials(prev => [...prev, {
        materialId: material.id,
        quantity: 1,
        material
      }])
    }
  }

  const updateQuantity = (materialId: string, quantity: number) => {
    setSelectedMaterials(prev => 
      prev.map(sm => 
        sm.materialId === materialId 
          ? { ...sm, quantity: Math.max(0.01, quantity) }
          : sm
      )
    )
  }

  const handleSubmit = () => {
    if (selectedMaterials.length > 0) {
      const materialsData = selectedMaterials.map(sm => ({
        materialId: sm.materialId,
        quantity: sm.quantity
      }))
      addMaterialsToTaskMutation.mutate(materialsData)
    }
  }

  const isMaterialSelected = (materialId: string) => {
    return selectedMaterials.some(sm => sm.materialId === materialId)
  }

  const getSelectedMaterial = (materialId: string) => {
    return selectedMaterials.find(sm => sm.materialId === materialId)
  }

  const totalSelectedPrice = selectedMaterials.reduce((sum, sm) => {
    return sum + (sm.material.price * sm.quantity)
  }, 0)

  return (
    <Card className="card-dropbox">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#202124] flex items-center">
            <Package className="mr-2 h-5 w-5 text-[#0061fe]" />
            Sélectionner des matériaux pour: {task?.title}
          </CardTitle>
          <Button
            variant="ghost"
            onClick={onClose}
            className="btn-dropbox-ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9aa0a6]" />
              <Input
                placeholder="Rechercher des matériaux..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-dropbox"
              />
            </div>
          </div>
          <div className="w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0061fe] focus:border-[#0061fe] bg-white text-[#202124]"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {materialsLoading ? (
            <div className="col-span-full text-center py-8 text-[#5f6368]">
              Chargement des matériaux...
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="col-span-full text-center py-8 text-[#5f6368]">
              Aucun matériau trouvé
            </div>
          ) : (
            filteredMaterials.map((material: Material) => {
              const isSelected = isMaterialSelected(material.id)
              const selectedMaterial = getSelectedMaterial(material.id)
              
              return (
                <div
                  key={material.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-[#0061fe] bg-[#e8f2ff]' 
                      : 'border-[#dadce0] hover:border-[#0061fe] hover:bg-[#f8f9fa]'
                  }`}
                  onClick={() => handleMaterialToggle(material)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-[#202124]">{material.name}</h4>
                      {material.brand && (
                        <p className="text-sm text-[#5f6368]">{material.brand}</p>
                      )}
                    </div>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleMaterialToggle(material)}
                      className="ml-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {material.unit}
                    </Badge>
                    <span className="text-sm font-medium text-[#137333]">
                      {material.price} {material.currency}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-[#e8eaed]">
                      <Label htmlFor={`quantity-${material.id}`} className="text-xs text-[#5f6368]">
                        Quantité
                      </Label>
                      <Input
                        id={`quantity-${material.id}`}
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={selectedMaterial?.quantity || 1}
                        onChange={(e) => updateQuantity(material.id, parseFloat(e.target.value) || 0)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 input-dropbox text-sm"
                      />
                      <p className="text-xs text-[#5f6368] mt-1">
                        Total: {(selectedMaterial?.quantity || 1) * material.price} {material.currency}
                      </p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Selected Materials Summary */}
        {selectedMaterials.length > 0 && (
          <div className="border-t border-[#e8eaed] pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-[#202124]">
                Matériaux sélectionnés ({selectedMaterials.length})
              </h4>
              <span className="text-lg font-bold text-[#137333]">
                Total: {totalSelectedPrice.toFixed(2)} €
              </span>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {selectedMaterials.map((sm) => (
                <div key={sm.materialId} className="flex items-center justify-between p-2 bg-[#f8f9fa] rounded">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-[#137333]" />
                    <span className="text-sm font-medium">{sm.material.name}</span>
                    <span className="text-xs text-[#5f6368]">
                      {sm.quantity} {sm.material.unit}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[#137333]">
                    {(sm.quantity * sm.material.price).toFixed(2)} {sm.material.currency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-[#e8eaed]">
          <Button
            variant="outline"
            onClick={onClose}
            className="btn-dropbox-outline"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedMaterials.length === 0 || addMaterialsToTaskMutation.isPending}
            className="btn-dropbox-primary"
          >
            {addMaterialsToTaskMutation.isPending ? (
              'Ajout en cours...'
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter {selectedMaterials.length} matériau(x)
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

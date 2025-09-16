import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Plus, 
  Trash2,
  Euro
} from 'lucide-react'
import { tasksAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'

interface TaskMaterialsProps {
  taskId: string
  onAddMaterials?: () => void
}

interface TaskMaterial {
  id: string
  quantity: number
  totalPrice: number
  material: {
    id: string
    name: string
    brand?: string
    unit: string
    price: number
    currency: string
  }
}

export default function TaskMaterials({ taskId, onAddMaterials }: TaskMaterialsProps) {
  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()

  // Fetch task materials
  const { data: materials, isLoading, refetch } = useQuery({
    queryKey: ['task-materials', taskId],
    queryFn: () => tasksAPI.getMaterials(taskId),
    refetchOnWindowFocus: false,
    staleTime: 0, // Always consider data stale to ensure fresh data
  })

  const removeMaterialMutation = useMutation({
    mutationFn: ({ taskId, materialId }: { taskId: string; materialId: string }) => 
      tasksAPI.removeMaterial(taskId, materialId),
    onSuccess: () => {
      // Invalidate and refetch to ensure UI updates immediately
      queryClient.invalidateQueries({ queryKey: ['task-materials', taskId] })
      queryClient.invalidateQueries({ queryKey: ['project-steps'] })
      refetch() // Force refetch the current task materials
      showNotification({
        type: 'success',
        title: 'Matériau supprimé !',
        message: 'Le matériau a été retiré de la tâche.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la suppression du matériau.'
      })
    }
  })

  const handleRemoveMaterial = (materialId: string) => {
    if (confirm('Êtes-vous sûr de vouloir retirer ce matériau de la tâche ?')) {
      removeMaterialMutation.mutate({ taskId, materialId })
    }
  }

  const totalCost = materials?.reduce((sum: number, tm: TaskMaterial) => sum + tm.totalPrice, 0) || 0

  if (isLoading) {
    return (
      <Card className="card-dropbox">
        <CardHeader>
          <CardTitle className="text-[#202124] flex items-center">
            <Package className="mr-2 h-5 w-5 text-[#0061fe]" />
            Matériaux de la tâche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-[#5f6368]">
            Chargement...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-dropbox">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#202124] flex items-center">
            <Package className="mr-2 h-5 w-5 text-[#0061fe]" />
            Matériaux de la tâche
          </CardTitle>
          <Button
            size="sm"
            onClick={onAddMaterials}
            className="btn-dropbox-primary"
          >
            <Plus className="mr-1 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {materials && materials.length > 0 ? (
          <div className="space-y-4">
            {/* Materials List */}
            <div className="space-y-3">
              {materials.map((taskMaterial: TaskMaterial) => (
                <div
                  key={taskMaterial.id}
                  className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg border border-[#e8eaed]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#e8f2ff] rounded-lg">
                      <Package className="h-4 w-4 text-[#0061fe]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#202124]">
                        {taskMaterial.material.name}
                      </h4>
                      {taskMaterial.material.brand && (
                        <p className="text-sm text-[#5f6368]">
                          {taskMaterial.material.brand}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-[#5f6368]">
                          {taskMaterial.quantity} {taskMaterial.material.unit}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {taskMaterial.material.price} {taskMaterial.material.currency}/{taskMaterial.material.unit}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Euro className="h-3 w-3 text-[#137333]" />
                        <span className="font-medium text-[#137333]">
                          {taskMaterial.totalPrice.toFixed(2)} {taskMaterial.material.currency}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveMaterial(taskMaterial.material.id)}
                      disabled={removeMaterialMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Cost */}
            <div className="border-t border-[#e8eaed] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-[#202124]">
                  Coût total des matériaux
                </span>
                <div className="flex items-center space-x-2">
                  <Euro className="h-5 w-5 text-[#137333]" />
                  <span className="text-xl font-bold text-[#137333]">
                    {totalCost.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-[#dadce0] mb-4" />
            <h3 className="text-lg font-medium text-[#202124] mb-2">
              Aucun matériau assigné
            </h3>
            <p className="text-[#5f6368] mb-4">
              Ajoutez des matériaux à cette tâche pour commencer.
            </p>
            <Button
              onClick={onAddMaterials}
              className="btn-dropbox-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter des matériaux
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Package,
  Download,
  DollarSign,
  Clock
} from 'lucide-react'
import { projectStepsAPI } from '@/lib/api'
import { useCompanySettings } from '@/hooks/useCompanySettings'

interface ProjectMaterialsProps {
  projectId: string
}

interface AggregatedMaterial {
  id: string
  name: string
  brand?: string
  unit: string
  price: number
  currency: string
  category?: string
  totalQuantity: number
  totalCost: number
  tasks: string[]
}

export default function ProjectMaterials({ projectId }: ProjectMaterialsProps) {
  const { settings: companySettings } = useCompanySettings()
  const currency = companySettings?.currency || 'USD'

  // Fetch project steps with tasks and their materials
  const { data: steps, isLoading } = useQuery({
    queryKey: ['project-steps', projectId],
    queryFn: () => projectStepsAPI.getByProject(projectId),
  })

  // Aggregate materials from all tasks
  const aggregatedMaterials = steps?.reduce((acc: AggregatedMaterial[], step: any) => {
    step.tasks?.forEach((task: any) => {
      task.taskMaterials?.forEach((taskMaterial: any) => {
        const material = taskMaterial.material
        const existingMaterial = acc.find(m => m.id === material.id)
        
        if (existingMaterial) {
          existingMaterial.totalQuantity += taskMaterial.quantity
          existingMaterial.totalCost += taskMaterial.totalPrice
          if (!existingMaterial.tasks.includes(task.title)) {
            existingMaterial.tasks.push(task.title)
          }
        } else {
          acc.push({
            id: material.id,
            name: material.name,
            brand: material.brand,
            unit: material.unit,
            price: material.price,
            currency: material.currency,
            category: material.category,
            totalQuantity: taskMaterial.quantity,
            totalCost: taskMaterial.totalPrice,
            tasks: [task.title]
          })
        }
      })
    })
    return acc
  }, []) || []

  const totalProjectCost = aggregatedMaterials.reduce((sum: number, material: any) => sum + material.totalCost, 0)

  const handleExport = () => {
    const csvContent = [
      ['Material', 'Brand', 'Category', 'Unit', 'Price', 'Total Quantity', 'Total Cost', 'Used In Tasks'],
      ...aggregatedMaterials.map((material: any) => [
        material.name,
        material.brand || '',
        material.category || '',
        material.unit,
        `${material.price} ${material.currency}`,
        material.totalQuantity.toString(),
        `${material.totalCost.toFixed(2)} ${material.currency}`,
        material.tasks.join(', ')
      ])
    ].map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `project-materials-${projectId}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Matériaux du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Matériaux du projet</CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Coût total</div>
              <div className="text-xl font-semibold">
                {totalProjectCost.toFixed(2)} {currency}
              </div>
            </div>
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              disabled={aggregatedMaterials.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {aggregatedMaterials.length > 0 ? (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Package className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-semibold">{aggregatedMaterials.length}</div>
                <div className="text-sm text-gray-600">Matériaux</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-semibold">
                  {totalProjectCost.toFixed(0)} {currency}
                </div>
                <div className="text-sm text-gray-600">Coût total</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-semibold">
                  {new Set(aggregatedMaterials.flatMap((m: any) => m.tasks)).size}
                </div>
                <div className="text-sm text-gray-600">Tâches</div>
              </div>
            </div>

            {/* Materials List */}
            <div className="space-y-3">
                             {aggregatedMaterials.map((material: any) => (
                <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{material.name}</h3>
                      {material.brand && (
                        <p className="text-sm text-gray-500">Marque: {material.brand}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {material.totalCost.toFixed(2)} {material.currency}
                      </div>
                      <div className="text-sm text-gray-500">
                        {material.totalQuantity} {material.unit}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {material.category && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                        {material.category}
                      </Badge>
                    )}
                    <div className="text-xs text-gray-500">
                      {material.tasks.length} tâche{material.tasks.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun matériau</h3>
            <p className="text-gray-500">
              Aucun matériau n'a été assigné aux tâches de ce projet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

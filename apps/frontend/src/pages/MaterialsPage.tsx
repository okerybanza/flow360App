import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { materialsAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'
import MaterialForm from '@/components/MaterialForm'

import { Currency, CURRENCIES } from '@/lib/constants'

interface Material {
  id: string
  name: string
  brand?: string
  unit: string
  price: number
  currency: Currency
  category?: string
  description?: string
}

export default function MaterialsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD')
  const [showMaterialForm, setShowMaterialForm] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [expandedMaterials, setExpandedMaterials] = useState<Set<string>>(new Set())
  
  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()

  const { data: materials, isLoading, error } = useQuery({
    queryKey: ['materials'],
    queryFn: () => materialsAPI.getAll(),
  })

  const deleteMaterialMutation = useMutation({
    mutationFn: (id: string) => materialsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      showNotification({
        type: 'success',
        title: 'Matériau supprimé !',
        message: 'Le matériau a été supprimé du catalogue.'
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

  const handleDeleteMaterial = (materialId: string, materialName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le matériau "${materialName}" ?`)) {
      deleteMaterialMutation.mutate(materialId)
    }
  }

  const toggleExpanded = (materialId: string) => {
    const newExpanded = new Set(expandedMaterials)
    if (newExpanded.has(materialId)) {
      newExpanded.delete(materialId)
    } else {
      newExpanded.add(materialId)
    }
    setExpandedMaterials(newExpanded)
  }

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material)
    setShowMaterialForm(true)
  }

  const handleFormSuccess = () => {
    setShowMaterialForm(false)
    setEditingMaterial(null)
  }

  const filteredMaterials = materials?.filter((material: Material) => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory
    const matchesCurrency = material.currency === selectedCurrency
    return matchesSearch && matchesCategory && matchesCurrency
  }) || []

  const categories = [...new Set(materials?.map((m: Material) => m.category).filter(Boolean) || [])] as string[]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#202124]">Catalogue Matériaux</h1>
          <div className="h-10 w-32 bg-[#e8eaed] rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-[#e8eaed] rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-[#d93025] mb-4">
          Erreur lors du chargement des matériaux: {error.message}
        </div>
        <Button onClick={() => window.location.reload()} className="btn-dropbox-primary">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Catalogue Matériaux</h1>
            <p className="text-gray-600 mt-1 text-sm">
              Gérez votre catalogue de matériaux • {CURRENCIES[selectedCurrency].name} ({CURRENCIES[selectedCurrency].symbol})
            </p>
          </div>
          <Button onClick={() => setShowMaterialForm(true)} className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Matériau
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un matériau..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 input-base"
          />
        </div>
        <div className="md:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-base w-full"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="md:w-48">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
            className="input-base w-full"
          >
            {Object.entries(CURRENCIES).map(([code, currency]) => (
              <option key={code} value={code}>
                {currency.symbol} - {currency.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Material Form Modal */}
      {showMaterialForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingMaterial ? 'Modifier le matériau' : 'Nouveau Matériau'}
              </h2>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowMaterialForm(false)
                  setEditingMaterial(null)
                }}
                className="btn-ghost"
              >
                ✕
              </Button>
            </div>
            <MaterialForm 
              material={editingMaterial}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}

      {/* Materials List - Simple Accordion Style */}
      {filteredMaterials.length > 0 ? (
        <div className="space-y-2">
          {filteredMaterials.map((material: Material) => (
            <Card key={material.id} className="border border-gray-200 shadow-sm">
              <CardContent className="p-0">
                {/* Header - Always Visible */}
                <div 
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => toggleExpanded(material.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-gray-400">
                        {expandedMaterials.has(material.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {material.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {material.brand && `${material.brand} • `}
                          {CURRENCIES[material.currency].symbol} {material.price.toLocaleString('fr-FR')} / {material.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditMaterial(material)
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteMaterial(material.id, material.name)
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedMaterials.has(material.id) && (
                  <div className="px-6 pb-4 border-t border-gray-100 bg-gray-50">
                    <div className="pt-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Nom</label>
                          <p className="text-sm text-gray-900">{material.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Marque</label>
                          <p className="text-sm text-gray-900">{material.brand || 'Non spécifiée'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Prix</label>
                          <p className="text-sm text-gray-900">
                            {CURRENCIES[material.currency].symbol} {material.price.toLocaleString('fr-FR')} / {material.unit}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Catégorie</label>
                          <p className="text-sm text-gray-900">{material.category || 'Non catégorisé'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Unité</label>
                          <p className="text-sm text-gray-900">{material.unit}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Devise</label>
                          <p className="text-sm text-gray-900">{CURRENCIES[material.currency].name}</p>
                        </div>
                      </div>
                      {material.description && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Description</label>
                          <p className="text-sm text-gray-900 mt-1">{material.description}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-700">ID</label>
                        <p className="text-sm text-gray-500 font-mono">{material.id}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <div className="w-12 h-12 mx-auto border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center">
              <Plus className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategory !== 'all' || selectedCurrency !== 'USD' ? 'Aucun matériau trouvé' : 'Aucun matériau'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedCategory !== 'all' || selectedCurrency !== 'USD'
              ? 'Aucun matériau ne correspond à vos critères de recherche.'
              : 'Commencez par ajouter votre premier matériau au catalogue.'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && selectedCurrency === 'USD' && (
            <Button onClick={() => setShowMaterialForm(true)} className="btn-dropbox-primary">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un matériau
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

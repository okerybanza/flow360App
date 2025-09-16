import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { materialsAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'
import { MATERIAL_UNITS, MATERIAL_CATEGORIES, CURRENCIES, Currency } from '@/lib/constants'

interface MaterialFormProps {
  material?: any // For editing existing material
  onSuccess?: () => void
}

export default function MaterialForm({ material, onSuccess }: MaterialFormProps) {
  const isEditing = !!material
  
  const [formData, setFormData] = useState({
    name: material?.name || '',
    brand: material?.brand || '',
    unit: material?.unit || '',
    price: material?.price || 0,
    currency: material?.currency || 'USD' as Currency,
    category: material?.category || ''
  })

  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()

  const createMaterialMutation = useMutation({
    mutationFn: (data: typeof formData) => materialsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      showNotification({
        type: 'success',
        title: 'Matériau créé !',
        message: 'Le matériau a été ajouté au catalogue.'
      })
      setFormData({
        name: '',
        brand: '',
        unit: '',
        price: 0,
        currency: 'USD',
        category: ''
      })
      onSuccess?.()
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la création du matériau.'
      })
    }
  })

  const updateMaterialMutation = useMutation({
    mutationFn: (data: typeof formData) => materialsAPI.update(material!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      showNotification({
        type: 'success',
        title: 'Matériau modifié !',
        message: 'Le matériau a été mis à jour avec succès.'
      })
      onSuccess?.()
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la modification du matériau.'
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isEditing) {
      updateMaterialMutation.mutate(formData)
    } else {
      createMaterialMutation.mutate(formData)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du matériau *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Ciment Portland"
                required
                className="input-dropbox"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marque</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Ex: Lafarge"
                className="input-dropbox"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unité *</Label>
              <select
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
                className="w-full px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0061fe] focus:border-[#0061fe] bg-white text-[#202124]"
              >
                <option value="">Sélectionner une unité</option>
                {MATERIAL_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Prix *</Label>
              <div className="flex">
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                  className="px-3 py-2 border border-r-0 border-[#dadce0] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#0061fe] focus:border-[#0061fe] bg-white text-[#202124]"
                >
                  {Object.entries(CURRENCIES).map(([code, currency]) => (
                    <option key={code} value={code}>
                      {currency.symbol} - {currency.name}
                    </option>
                  ))}
                </select>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className="input-dropbox rounded-l-none"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="category">Catégorie</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0061fe] focus:border-[#0061fe] bg-white text-[#202124]"
              >
                <option value="">Sélectionner une catégorie</option>
                {MATERIAL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full btn-dropbox-primary"
            disabled={createMaterialMutation.isPending || updateMaterialMutation.isPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            {createMaterialMutation.isPending || updateMaterialMutation.isPending 
              ? (isEditing ? 'Modification...' : 'Création...') 
              : (isEditing ? 'Modifier le matériau' : 'Ajouter au catalogue')
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

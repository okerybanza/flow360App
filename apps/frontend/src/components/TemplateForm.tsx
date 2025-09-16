import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

interface Template {
  id: string
  name: string
  description?: string
  isDefault: boolean
}

interface TemplateFormProps {
  template?: Template | null
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function TemplateForm({ template, onSubmit, onCancel, isLoading = false }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isDefault: false
  })

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description || '',
        isDefault: template.isDefault
      })
    }
  }, [template])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#202124]">
            {template ? 'Modifier le template' : 'Nouveau template'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="btn-dropbox-ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name" className="text-[#202124] font-medium">
              Nom du template *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Template de construction standard"
              className="input-dropbox mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-[#202124] font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description du template et de son utilisation..."
              className="input-dropbox mt-1"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => handleChange('isDefault', e.target.checked)}
              className="rounded border-gray-300 text-[#0061fe] focus:ring-[#0061fe]"
            />
            <Label htmlFor="isDefault" className="text-[#202124] font-medium">
              Template par défaut
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="btn-dropbox-outline flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="btn-dropbox-primary flex-1"
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? 'Enregistrement...' : (template ? 'Mettre à jour' : 'Créer')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

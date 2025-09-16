import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, ChevronDown } from 'lucide-react'
import { clientsAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'
import { handleApiError, getSuccessMessage } from '@/lib/errorHandler'

interface ClientFormInlineProps {
  client?: any // For editing existing client
  onSuccess?: (clientData: any) => void
}

export default function ClientFormInline({ client, onSuccess }: ClientFormInlineProps) {
  const isEditing = !!client
  
  const [formData, setFormData] = useState({
    firstName: client?.firstName || '',
    lastName: client?.lastName || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || '',
    type: client?.type || 'INDIVIDUAL',
    companyName: client?.companyName || '',
    website: client?.website || ''
  })

  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()

  const createClientMutation = useMutation({
    mutationFn: (data: typeof formData) => clientsAPI.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      const success = getSuccessMessage('CREATE', 'client')
      showNotification({
        type: 'success',
        title: success.title,
        message: success.message
      })
      onSuccess?.(response)
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

  const updateClientMutation = useMutation({
    mutationFn: (data: typeof formData) => clientsAPI.update(client!.id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      const success = getSuccessMessage('UPDATE', 'client')
      showNotification({
        type: 'success',
        title: success.title,
        message: success.message
      })
      onSuccess?.(response)
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
    
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      showNotification({
        type: 'error',
        title: 'Erreur de validation',
        message: 'Veuillez remplir tous les champs obligatoires'
      })
      return
    }
    
    if (formData.type === 'COMPANY' && !formData.companyName.trim()) {
      showNotification({
        type: 'error',
        title: 'Erreur de validation',
        message: 'Le nom de l\'entreprise est obligatoire pour un client entreprise'
      })
      return
    }

    // Format website URL
    const formattedData = {
      ...formData,
      website: formData.website && !formData.website.startsWith('http') 
        ? `https://${formData.website}` 
        : formData.website
    }
    
    if (isEditing) {
      updateClientMutation.mutate(formattedData)
    } else {
      createClientMutation.mutate(formattedData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Client Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="clientType">Type de client *</Label>
        <div className="relative">
          <select
            id="clientType"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'INDIVIDUAL' | 'COMPANY' })}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Choisir le type de client</option>
            <option value="INDIVIDUAL">👤 Particulier</option>
            <option value="COMPANY">🏢 Entreprise</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
        {formData.type && (
          <p className="text-sm text-gray-600">
            {formData.type === 'INDIVIDUAL' 
              ? 'Client particulier - informations personnelles' 
              : 'Client entreprise - informations de l\'entreprise + contact principal'
            }
          </p>
        )}
      </div>

      {/* Company Information */}
      {formData.type === 'COMPANY' && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900">Informations de l'entreprise</h3>
          <div className="space-y-2">
            <Label htmlFor="companyName">Nom de l'entreprise *</Label>
            <Input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Nom de l'entreprise"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Site web</Label>
            <Input
              id="website"
              type="text"
              value={formData.website ? formData.website.replace(/^https?:\/\//, '') : ''}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="exemple.com"
            />
            <p className="text-xs text-gray-500">
              Entrez le nom de domaine (ex: exemple.com) - https:// sera ajouté automatiquement
            </p>
          </div>
        </div>
      )}

      {/* Contact Person Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">
          {formData.type === 'COMPANY' ? 'Contact principal' : 'Informations personnelles'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              {formData.type === 'COMPANY' ? 'Prénom du contact *' : 'Prénom *'}
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder={formData.type === 'COMPANY' ? 'Prénom du contact' : 'Prénom'}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">
              {formData.type === 'COMPANY' ? 'Nom du contact *' : 'Nom *'}
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder={formData.type === 'COMPANY' ? 'Nom du contact' : 'Nom'}
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@exemple.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+33 1 23 45 67 89"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Adresse complète"
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button 
          type="submit" 
          className="flex-1 btn-dropbox-primary"
          disabled={createClientMutation.isPending || updateClientMutation.isPending}
        >
          <Plus className="mr-2 h-4 w-4" />
          {createClientMutation.isPending || updateClientMutation.isPending 
            ? (isEditing ? 'Modification...' : 'Création...') 
            : (isEditing ? 'Modifier le client' : 'Créer le client')
          }
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="btn-dropbox-outline"
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}

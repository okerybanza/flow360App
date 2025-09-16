import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Building, 
  Users, 
  FolderOpen, 
  Edit, 
  Eye,
  AlertCircle,
  Clock
} from 'lucide-react'
import { clientsAPI, companySettingsAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'
import ClientForm from '@/components/ClientForm'
import ProjectForm from '@/components/ProjectForm'
import ClientCard from '@/components/ui/ClientCard'
import ClientListView from '@/components/ui/ClientListView'
import { 
  Grid3X3, 
  List, 
  Calendar, 
  DollarSign, 

} from 'lucide-react'
import ClientProjectFlow from '@/components/ClientProjectFlow'

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [showClientForm, setShowClientForm] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showClientProjectFlow, setShowClientProjectFlow] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'cards' | 'detail'>('list')
  
  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()
  const [searchParams] = useSearchParams()

  // Callback functions for forms
  const handleClientFormClose = () => {
    setShowClientForm(false)
    setEditingClient(null)
  }

  const handleClientFormSuccess = (_response: any) => {
    setShowClientForm(false)
    setEditingClient(null)
  }

  const handleProjectFormClose = () => {
    setShowProjectForm(false)
  }

  const handleProjectFormSuccess = () => {
    setShowProjectForm(false)
  }

  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsAPI.getAll(),
  })

  // Get company settings for currency
  const { data: companySettings } = useQuery({
    queryKey: ['company-settings'],
    queryFn: () => companySettingsAPI.get(),
  })

  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => clientsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      showNotification({
        type: 'success',
        title: 'Client supprimé !',
        message: 'Le client a été supprimé avec succès.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la suppression du client.'
      })
    }
  })

  // Set the latest client as selected by default
  useEffect(() => {
    if (clients && clients.length > 0) {
      // Check if there's a selected client in URL params
      const selectedFromUrl = searchParams.get('selected')
      
      if (selectedFromUrl) {
        // Verify the client exists
        const clientExists = clients.find((client: any) => client.id === selectedFromUrl)
        if (clientExists) {
          setSelectedClientId(selectedFromUrl)
          setViewMode('detail')
          return
        }
      }
      
      // If no selected client from URL or client doesn't exist, select the latest client
      if (!selectedClientId) {
        const latestClient = clients.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
        setSelectedClientId(latestClient.id)
      }
    }
  }, [clients, selectedClientId, searchParams])

  const selectedClient = clients?.find((client: any) => client.id === selectedClientId)

  // Helper function to get currency symbol
  const getCurrencySymbol = () => {
    switch (companySettings?.currency) {
      case 'USD': return '$'
      case 'EUR': return '€'
      case 'GBP': return '£'
      default: return '€'
    }
  }

  const handleDeleteClient = (clientId: string, clientName: string) => {
    const client = clients?.find((c: any) => c.id === clientId)
    const projectCount = client?.projects?.length || 0
    
    // Première confirmation
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le client "${clientName}" ?`)) {
      return
    }
    
    // Deuxième confirmation si le client a des projets
    if (projectCount > 0) {
      const shouldDeleteProjects = confirm(
        `⚠️ ATTENTION : Ce client a ${projectCount} projet(s).\n\n` +
        `Voulez-vous vraiment supprimer le client ET tous ses projets ?\n\n` +
        `Cette action est irréversible !`
      )
      
      if (!shouldDeleteProjects) {
        return
      }
    }
    
    deleteClientMutation.mutate(clientId)
  }

  const filteredClients = clients?.filter((client: any) => {
    const fullName = `${client.firstName || ''} ${client.lastName || ''}`.trim()
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (client.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  }) || []



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Terminé'
      case 'IN_PROGRESS':
        return 'En cours'
      case 'DRAFT':
        return 'Planifié'
      case 'CANCELLED':
        return 'Annulé'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#202124]">Portfolio</h1>
          <div className="h-10 w-32 bg-[#dadce0] rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
        <p className="text-gray-600">Impossible de charger les clients</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Portfolio</h1>
            <p className="text-gray-600 mt-1 text-sm">Vos clients et leurs projets</p>
          </div>
          <div className="flex items-center space-x-3">
            {viewMode === 'detail' && (
              <Button 
                variant="outline"
                onClick={() => setViewMode('cards')}
                className="btn-secondary"
              >
                ← Retour à la liste
              </Button>
            )}
            {viewMode !== 'detail' && (
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className={viewMode === 'cards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
                        <Button
              onClick={() => {
                setShowClientProjectFlow(true)
              }}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Client
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        /* Client List View */
        <ClientListView 
          clients={filteredClients} 
          onView={(clientId) => {
            setSelectedClientId(clientId)
            setViewMode('detail')
          }}
          onEdit={(clientId) => {
            const client = filteredClients.find((c: any) => c.id === clientId)
            if (client) {
              setEditingClient(client)
              setShowClientForm(true)
            }
          }}
          onDelete={(clientId) => {
            const client = filteredClients.find((c: any) => c.id === clientId)
            if (client) {
              handleDeleteClient(clientId, `${client.firstName || ''} ${client.lastName || ''}`.trim())
            }
          }}
          onViewProjects={(clientId) => {
            setSelectedClientId(clientId)
            setViewMode('detail')
          }}
          onAddProject={(clientId) => {
            const client = filteredClients.find((c: any) => c.id === clientId)
            if (client) {
              setSelectedClientId(clientId)
              setShowProjectForm(true)
            }
          }}
        />
      ) : viewMode === 'cards' ? (
        /* Client Card View */
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-base"
            />
          </div>

          {/* Client Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClients.map((client: any) => (
              <ClientCard 
                key={client.id}
                client={client}
                onView={() => {
                  setSelectedClientId(client.id)
                  setViewMode('detail')
                }}
                onEdit={() => {
                  setEditingClient(client)
                  setShowClientForm(true)
                }}
                onDelete={() => handleDeleteClient(client.id, `${client.firstName || ''} ${client.lastName || ''}`.trim())}
                onViewProjects={() => {
                  setSelectedClientId(client.id)
                  setViewMode('detail')
                }}
              />
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Aucun client ne correspond à votre recherche' : 'Commencez par ajouter votre premier client'}
              </p>
              <Button
                onClick={() => {
                  setShowClientProjectFlow(true)
                }}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un client
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Client Detail View */
        <div className="space-y-6">
          {selectedClient && (
            <>
              {/* Client Header */}
              <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16 border-2 border-white">
                        <AvatarImage src={undefined} alt={selectedClient.firstName} />
                        <AvatarFallback className="bg-blue-500 text-white font-bold text-lg">
                          {selectedClient.type === 'COMPANY' && selectedClient.companyName 
                            ? selectedClient.companyName.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2)
                            : `${selectedClient.firstName?.[0] || ''}${selectedClient.lastName?.[0] || ''}`.toUpperCase()
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-2xl font-bold">
                          {selectedClient.type === 'COMPANY' && selectedClient.companyName 
                            ? selectedClient.companyName 
                            : `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim() || 'Nom non défini'
                          }
                        </h1>
                        <p className="text-blue-100 mt-1">
                          {selectedClient.type === 'COMPANY' 
                            ? `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim() || 'Contact non défini'
                            : selectedClient.email
                          }
                        </p>
                        {selectedClient.type === 'COMPANY' && (
                          <p className="text-blue-100 text-sm">{selectedClient.email}</p>
                        )}
                        <div className="flex items-center mt-2 space-x-4">
                          <Badge className="bg-green-500 text-white">
                            {selectedClient.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                          </Badge>
                          <span className="text-blue-100 text-sm">
                            Client depuis {new Date(selectedClient.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                        onClick={() => {
                          setEditingClient(selectedClient)
                          setShowClientForm(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border border-gray-200 rounded-lg shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                    Informations de Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{selectedClient.email || 'Non renseigné'}</p>
                      </div>
                    </div>
                    {selectedClient.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Téléphone</p>
                          <p className="text-sm text-gray-600">{selectedClient.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedClient.address && (
                      <div className="flex items-center space-x-3 md:col-span-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Adresse</p>
                          <p className="text-sm text-gray-600">{selectedClient.address}</p>
                        </div>
                      </div>
                    )}
                    {selectedClient.type === 'COMPANY' && selectedClient.website && (
                      <div className="flex items-center space-x-3 md:col-span-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Site web</p>
                          <a 
                            href={selectedClient.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {selectedClient.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Projects */}
              <Card className="border border-gray-200 rounded-lg shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                      <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
                      Projets ({selectedClient.projects?.length || 0})
                    </CardTitle>
                    <Button
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setShowProjectForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau Projet
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedClient.projects && selectedClient.projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedClient.projects.map((project: any) => (
                        <div
                          key={project.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
                          onClick={() => {
                            window.location.href = `/projects/${project.id}`
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">
                              {project.title}
                            </h4>
                            <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                              {getStatusText(project.status)}
                            </Badge>
                          </div>
                          
                          {project.description && (
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                              {project.description}
                            </p>
                          )}
                          
                          <div className="space-y-2">
                            {project.budget && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 flex items-center">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  Budget:
                                </span>
                                <span className="font-semibold text-green-600">{project.budget.toLocaleString('fr-FR')} {getCurrencySymbol()}</span>
                              </div>
                            )}
                            {project.startDate && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Début:
                                </span>
                                <span className="font-medium">{new Date(project.startDate).toLocaleDateString('fr-FR')}</span>
                              </div>
                            )}
                            {project.endDate && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Fin:
                                </span>
                                <span className="font-medium">{new Date(project.endDate).toLocaleDateString('fr-FR')}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                            <span className="text-xs text-blue-600 font-medium flex items-center justify-center">
                              <Eye className="h-3 w-3 mr-1" />
                              Voir le projet
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FolderOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucun projet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Ce client n'a pas encore de projets
                      </p>
                      <Button
                        onClick={() => setShowProjectForm(true)}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Créer un projet
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Forms */}
      {showClientForm && (() => {
        const clientFormProps = {
          client: editingClient,
          onClose: handleClientFormClose,
          onSuccess: handleClientFormSuccess
        }
        return <ClientForm {...clientFormProps} />
      })()}

      {showProjectForm && (() => {
        const projectFormProps = {
          clientId: selectedClientId || undefined,
          onClose: handleProjectFormClose,
          onSuccess: handleProjectFormSuccess
        }
        return <ProjectForm {...projectFormProps} />
      })()}

      {/* Client Project Flow */}
      {showClientProjectFlow && (
        <ClientProjectFlow
          onComplete={() => {
            setShowClientProjectFlow(false)
            // Refresh the clients list
            queryClient.invalidateQueries({ queryKey: ['clients'] })
          }}
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { 
  Users,
  Edit,
  Trash2,
  Eye,
  FolderOpen,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Plus,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  Play,
  AlertCircle,
  FileText
} from 'lucide-react'

interface ClientListViewProps {
  clients: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    address?: string
    type: 'INDIVIDUAL' | 'COMPANY'
    companyName?: string
    status: 'ACTIVE' | 'INACTIVE'
    createdAt: string
    projects?: Array<{
      id: string
      title: string
      status: string
      budget?: number
      startDate?: string
      endDate?: string
    }>
  }>
  onView?: (clientId: string) => void
  onEdit?: (clientId: string) => void
  onDelete?: (clientId: string) => void
  onViewProjects?: (clientId: string) => void
  onAddProject?: (clientId: string) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'INACTIVE':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Actif'
    case 'INACTIVE':
      return 'Inactif'
    default:
      return status
  }
}

const getProjectStatusColor = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'SUSPENDED':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getProjectStatusText = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'Brouillon'
    case 'IN_PROGRESS':
      return 'En cours'
    case 'COMPLETED':
      return 'Terminé'
    case 'CANCELLED':
      return 'Annulé'
    case 'SUSPENDED':
      return 'Suspendu'
    default:
      return status
  }
}

const getProjectStatusIcon = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return <FileText className="h-3 w-3" />
    case 'IN_PROGRESS':
      return <Play className="h-3 w-3" />
    case 'COMPLETED':
      return <CheckCircle className="h-3 w-3" />
    case 'CANCELLED':
      return <AlertCircle className="h-3 w-3" />
    case 'SUSPENDED':
      return <Clock className="h-3 w-3" />
    default:
      return <Clock className="h-3 w-3" />
  }
}



const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export default function ClientListView({ 
  clients, 
  onView, 
  onEdit, 
  onDelete, 
  onViewProjects,
  onAddProject
}: ClientListViewProps) {
  const [expandedClient, setExpandedClient] = useState<string | null>(null)

  return (
    <Card className="border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900">Liste des Clients</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {clients.map((client) => {
            const isExpanded = expandedClient === client.id
            const displayName = client.type === 'COMPANY' && client.companyName 
              ? client.companyName 
              : `${client.firstName} ${client.lastName}`

            const contactInfo = client.type === 'COMPANY' 
              ? `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Contact non défini'
              : client.email

            const projectCount = client.projects?.length || 0
            const activeProjects = client.projects?.filter((p: any) => p.status === 'IN_PROGRESS').length || 0

            return (
              <div key={client.id}>
                <div 
                  className={`group flex items-center justify-between p-3 border rounded-lg transition-all duration-200 cursor-pointer ${
                    isExpanded 
                      ? 'bg-[#137333] border-[#137333] text-white' 
                      : 'border-[#e8eaed] hover:bg-[#f7f9fa] hover:border-[#137333]'
                  }`}
                  onClick={() => {
                    setExpandedClient(isExpanded ? null : client.id)
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage src={undefined} alt={displayName} />
                      <AvatarFallback className={`font-semibold text-sm ${
                        isExpanded 
                          ? 'bg-white/20 text-white' 
                          : 'bg-[#e6f4ea] text-[#137333] group-hover:bg-[#137333] group-hover:text-white'
                      }`}>
                        {client.type === 'COMPANY' && client.companyName
                          ? client.companyName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
                          : `${client.firstName?.[0] || ''}${client.lastName?.[0] || ''}`.toUpperCase()
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className={`font-medium transition-colors ${
                        isExpanded 
                          ? 'text-white' 
                          : 'text-[#202124] group-hover:text-[#137333]'
                      }`}>
                        {displayName}
                      </h4>
                      <p className={`text-sm ${
                        isExpanded 
                          ? 'text-white/80' 
                          : 'text-[#5f6368]'
                      }`}>
                        {contactInfo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {projectCount > 0 && (
                      <Badge className={`text-xs ${
                        isExpanded 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-[#e8f2ff] text-[#0061fe]'
                      }`}>
                        {projectCount} projet{projectCount > 1 ? 's' : ''}
                      </Badge>
                    )}
                    <ArrowUpRight className={`h-4 w-4 transition-colors ${
                      isExpanded 
                        ? 'text-white' 
                        : 'text-[#5f6368] group-hover:text-[#137333]'
                    }`} />
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-2 space-y-4">
                    {/* Client Details Section */}
                    <div className="p-3 bg-[#f8f9fa] border border-[#e8eaed] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-[#202124]">Détails du client</span>
                        <div className="flex items-center space-x-1">
                          {onView && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="btn-dropbox-outline text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                onView(client.id)
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Voir fiche
                            </Button>
                          )}
                          {onEdit && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="btn-dropbox-outline text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                onEdit(client.id)
                              }}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Modifier
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="btn-dropbox-outline text-xs text-red-600 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDelete(client.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Supprimer
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-[#5f6368]" />
                          <span className="text-[#5f6368]">Email:</span>
                          <span className="font-medium text-[#202124]">
                            {client.email || 'Non renseigné'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-[#5f6368]" />
                          <span className="text-[#5f6368]">Téléphone:</span>
                          <span className="font-medium text-[#202124]">
                            {client.phone || 'Non renseigné'}
                          </span>
                        </div>
                        {client.address && (
                          <div className="flex items-center space-x-2 col-span-2">
                            <MapPin className="h-4 w-4 text-[#5f6368]" />
                            <span className="text-[#5f6368]">Adresse:</span>
                            <span className="font-medium text-[#202124]">
                              {client.address}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <span className="text-[#5f6368]">Type:</span>
                          <span className="font-medium text-[#202124]">
                            {client.type === 'COMPANY' ? 'Entreprise' : 'Particulier'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[#5f6368]">Projets actifs:</span>
                          <span className="font-medium text-[#202124]">
                            {activeProjects}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[#5f6368]">Statut:</span>
                          <Badge className={getStatusColor(client.status)}>
                            {getStatusText(client.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[#5f6368]">Créé le:</span>
                          <span className="font-medium text-[#202124]">
                            {formatDate(client.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Projects Section */}
                    <div className="p-3 bg-white border border-[#e8eaed] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-[#202124]">Projets</span>
                        {onAddProject && (
                          <Button
                            size="sm"
                            className="btn-dropbox-primary text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              onAddProject(client.id)
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Nouveau projet
                          </Button>
                        )}
                      </div>
                      
                      {client.projects && client.projects.length > 0 ? (
                        <div className="space-y-2">
                          {client.projects.map((project) => (
                            <div 
                              key={project.id}
                              className="flex items-center justify-between p-2 bg-[#f8f9fa] border border-[#e8eaed] rounded-lg hover:bg-[#f0f1f2] transition-colors cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (onViewProjects) {
                                  onViewProjects(client.id)
                                }
                              }}
                            >
                              <div className="flex items-center space-x-2">
                                <div className={`p-1 rounded ${
                                  project.status === 'DRAFT' ? 'bg-gray-100 text-gray-600' :
                                  project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' :
                                  project.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                                  project.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                                  project.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-600' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {getProjectStatusIcon(project.status)}
                                </div>
                                <div>
                                  <div className="font-medium text-[#202124] text-sm">
                                    {project.title}
                                  </div>
                                  <div className="flex items-center space-x-4 text-xs text-[#5f6368]">
                                    <Badge className={getProjectStatusColor(project.status)}>
                                      {getProjectStatusText(project.status)}
                                    </Badge>
                                    {project.startDate && (
                                      <span className="flex items-center space-x-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDate(project.startDate)}</span>
                                      </span>
                                    )}
                                    {project.budget && (
                                      <span className="flex items-center space-x-1">
                                        <DollarSign className="h-3 w-3" />
                                        <span>{formatCurrency(project.budget)}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <ArrowUpRight className="h-4 w-4 text-[#5f6368]" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-[#5f6368]">
                          <FolderOpen className="h-8 w-8 mx-auto mb-2 text-[#dadce0]" />
                          <p className="text-sm">Aucun projet pour ce client</p>
                          {onAddProject && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="btn-dropbox-outline text-xs mt-2"
                              onClick={(e) => {
                                e.stopPropagation()
                                onAddProject(client.id)
                              }}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Créer le premier projet
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          
          {clients.length === 0 && (
            <div className="text-center py-12 text-[#5f6368]">
              <Users className="h-16 w-16 mx-auto mb-4 text-[#dadce0]" />
              <p className="text-lg font-medium mb-2">Aucun client</p>
              <p className="text-sm">Commencez par ajouter vos premiers clients</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { 
  Building2,
  Mail,
  Phone,
  Users,
  FolderOpen,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'

interface ClientCardProps {
  client: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    address?: string
    type: 'INDIVIDUAL' | 'COMPANY'
    companyName?: string
    website?: string
    status: 'ACTIVE' | 'INACTIVE'
    projects?: Array<{
      id: string
      title: string
      status: string
      budget?: number
    }>
  }
  onView?: (clientId: string) => void
  onEdit?: (clientId: string) => void
  onDelete?: (clientId: string) => void
  onViewProjects?: (clientId: string) => void
  className?: string
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

const getClientTypeIcon = (type: string) => {
  return type === 'COMPANY' ? <Building2 className="h-4 w-4" /> : <Users className="h-4 w-4" />
}

const getClientTypeText = (type: string) => {
  return type === 'COMPANY' ? 'Entreprise' : 'Particulier'
}

export default function ClientCard({ 
  client, 
  onView, 
  onEdit, 
  onDelete, 
  onViewProjects,
  className = "" 
}: ClientCardProps) {
  const projectCount = client.projects?.length || 0
  const activeProjects = client.projects?.filter(p => p.status === 'IN_PROGRESS').length || 0
  const completedProjects = client.projects?.filter(p => p.status === 'COMPLETED').length || 0

  const displayName = client.type === 'COMPANY' && client.companyName 
    ? client.companyName 
    : `${client.firstName} ${client.lastName}`

  const initials = client.type === 'COMPANY' && client.companyName
    ? client.companyName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
    : `${client.firstName?.[0] || ''}${client.lastName?.[0] || ''}`.toUpperCase()

  return (
    <Card className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      <CardContent className="p-5">
        {/* Header with client info */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={undefined} alt={displayName} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-base">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 truncate">{displayName}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {getClientTypeIcon(client.type)}
                <span className="truncate">{getClientTypeText(client.type)}</span>
              </div>
            </div>
          </div>
          <Badge className={`${getStatusColor(client.status)} text-xs font-medium`}>
            {getStatusText(client.status)}
          </Badge>
        </div>

        {/* Contact info */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{client.email}</span>
          </div>
          {client.phone && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{client.phone}</span>
            </div>
          )}
        </div>

        {/* Project stats */}
        <div className="flex items-center justify-between mb-5 p-4 bg-gray-50 rounded-lg">
          <div className="text-center flex-1">
            <div className="font-bold text-gray-900 text-lg">{projectCount}</div>
            <div className="text-xs text-gray-500 font-medium">Projets</div>
          </div>
          <div className="text-center flex-1">
            <div className="font-bold text-blue-600 text-lg">{activeProjects}</div>
            <div className="text-xs text-gray-500 font-medium">Actifs</div>
          </div>
          <div className="text-center flex-1">
            <div className="font-bold text-green-600 text-lg">{completedProjects}</div>
            <div className="text-xs text-gray-500 font-medium">Terminés</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(client.id)}
                className="btn-secondary text-sm px-3 py-1.5"
              >
                <Eye className="h-4 w-4 mr-1.5" />
                Voir
              </Button>
            )}
            {onViewProjects && projectCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProjects(client.id)}
                className="btn-secondary text-sm px-3 py-1.5"
              >
                <FolderOpen className="h-4 w-4 mr-1.5" />
                Projets
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(client.id)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(client.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

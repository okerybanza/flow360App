import { Badge } from '@/components/ui/badge'
import { Calendar, User, DollarSign, Package } from 'lucide-react'
import { useCompanySettings } from '@/hooks/useCompanySettings'

interface ProjectOverviewProps {
  project: {
    id: string
    title: string
    description?: string
    status: string
    budget?: number
    startDate?: string
    endDate?: string
    client: {
      id: string
      firstName: string
      lastName: string
      email: string
      type: string
      companyName?: string
    }
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'Brouillon'
    case 'IN_PROGRESS':
      return 'En cours'
    case 'COMPLETED':
      return 'Terminé'
    case 'CANCELLED':
      return 'Annulé'
    default:
      return status
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  const { settings: companySettings } = useCompanySettings()
  const currency = companySettings?.currency || 'USD'

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h1>
          {project.description && (
            <p className="text-gray-600 mb-3 text-sm">{project.description}</p>
          )}
          <Badge className={getStatusColor(project.status)}>
            {getStatusText(project.status)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Budget */}
        <div className="stats-card">
          <DollarSign className="stats-icon text-green-600" />
          <div>
            <div className="stats-label">Budget</div>
            <div className="stats-value">
              {project.budget ? `${project.budget.toLocaleString()} ${currency}` : 'Non défini'}
            </div>
          </div>
        </div>

        {/* Client */}
        <div className="stats-card">
          <User className="stats-icon text-blue-600" />
          <div>
            <div className="stats-label">Client</div>
            <div className="stats-value">
              {project.client.companyName || `${project.client.firstName} ${project.client.lastName}`}
            </div>
          </div>
        </div>

        {/* Start Date */}
        <div className="stats-card">
          <Calendar className="stats-icon text-orange-600" />
          <div>
            <div className="stats-label">Début</div>
            <div className="stats-value">
              {formatDate(project.startDate)}
            </div>
          </div>
        </div>

        {/* End Date */}
        <div className="stats-card">
          <Package className="stats-icon text-purple-600" />
          <div>
            <div className="stats-label">Fin</div>
            <div className="stats-value">
              {formatDate(project.endDate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Users, 
  FolderOpen, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Package, 
  CheckCircle,
  Play,
  X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth.tsx'
import { projectsAPI, clientsAPI, dashboardAPI, materialsAPI, companySettingsAPI } from '@/lib/api'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [expandedClient, setExpandedClient] = useState<string | null>(null)

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll(),
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsAPI.getAll(),
  })

  // Get real statistics from backend
  const { data: projectStats } = useQuery({
    queryKey: ['project-stats'],
    queryFn: () => dashboardAPI.getProjectStats(),
  })

  const { data: clientStats } = useQuery({
    queryKey: ['client-stats'],
    queryFn: () => dashboardAPI.getClientStats(),
  })

  const { data: materialStats } = useQuery({
    queryKey: ['material-stats'],
    queryFn: () => materialsAPI.getStats(),
  })

  // Get company settings for currency
  const { data: companySettings } = useQuery({
    queryKey: ['company-settings'],
    queryFn: () => companySettingsAPI.get(),
  })

  // Use real statistics from backend, fallback to calculated if not available
  const totalProjects = projectStats?.totalProjects || projects.length
  const totalClients = clientStats?.totalClients || clients.length
  const activeProjects = projectStats?.activeProjects || projects.filter((p: any) => p.status === 'IN_PROGRESS').length

  // Calculate progress percentages

  // Recent activity
  const recentProjects = projects.slice(0, 5)
  const recentClients = clients.slice(0, 3)

  // Project status distribution from real data
  const projectStatuses = projectStats?.projectsByStatus || {
    'IN_PROGRESS': projects.filter((p: any) => p.status === 'IN_PROGRESS').length,
    'COMPLETED': projects.filter((p: any) => p.status === 'COMPLETED').length,
    'DRAFT': projects.filter((p: any) => p.status === 'DRAFT').length,
    'CANCELLED': projects.filter((p: any) => p.status === 'CANCELLED').length,
  }

  // Use real budget data from backend
  const totalBudget = projectStats?.totalBudget || projects.reduce((sum: number, project: any) => sum + (project.budget || 0), 0)


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100'
      case 'COMPLETED': return 'text-green-600 bg-green-100'
      case 'DRAFT': return 'text-yellow-600 bg-yellow-100'
      case 'CANCELLED': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return <Play className="h-4 w-4" />
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'DRAFT': return <Calendar className="h-4 w-4" />
      case 'CANCELLED': return <X className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  // Helper function to get currency symbol
  const getCurrencySymbol = () => {
    switch (companySettings?.currency) {
      case 'USD': return '$'
      case 'EUR': return '€'
      case 'GBP': return '£'
      default: return '€'
    }
  }



  return (
    <div className="space-y-6 p-6">
      {/* Header with Welcome Message */}
      <Card className="card-base hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600 mt-1 text-base">
                Bonjour {user?.firstName} {user?.lastName}, voici un aperçu de vos activités
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline"
                className="btn-outline"
                onClick={() => navigate('/materials')}
              >
                <Package className="h-4 w-4 mr-2" />
                Matériaux
              </Button>
              <Button 
                className="btn-primary"
                onClick={() => navigate('/new-client')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Client
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-base hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Projets en Cours</p>
                <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-base hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Matériaux Utilisés</p>
                <p className="text-2xl font-bold text-gray-900">{materialStats?.totalMaterials || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-base hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Clients Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-base hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getCurrencySymbol()}{totalBudget.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Projects and Clients with Tabs */}
          <div className="lg:col-span-2">
            <Card className="card-base">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-[#202124]">
                      Activité Récente
                    </CardTitle>
                    <p className="text-[#5f6368]">
                      Vos derniers projets et clients
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/clients')}
                    className="text-[#0061fe] hover:text-[#0051d4] hover:bg-[#e8f2ff]"
                  >
                    Voir tout
                    <TrendingUp className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full">
                  <div className="grid grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
                    <Button 
                      value="projects" 
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 transition-all duration-200"
                    >
                      <FolderOpen className="h-4 w-4" />
                      <span>Projets Récents</span>
                    </Button>
                    <Button 
                      value="clients" 
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 transition-all duration-200"
                    >
                      <Users className="h-4 w-4" />
                      <span>Clients Récents</span>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {recentProjects.map((project: any) => {
                      const isExpanded = expandedProject === project.id
                      return (
                        <div key={project.id}>
                          <div 
                            className={`group flex items-center justify-between p-3 border rounded-lg transition-all duration-200 cursor-pointer ${
                              isExpanded 
                                ? 'bg-[#0061fe] border-[#0061fe] text-white' 
                                : 'border-[#e8eaed] hover:bg-[#f7f9fa] hover:border-[#0061fe]'
                            }`}
                            onClick={() => {
                              setExpandedProject(isExpanded ? null : project.id)
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg transition-colors ${
                                isExpanded 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-[#e8f2ff] group-hover:bg-[#0061fe] group-hover:text-white'
                              }`}>
                                <FolderOpen className={`h-4 w-4 ${
                                  isExpanded 
                                    ? 'text-white' 
                                    : 'text-[#0061fe] group-hover:text-white'
                                }`} />
                              </div>
                              <div>
                                <h4 className={`font-medium transition-colors ${
                                  isExpanded 
                                    ? 'text-white' 
                                    : 'text-[#202124] group-hover:text-[#0061fe]'
                                }`}>
                                  {project.title}
                                </h4>
                                <p className={`text-sm ${
                                  isExpanded 
                                    ? 'text-white/80' 
                                    : 'text-[#5f6368]'
                                }`}>
                                  {project.client?.type === 'COMPANY' && project.client?.companyName
                                    ? project.client.companyName
                                    : project.client?.firstName && project.client?.lastName 
                                      ? `${project.client.firstName} ${project.client.lastName}`
                                      : project.client?.name || 'Client non assigné'
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={`text-xs ${
                                isExpanded 
                                  ? 'bg-white/20 text-white border-white/30' 
                                  : getStatusColor(project.status)
                              }`}>
                                {project.status === 'DRAFT' && 'Brouillon'}
                                {project.status === 'IN_PROGRESS' && 'En cours'}
                                {project.status === 'COMPLETED' && 'Terminé'}
                                {project.status === 'CANCELLED' && 'Annulé'}
                                {project.status === 'SUSPENDED' && 'Suspendu'}
                              </Badge>
                              <TrendingUp className={`h-4 w-4 transition-colors ${
                                isExpanded 
                                  ? 'text-white' 
                                  : 'text-[#5f6368] group-hover:text-[#0061fe]'
                              }`} />
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div className="mt-2 p-3 bg-[#f8f9fa] border border-[#e8eaed] rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[#202124]">Détails du projet</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="btn-dropbox-outline text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/projects/${project.id}`)
                                  }}
                                >
                                  Voir le projet
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-[#5f6368]">Budget:</span>
                                  <span className="ml-2 font-medium text-[#202124]">
                                    {project.budget ? `${project.budget.toLocaleString()} ${getCurrencySymbol()}` : 'Non défini'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[#5f6368]">Date de début:</span>
                                  <span className="ml-2 font-medium text-[#202124]">
                                    {project.startDate ? new Date(project.startDate).toLocaleDateString('fr-FR') : 'Non définie'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {recentProjects.length === 0 && (
                      <div className="text-center py-12 text-[#5f6368]">
                        <FolderOpen className="h-16 w-16 mx-auto mb-4 text-[#dadce0]" />
                        <p className="text-lg font-medium mb-2">Aucun projet récent</p>
                        <p className="text-sm">Commencez par créer votre premier projet</p>
                        <Button 
                          onClick={() => navigate('/new-client')}
                          className="btn-dropbox-primary mt-4"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Créer un projet
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {recentClients.map((client: any) => {
                      const isExpanded = expandedClient === client.id
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
                              <div className={`p-2 rounded-lg transition-colors ${
                                isExpanded 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-[#e6f4ea] group-hover:bg-[#137333] group-hover:text-white'
                              }`}>
                                <Users className={`h-4 w-4 ${
                                  isExpanded 
                                    ? 'text-white' 
                                    : 'text-[#137333] group-hover:text-white'
                                }`} />
                              </div>
                              <div>
                                <h4 className={`font-medium transition-colors ${
                                  isExpanded 
                                    ? 'text-white' 
                                    : 'text-[#202124] group-hover:text-[#137333]'
                                }`}>
                                  {client.type === 'COMPANY' && client.companyName 
                                    ? client.companyName 
                                    : `${client.firstName || ''} ${client.lastName || ''}`.trim()
                                  }
                                </h4>
                                <p className={`text-sm ${
                                  isExpanded 
                                    ? 'text-white/80' 
                                    : 'text-[#5f6368]'
                                }`}>
                                  {client.type === 'COMPANY' 
                                    ? `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Contact non défini'
                                    : client.email
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {client.projects && client.projects.length > 0 && (
                                <Badge className={`text-xs ${
                                  isExpanded 
                                    ? 'bg-white/20 text-white border-white/30' 
                                    : 'bg-[#e8f2ff] text-[#0061fe]'
                                }`}>
                                  {client.projects.length} projet{client.projects.length > 1 ? 's' : ''}
                                </Badge>
                              )}
                              <TrendingUp className={`h-4 w-4 transition-colors ${
                                isExpanded 
                                  ? 'text-white' 
                                  : 'text-[#5f6368] group-hover:text-[#137333]'
                              }`} />
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div className="mt-2 p-3 bg-[#f8f9fa] border border-[#e8eaed] rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[#202124]">Détails du client</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="btn-dropbox-outline text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/clients?selected=${client.id}`)
                                  }}
                                >
                                  Voir le client
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-[#5f6368]">Téléphone:</span>
                                  <span className="ml-2 font-medium text-[#202124]">
                                    {client.phone || 'Non renseigné'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[#5f6368]">Projets actifs:</span>
                                  <span className="ml-2 font-medium text-[#202124]">
                                    {client.projects?.filter((p: any) => p.status === 'IN_PROGRESS').length || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {recentClients.length === 0 && (
                      <div className="text-center py-12 text-[#5f6368]">
                        <Users className="h-16 w-16 mx-auto mb-4 text-[#dadce0]" />
                        <p className="text-lg font-medium mb-2">Aucun client récent</p>
                        <p className="text-sm">Commencez par ajouter vos premiers clients</p>
                        <Button 
                          onClick={() => navigate('/new-client')}
                          className="btn-dropbox-primary mt-4"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un client
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
          {/* Quick Actions with Icons */}
          <Card className="card-base hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/new-client')}
                  className="w-full btn-primary justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Client
                </Button>
                <Button 
                  onClick={() => navigate('/materials')}
                  variant="outline"
                  className="w-full btn-outline justify-start"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Gérer les Matériaux
                </Button>
                <Button 
                  onClick={() => navigate('/settings')}
                  variant="outline"
                  className="w-full btn-outline justify-start"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
              </div>
            </CardContent>
          </Card>





          {/* Project Status Chart with Progress Bars */}
          <Card className="card-base hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Statut des Projets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(projectStatuses).map(([status, count]) => {
                  const percentage = totalProjects > 0 ? ((count as number) / totalProjects) * 100 : 0
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(status)}
                          <span className="text-sm font-medium text-gray-700">
                            {status === 'DRAFT' && 'Brouillon'}
                            {status === 'IN_PROGRESS' && 'En cours'}
                            {status === 'COMPLETED' && 'Terminé'}
                            {status === 'CANCELLED' && 'Annulé'}
                            {status === 'SUSPENDED' && 'Suspendu'}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">{count as number}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500">{percentage.toFixed(0)}% du total</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

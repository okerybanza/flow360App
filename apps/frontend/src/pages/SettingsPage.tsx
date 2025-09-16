import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Building2, 
  Users, 
  Settings as SettingsIcon, 
  Save, 
  Edit, 
  Trash2,
  Plus,
  Palette
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { usersAPI, companySettingsAPI } from '@/lib/api'
import BrandSettings from '@/components/BrandSettings'
// import ProfilePhotoUpload from '@/components/ProfilePhotoUpload'
import ProfileSettings from '@/components/ProfileSettings'
import UserPreferences from '@/components/UserPreferences'

export default function SettingsPage() {
  const { user } = useAuth()
  const { showNotification } = useNotifications()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getAll(),
  })

  // Get company settings
  const { data: companySettings, isLoading: loadingSettings } = useQuery({
    queryKey: ['company-settings'],
    queryFn: () => companySettingsAPI.get(),
  })

  const [companyInfo, setCompanyInfo] = useState({
    name: '360Flow Architecture',
    email: 'contact@360flow.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Paix, 75001 Paris, France',
    website: 'https://360flow.com',
    currency: 'EUR'
  })

  // Update company info when settings are loaded
  useEffect(() => {
    if (companySettings) {
      setCompanyInfo({
        name: companySettings.name || '360Flow Architecture',
        email: companySettings.email || 'contact@360flow.com',
        phone: companySettings.phone || '+33 1 23 45 67 89',
        address: companySettings.address || '123 Rue de la Paix, 75001 Paris, France',
        website: companySettings.website || 'https://360flow.com',
        currency: companySettings.currency || 'EUR'
      })
    }
  }, [companySettings])

  const updateCompanySettingsMutation = useMutation({
    mutationFn: (data: any) => companySettingsAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-settings'] })
      setIsEditing(false)
      showNotification({
        type: 'success',
        title: 'Informations sauvegardées !',
        message: 'Les informations de l\'entreprise ont été mises à jour.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la sauvegarde.'
      })
    }
  })

  const handleSaveCompanyInfo = () => {
    updateCompanySettingsMutation.mutate({
      name: companyInfo.name,
      email: companyInfo.email,
      phone: companyInfo.phone,
      address: companyInfo.address,
      website: companyInfo.website,
      currency: companyInfo.currency
    })
  }

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => usersAPI.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      showNotification({
        type: 'success',
        title: 'Utilisateur supprimé !',
        message: 'L\'utilisateur a été supprimé avec succès.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la suppression.'
      })
    }
  })

  const handleDeleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUserMutation.mutate(userId)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1 text-sm">Gérez les paramètres de votre entreprise et utilisateurs</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white p-1 rounded-lg border border-gray-200">
          <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:hover:bg-blue-50 transition-all duration-200">
            <Users className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="brand" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:hover:bg-blue-50 transition-all duration-200">
            <Palette className="h-4 w-4 mr-2" />
            Marque
          </TabsTrigger>
          <TabsTrigger value="company" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:hover:bg-blue-50 transition-all duration-200">
            <Building2 className="h-4 w-4 mr-2" />
            Entreprise
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:hover:bg-blue-50 transition-all duration-200">
            <Users className="h-4 w-4 mr-2" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:hover:bg-blue-50 transition-all duration-200">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Système
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings user={user} />
        </TabsContent>

        <TabsContent value="brand" className="space-y-6">
          <BrandSettings />
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <Card className="card-base">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Informations de l'Entreprise</CardTitle>
                  <CardDescription>
                    Gérez les informations de votre entreprise
                  </CardDescription>
                </div>
                <Button 
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSaveCompanyInfo() : setIsEditing(true)}
                  disabled={loadingSettings || updateCompanySettingsMutation.isPending}
                >
                  {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                  {isEditing ? (updateCompanySettingsMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder') : 'Modifier'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom de l'entreprise</label>
                  <Input
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                    disabled={!isEditing || loadingSettings || updateCompanySettingsMutation.isPending}
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                    disabled={!isEditing || loadingSettings || updateCompanySettingsMutation.isPending}
                    placeholder="contact@entreprise.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Téléphone</label>
                  <Input
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                    disabled={!isEditing || loadingSettings || updateCompanySettingsMutation.isPending}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Site web</label>
                  <Input
                    value={companyInfo.website}
                    onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                    disabled={!isEditing || loadingSettings || updateCompanySettingsMutation.isPending}
                    placeholder="https://entreprise.com"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Adresse</label>
                  <Input
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                    disabled={!isEditing || loadingSettings || updateCompanySettingsMutation.isPending}
                    placeholder="Adresse complète"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Devise par défaut</label>
                  <select
                    value={companyInfo.currency}
                    onChange={(e) => setCompanyInfo({...companyInfo, currency: e.target.value})}
                    disabled={!isEditing || loadingSettings || updateCompanySettingsMutation.isPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="card-base">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestion des Utilisateurs</CardTitle>
                  <CardDescription>
                    Gérez les utilisateurs de votre plateforme
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel Utilisateur
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((userItem: any) => (
                      <TableRow key={userItem.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={userItem.avatarUrl} />
                              <AvatarFallback className="bg-blue-500 text-white text-sm">
                                {userItem.firstName?.[0]}{userItem.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {userItem.firstName} {userItem.lastName}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{userItem.email}</TableCell>
                        <TableCell>
                          <Badge variant={
                            userItem.role === 'ADMIN' ? 'default' :
                            userItem.role === 'ARCHITECT' ? 'secondary' : 'outline'
                          }>
                            {userItem.role === 'ADMIN' ? 'Administrateur' :
                             userItem.role === 'ARCHITECT' ? 'Architecte' : 'Client'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Actif
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {userItem.id !== user?.id && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteUser(userItem.id)}
                                disabled={deleteUserMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* User Preferences */}
          <UserPreferences />
          
          {/* System Settings */}
          <Card className="card-base">
            <CardHeader>
              <CardTitle>Paramètres Système</CardTitle>
              <CardDescription>
                Configuration avancée du système
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Version de l'application</label>
                  <Input value="1.0.0" disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dernière mise à jour</label>
                  <Input value={new Date().toLocaleDateString()} disabled />
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Actions système</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Sauvegarder la base de données
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Vider le cache
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Exporter les données
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

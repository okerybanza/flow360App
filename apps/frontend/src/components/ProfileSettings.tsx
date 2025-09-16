import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNotifications } from '@/hooks/useNotifications'
import { usersAPI } from '@/lib/api'
import ProfilePhotoUpload from '@/components/ProfilePhotoUpload'
import { Edit, Save, X, User, Phone, Briefcase, Globe, Linkedin, Globe2, Clock, Languages } from 'lucide-react'

interface ProfileSettingsProps {
  user: any
}

const TIMEZONES = [
  { value: 'Europe/Paris', label: 'Europe/Paris (UTC+1)' },
  { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
  { value: 'America/New_York', label: 'America/New_York (UTC-5)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (UTC-8)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+9)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (UTC+10)' },
]

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
]

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    jobTitle: user?.jobTitle || '',
    department: user?.department || '',
    bio: user?.bio || '',
    skills: user?.skills || '',
    experience: user?.experience || '',
    certifications: user?.certifications || '',
    linkedinUrl: user?.linkedinUrl || '',
    website: user?.website || '',
    timezone: user?.timezone || 'Europe/Paris',
    language: user?.language || 'fr',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        jobTitle: user.jobTitle || '',
        department: user.department || '',
        bio: user.bio || '',
        skills: user.skills || '',
        experience: user.experience || '',
        certifications: user.certifications || '',
        linkedinUrl: user.linkedinUrl || '',
        website: user.website || '',
        timezone: user.timezone || 'Europe/Paris',
        language: user.language || 'fr',
      })
    }
  }, [user])

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => usersAPI.update(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      showNotification({
        type: 'success',
        title: 'Profil mis à jour !',
        message: 'Votre profil a été mis à jour avec succès.'
      })
      setIsEditing(false)
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la mise à jour du profil.'
      })
    }
  })

  const handleSave = () => {
    updateProfileMutation.mutate(formData)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      jobTitle: user?.jobTitle || '',
      department: user?.department || '',
      bio: user?.bio || '',
      skills: user?.skills || '',
      experience: user?.experience || '',
      certifications: user?.certifications || '',
      linkedinUrl: user?.linkedinUrl || '',
      website: user?.website || '',
      timezone: user?.timezone || 'Europe/Paris',
      language: user?.language || 'fr',
    })
    setIsEditing(false)
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrateur'
      case 'ARCHITECT': return 'Architecte'
      case 'CLIENT': return 'Client'
      default: return role
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mon Profil</CardTitle>
            <CardDescription>
              Gérez vos informations personnelles et votre photo de profil
            </CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
              <Button 
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {updateProfileMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Profile Photo */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Photo de profil</Label>
          <ProfilePhotoUpload
            currentPhoto={user?.avatarUrl}
            onPhotoChange={async (file) => {
              if (file && user) {
                try {
                  const formData = new FormData()
                  formData.append('avatar', file)
                  await usersAPI.uploadAvatar(user.id, formData)
                  queryClient.invalidateQueries({ queryKey: ['users'] })
                  queryClient.invalidateQueries({ queryKey: ['auth'] })
                  showNotification({
                    type: 'success',
                    title: 'Photo mise à jour !',
                    message: 'Votre photo de profil a été mise à jour avec succès.'
                  })
                } catch (error: any) {
                  showNotification({
                    type: 'error',
                    title: 'Erreur',
                    message: error.response?.data?.message || 'Erreur lors de la mise à jour de la photo.'
                  })
                }
              }
            }}
            size="lg"
          />
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center">
            <User className="mr-2 h-4 w-4" />
            Informations de base
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing}
                placeholder="Votre prénom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing}
                placeholder="Votre nom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                placeholder="votre.email@exemple.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="mr-1 h-3 w-3" />
                Téléphone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Rôle</Label>
            <p className="text-gray-600">{getRoleLabel(user?.role)}</p>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            Informations professionnelles
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Poste</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                disabled={!isEditing}
                placeholder="Architecte senior"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                disabled={!isEditing}
                placeholder="Architecture"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Expérience</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                disabled={!isEditing}
                placeholder="10+ ans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Compétences</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                disabled={!isEditing}
                placeholder="AutoCAD, Revit, Design durable"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="certifications">Certifications</Label>
            <Input
              id="certifications"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              disabled={!isEditing}
              placeholder="LEED AP, Licence d'architecte"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              placeholder="Décrivez votre parcours professionnel et vos spécialités..."
              rows={4}
            />
          </div>
        </div>

        {/* Social & Web */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            Réseaux sociaux et web
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="flex items-center">
                <Linkedin className="mr-1 h-3 w-3" />
                LinkedIn
              </Label>
              <Input
                id="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                disabled={!isEditing}
                placeholder="https://linkedin.com/in/votre-profil"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center">
                <Globe2 className="mr-1 h-3 w-3" />
                Site web personnel
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={!isEditing}
                placeholder="https://votre-site.com"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Préférences
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un fuseau horaire" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center">
                <Languages className="mr-1 h-3 w-3" />
                Langue
              </Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une langue" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

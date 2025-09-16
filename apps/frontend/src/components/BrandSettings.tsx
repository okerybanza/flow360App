import { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNotifications } from '@/hooks/useNotifications'
import { companySettingsAPI } from '@/lib/api'
import { useCompanySettings } from '@/hooks/useCompanySettings'
import { Upload, Palette, Save, X, Type, Image, RotateCcw } from 'lucide-react'

const FONT_FAMILIES = [
  { value: 'Inter', label: 'Inter (Moderne)' },
  { value: 'Roboto', label: 'Roboto (Google)' },
  { value: 'Open Sans', label: 'Open Sans (Lisible)' },
  { value: 'Poppins', label: 'Poppins (Élégant)' },
  { value: 'Montserrat', label: 'Montserrat (Professionnel)' },
  { value: 'Lato', label: 'Lato (Classique)' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro (Clean)' },
  { value: 'Nunito', label: 'Nunito (Friendly)' },
]

const FONT_SIZES = [
  { value: 'small', label: 'Petit (14px)' },
  { value: 'medium', label: 'Moyen (16px)' },
  { value: 'large', label: 'Grand (18px)' },
]

// Default cute blue color scheme
const DEFAULT_COLORS = {
  primaryColor: '#3B82F6',    // Blue-500
  secondaryColor: '#64748B',  // Slate-500
  accentColor: '#0EA5E9',     // Sky-500
  successColor: '#10B981',    // Emerald-500
  warningColor: '#F59E0B',    // Amber-500
  dangerColor: '#EF4444',     // Red-500
}

export default function BrandSettings() {
  const [isEditing, setIsEditing] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()
  const { applyCustomColors } = useCompanySettings()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['company-settings'],
    queryFn: () => companySettingsAPI.get(),
  })

  const [formData, setFormData] = useState({
    name: '',
    primaryColor: '#1e40af',
    secondaryColor: '#64748b',
    accentColor: '#0ea5e9',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    dangerColor: '#ef4444',
    fontFamily: 'Inter',
    fontSize: 'medium',
    email: '',
    phone: '',
    address: '',
    website: '',
    currency: 'EUR',
  })

  // Update form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        primaryColor: settings.primaryColor || '#1e40af',
        secondaryColor: settings.secondaryColor || '#64748b',
        accentColor: settings.accentColor || '#0ea5e9',
        successColor: settings.successColor || '#10b981',
        warningColor: settings.warningColor || '#f59e0b',
        dangerColor: settings.dangerColor || '#ef4444',
        fontFamily: settings.fontFamily || 'Inter',
        fontSize: settings.fontSize || 'medium',
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        website: settings.website || '',
        currency: settings.currency || 'EUR',
      })
      setLogoPreview(settings.logo || null)
    }
  }, [settings])

  // Apply colors in real-time when editing
  useEffect(() => {
    if (isEditing) {
      const root = document.documentElement
      
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null
      }

      const primaryRgb = hexToRgb(formData.primaryColor)
      const secondaryRgb = hexToRgb(formData.secondaryColor)
      const accentRgb = hexToRgb(formData.accentColor)
      const successRgb = hexToRgb(formData.successColor)
      const warningRgb = hexToRgb(formData.warningColor)
      const dangerRgb = hexToRgb(formData.dangerColor)


      if (primaryRgb) {
        root.style.setProperty('--primary', `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}`)
        root.style.setProperty('--ring', `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}`)
      }

      if (secondaryRgb) {
        root.style.setProperty('--secondary', `${secondaryRgb.r} ${secondaryRgb.g} ${secondaryRgb.b}`)
      }

      if (accentRgb) {
        root.style.setProperty('--accent', `${accentRgb.r} ${accentRgb.g} ${accentRgb.b}`)
      }

      if (successRgb) {
        root.style.setProperty('--success', `${successRgb.r} ${successRgb.g} ${successRgb.b}`)
      }

      if (warningRgb) {
        root.style.setProperty('--warning', `${warningRgb.r} ${warningRgb.g} ${warningRgb.b}`)
      }

      if (dangerRgb) {
        root.style.setProperty('--destructive', `${dangerRgb.r} ${dangerRgb.g} ${dangerRgb.b}`)
      }

      // Apply font family
      if (formData.fontFamily) {
        document.body.style.fontFamily = formData.fontFamily
      }

      // Apply font size
      if (formData.fontSize) {
        const fontSizeMap = {
          small: '14px',
          medium: '16px',
          large: '18px'
        }
        const fontSize = fontSizeMap[formData.fontSize as keyof typeof fontSizeMap] || '16px'
        document.body.style.fontSize = fontSize
      }
    }
  }, [isEditing, formData])

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => companySettingsAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-settings'] })
      showNotification({
        type: 'success',
        title: 'Paramètres mis à jour !',
        message: 'Les paramètres de votre entreprise ont été sauvegardés.'
      })
      setIsEditing(false)
      setTimeout(() => applyCustomColors(), 100)
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la sauvegarde.'
      })
    }
  })

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!validTypes.includes(file.type)) {
        showNotification({
          type: 'error',
          title: 'Type de fichier invalide',
          message: 'Veuillez sélectionner une image (JPEG, PNG, WebP ou SVG)'
        })
        return
      }

      if (file.size > maxSize) {
        showNotification({
          type: 'error',
          title: 'Fichier trop volumineux',
          message: 'La taille du fichier ne doit pas dépasser 5MB'
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        
        showNotification({
          type: 'success',
          title: 'Logo sélectionné',
          message: 'Le logo a été sélectionné avec succès'
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoPreview(null)
    showNotification({
      type: 'info',
      title: 'Logo supprimé',
      message: 'Le logo a été supprimé'
    })
  }

  const handleSave = () => {
    const allowedFields = {
      name: formData.name,
      logo: logoPreview,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      accentColor: formData.accentColor,
      successColor: formData.successColor,
      warningColor: formData.warningColor,
      dangerColor: formData.dangerColor,
      
      fontFamily: formData.fontFamily,
      fontSize: formData.fontSize,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      website: formData.website,
      currency: formData.currency,
    }
    
    updateSettingsMutation.mutate(allowedFields)
  }

  const handleCancel = () => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        primaryColor: settings.primaryColor || '#1e40af',
        secondaryColor: settings.secondaryColor || '#64748b',
        accentColor: settings.accentColor || '#0ea5e9',
        successColor: settings.successColor || '#10b981',
        warningColor: settings.warningColor || '#f59e0b',
        dangerColor: settings.dangerColor || '#ef4444',
        fontFamily: settings.fontFamily || 'Inter',
        fontSize: settings.fontSize || 'medium',
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        website: settings.website || '',
        currency: settings.currency || 'EUR',
      })
      setLogoPreview(settings.logo || null)
    }
    setIsEditing(false)
    setTimeout(() => applyCustomColors(), 100)
  }

  const handleResetToDefault = () => {
    setFormData({
      ...formData,
      ...DEFAULT_COLORS,
    })
    
    showNotification({
      type: 'success',
      title: 'Couleurs réinitialisées !',
      message: 'Le schéma de couleurs par défaut a été appliqué.'
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuration de la Marque</CardTitle>
          <CardDescription>Personnalisez l'apparence de votre application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Configuration de la Marque</CardTitle>
            <CardDescription>Personnalisez l'apparence de votre application</CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Palette className="mr-2 h-4 w-4" />
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
                disabled={updateSettingsMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {updateSettingsMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Logo Upload */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center">
            <Image className="mr-2 h-4 w-4" />
            Logo de l'entreprise
          </Label>
          <div className="flex items-center space-x-4">
            {logoPreview ? (
              <div className="relative">
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="h-16 w-16 object-contain border border-gray-200 rounded-lg"
                />
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="h-16 w-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs">Logo</span>
              </div>
            )}
            {isEditing && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {logoPreview ? 'Changer le logo' : 'Ajouter un logo'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Nom de l'entreprise</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              placeholder="Nom de l'entreprise"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              placeholder="contact@entreprise.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              placeholder="+33 1 23 45 67 89"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium">Site web</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              disabled={!isEditing}
              placeholder="https://entreprise.com"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address" className="text-sm font-medium">Adresse</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isEditing}
              placeholder="Adresse complète"
            />
          </div>
        </div>

        {/* Typography Settings */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center">
            <Type className="mr-2 h-4 w-4" />
            Typographie
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fontFamily" className="text-sm font-medium">Police de caractères</Label>
              <Select
                value={formData.fontFamily}
                onValueChange={(value) => setFormData({ ...formData, fontFamily: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une police" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fontSize" className="text-sm font-medium">Taille de police</Label>
              <Select
                value={formData.fontSize}
                onValueChange={(value) => setFormData({ ...formData, fontSize: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une taille" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Color Scheme */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              Schéma de couleurs
            </Label>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetToDefault}
                className="text-xs"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Couleurs par défaut
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor" className="text-sm font-medium">Couleur principale</Label>
              <div className="flex space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  disabled={!isEditing}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  disabled={!isEditing}
                  placeholder="#1e40af"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor" className="text-sm font-medium">Couleur secondaire</Label>
              <div className="flex space-x-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  disabled={!isEditing}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  disabled={!isEditing}
                  placeholder="#64748b"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColor" className="text-sm font-medium">Couleur d'accent</Label>
              <div className="flex space-x-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  disabled={!isEditing}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  disabled={!isEditing}
                  placeholder="#0ea5e9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="successColor" className="text-sm font-medium">Couleur de succès</Label>
              <div className="flex space-x-2">
                <Input
                  id="successColor"
                  type="color"
                  value={formData.successColor}
                  onChange={(e) => setFormData({ ...formData, successColor: e.target.value })}
                  disabled={!isEditing}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.successColor}
                  onChange={(e) => setFormData({ ...formData, successColor: e.target.value })}
                  disabled={!isEditing}
                  placeholder="#10b981"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="warningColor" className="text-sm font-medium">Couleur d'avertissement</Label>
              <div className="flex space-x-2">
                <Input
                  id="warningColor"
                  type="color"
                  value={formData.warningColor}
                  onChange={(e) => setFormData({ ...formData, warningColor: e.target.value })}
                  disabled={!isEditing}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.warningColor}
                  onChange={(e) => setFormData({ ...formData, warningColor: e.target.value })}
                  disabled={!isEditing}
                  placeholder="#f59e0b"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dangerColor" className="text-sm font-medium">Couleur de danger</Label>
              <div className="flex space-x-2">
                <Input
                  id="dangerColor"
                  type="color"
                  value={formData.dangerColor}
                  onChange={(e) => setFormData({ ...formData, dangerColor: e.target.value })}
                  disabled={!isEditing}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.dangerColor}
                  onChange={(e) => setFormData({ ...formData, dangerColor: e.target.value })}
                  disabled={!isEditing}
                  placeholder="#ef4444"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-sm font-medium">Devise par défaut</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData({ ...formData, currency: value })}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une devise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="CAD">CAD ($)</SelectItem>
              <SelectItem value="CHF">CHF (CHF)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

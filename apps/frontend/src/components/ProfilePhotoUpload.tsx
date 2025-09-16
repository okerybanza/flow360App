import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Camera, Upload, X, User } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'

interface ProfilePhotoUploadProps {
  currentPhoto?: string
  onPhotoChange: (file: File | null) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function ProfilePhotoUpload({ 
  currentPhoto, 
  onPhotoChange, 
  size = 'md',
  className = '' 
}: ProfilePhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhoto || null)
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showNotification } = useNotifications()

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validation du fichier
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      showNotification({
        type: 'error',
        title: 'Type de fichier invalide',
        message: 'Veuillez sélectionner une image (JPEG, PNG ou WebP)'
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

    // Créer l'URL de prévisualisation
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    onPhotoChange(file)

    showNotification({
      type: 'success',
      title: 'Photo sélectionnée',
      message: 'Votre photo de profil a été sélectionnée avec succès'
    })
  }

  const handleRemovePhoto = () => {
    setPreviewUrl(null)
    onPhotoChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    
    showNotification({
      type: 'info',
      title: 'Photo supprimée',
      message: 'La photo de profil a été supprimée'
    })
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden cursor-pointer group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Avatar avec photo */}
        <Avatar 
          className={`w-full h-full ${sizeClasses[size]}`}
          src={previewUrl || ''} 
          alt="Photo de profil"
          fallback={<User className={iconSizes[size]} />}
        />

        {/* Overlay au survol */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-200">
            <div className="text-center text-white">
              <Camera className={`mx-auto ${iconSizes[size]} mb-1`} />
              <span className="text-xs">Changer</span>
            </div>
          </div>
        )}

        {/* Bouton supprimer si une photo existe */}
        {previewUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleRemovePhoto()
            }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-[#d93025] text-white rounded-full flex items-center justify-center hover:bg-[#b31412] transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Bouton d'upload alternatif */}
      <div className="mt-2 text-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          className="btn-dropbox-outline text-xs"
        >
          <Upload className="w-3 h-3 mr-1" />
          {previewUrl ? 'Changer la photo' : 'Ajouter une photo'}
        </Button>
      </div>
    </div>
  )
}

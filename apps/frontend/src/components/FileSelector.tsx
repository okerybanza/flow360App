import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { File, X, Upload, Eye } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'

interface FileSelectorProps {
  onFileSelect: (files: File[]) => void
  onClose: () => void
  maxFiles?: number
  maxSize?: number // in MB
}

export default function FileSelector({ onFileSelect, onClose, maxFiles = 5, maxSize = 10 }: FileSelectorProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { showNotification } = useNotifications()

  // Types de fichiers autorisés
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-rar-compressed'
  ]

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.zip', '.rar']

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      // Vérifier la taille
      if (file.size > maxSize * 1024 * 1024) {
        showNotification({
          type: 'error',
          title: 'Fichier trop volumineux',
          message: `Le fichier "${file.name}" est trop volumineux. Taille maximale: ${maxSize}MB`
        })
        return false
      }
      
      // Vérifier le type MIME
      if (!allowedTypes.includes(file.type)) {
        showNotification({
          type: 'error',
          title: 'Type de fichier non supporté',
          message: `Le fichier "${file.name}" n'est pas supporté. Extensions autorisées: ${allowedExtensions.join(', ')}`
        })
        return false
      }
      
      return true
    })

    if (selectedFiles.length + validFiles.length > maxFiles) {
      showNotification({
        type: 'error',
        title: 'Trop de fichiers',
        message: `Vous ne pouvez sélectionner que ${maxFiles} fichiers maximum`
      })
      return
    }

    setSelectedFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      onFileSelect(selectedFiles)
      setSelectedFiles([])
      onClose()
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Eye className="h-4 w-4" />
    if (file.type.startsWith('video/')) return <Eye className="h-4 w-4" />
    if (file.type.startsWith('audio/')) return <Eye className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  return (
    <Card className="w-96">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Ajouter des fichiers</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Glissez-déposez vos fichiers ici ou
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Parcourir
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-2">
            Max {maxFiles} fichiers, {maxSize}MB chacun
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Types supportés: {allowedExtensions.join(', ')}
          </p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Fichiers sélectionnés:</h4>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0}
          >
            Ajouter ({selectedFiles.length})
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

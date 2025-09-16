import { useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X } from 'lucide-react'
import { filesAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'

interface FileUploadProps {
  onUpload?: (file: any) => void
  trigger?: React.ReactNode
  projectId?: string
}

export default function FileUpload({ onUpload, trigger, projectId }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showNotification } = useNotifications()

  const uploadFileMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      if (projectId) {
        formData.append('projectId', projectId)
      }
      return filesAPI.upload(formData)
    },
    onSuccess: (response) => {
      showNotification({
        type: 'success',
        title: 'Fichier uploadé !',
        message: 'Le fichier a été uploadé avec succès.'
      })
      onUpload?.(response)
      setSelectedFile(null)
      setIsOpen(false)
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de l\'upload du fichier.'
      })
    }
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      uploadFileMutation.mutate(selectedFile)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <Button onClick={() => setIsOpen(true)} variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Uploader un fichier
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Uploader un fichier</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Sélectionner un fichier</Label>
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  onChange={handleFileSelect}
                  accept="*/*"
                />
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={uploadFileMutation.isPending}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadFileMutation.isPending}
                >
                  {uploadFileMutation.isPending ? 'Upload...' : 'Uploader'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

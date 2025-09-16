import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Upload, 
  Download, 
  Trash2, 
  FileText, 
  Search,
  Eye
} from 'lucide-react'
import { filesAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'
import FilePreviewPanel from './FilePreviewPanel'

interface ProjectFilesProps {
  projectId: string
}

interface ProjectFile {
  id: string
  name: string
  url: string
  type: string
  size: number
  createdAt: string
}

export default function ProjectFiles({ projectId }: ProjectFilesProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<ProjectFile | null>(null)
  
  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()

  // Fetch project files
  const { data: files, isLoading } = useQuery({
    queryKey: ['project-files', projectId],
    queryFn: () => filesAPI.getByProject(projectId),
  })

  // Upload file
  const uploadFileMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('projectId', projectId)
      return filesAPI.upload(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] })
      showNotification({
        type: 'success',
        title: 'Fichier uploadé !',
        message: 'Le fichier a été uploadé avec succès.'
      })
      setShowUploadForm(false)
      setSelectedFile(null)
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de l\'upload du fichier.'
      })
    }
  })

  // Delete file
  const deleteFileMutation = useMutation({
    mutationFn: (fileId: string) => filesAPI.delete(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] })
      showNotification({
        type: 'success',
        title: 'Fichier supprimé !',
        message: 'Le fichier a été supprimé avec succès.'
      })
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la suppression du fichier.'
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

  const handleDeleteFile = (fileId: string, fileName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le fichier "${fileName}" ?`)) {
      deleteFileMutation.mutate(fileId)
    }
  }

  const handleSelectFileForPreview = (file: ProjectFile) => {
    setSelectedFileForPreview(file)
  }

  const handleClosePreview = () => {
    setSelectedFileForPreview(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredFiles = files?.filter((file: ProjectFile) => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) {
    return (
      <Card className="card-dropbox">
        <CardHeader>
          <CardTitle className="text-[#202124] flex items-center">
            <FileText className="mr-2 h-5 w-5 text-[#0061fe]" />
            Fichiers du projet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-[#e8eaed] rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="card-dropbox">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#202124] flex items-center">
              <FileText className="mr-2 h-5 w-5 text-[#0061fe]" />
              Fichiers du projet
            </CardTitle>
            <Button
              onClick={() => setShowUploadForm(true)}
              className="btn-dropbox-primary"
              size="sm"
            >
              <Upload className="mr-2 h-4 w-4" />
              Uploader un fichier
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card className="card-dropbox">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5f6368]" />
            <Input
              placeholder="Rechercher un fichier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-dropbox"
            />
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card className="card-dropbox">
        <CardContent className="p-4">
          {filteredFiles.length > 0 ? (
            <div className="space-y-3">
              {filteredFiles.map((file: ProjectFile) => {
                const isImage = file.type?.startsWith('image/');
                return (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg">
                    <div className="flex items-center space-x-3">
                      {isImage ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to icon if image fails to load
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = 'flex';
                              }
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100" style={{display: 'none'}}>
                            <FileText className="h-6 w-6 text-[#0061fe]" />
                          </div>
                        </div>
                      ) : (
                        <FileText className="h-8 w-8 text-[#0061fe]" />
                      )}
                      <div>
                        <div className="font-medium text-[#202124]">{file.name}</div>
                        <div className="text-sm text-[#5f6368]">
                          {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSelectFileForPreview(file)}
                      className="btn-dropbox-outline"
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Ouvrir
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(file.url, '_blank')}
                      className="btn-dropbox-outline"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Télécharger
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteFile(file.id, file.name)}
                      className="text-[#5f6368] hover:text-[#d93025]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-[#dadce0] mb-4" />
              <h3 className="text-lg font-medium text-[#202124] mb-2">Aucun fichier</h3>
              <p className="text-[#5f6368] mb-4">
                Aucun fichier n'a été uploadé pour ce projet.
              </p>
              <Button
                onClick={() => setShowUploadForm(true)}
                className="btn-dropbox-primary"
              >
                <Upload className="mr-2 h-4 w-4" />
                Uploader le premier fichier
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-[#202124]">Uploader un fichier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#202124] mb-2">
                  Sélectionner un fichier
                </label>
                <Input
                  type="file"
                  onChange={handleFileSelect}
                  accept="*/*"
                  className="input-dropbox"
                />
              </div>

              {selectedFile && (
                <div className="p-3 bg-[#f8f9fa] rounded-lg">
                  <div className="text-sm text-[#202124] font-medium">{selectedFile.name}</div>
                  <div className="text-sm text-[#5f6368]">{formatFileSize(selectedFile.size)}</div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadForm(false)}
                  className="btn-dropbox-outline"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadFileMutation.isPending}
                  className="btn-dropbox-primary"
                >
                  {uploadFileMutation.isPending ? 'Upload...' : 'Uploader'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* File Preview Panel */}
      <FilePreviewPanel
        file={selectedFileForPreview}
        onClose={handleClosePreview}
      />
    </div>
  )
}

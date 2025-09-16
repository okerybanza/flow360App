import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Download, Eye, FileText, Image } from 'lucide-react'

interface FilePreviewProps {
  file: {
    id: string
    name: string
    url: string
    type: string
    size: number
  }
  onClose: () => void
  onOpenComments: () => void
}

export default function FilePreview({ file, onClose, onOpenComments }: FilePreviewProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isImage = file.type.startsWith('image/')
  const isPDF = file.type === 'application/pdf'
  const isText = file.type.startsWith('text/') || file.type.includes('document')

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = () => {
    if (isImage) return <Image className="h-6 w-6" />
    if (isPDF) return <FileText className="h-6 w-6" />
    return <FileText className="h-6 w-6" />
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  const renderPreview = () => {
    if (isImage) {
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={file.url}
            alt={file.name}
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setError('Erreur lors du chargement de l\'image')
            }}
          />
        </div>
      )
    }

    if (isPDF) {
      return (
        <div className="w-full h-full">
          <iframe
            src={`${file.url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-0 rounded-lg"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setError('Erreur lors du chargement du PDF')
            }}
          />
        </div>
      )
    }

    if (isText) {
      return (
        <div className="w-full h-full bg-gray-50 rounded-lg p-4 overflow-auto">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
            {/* For text files, we would need to fetch the content */}
            <div className="text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2" />
              <p>Aperçu non disponible pour ce type de fichier</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.open(file.url, '_blank')}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger pour voir
              </Button>
            </div>
          </pre>
        </div>
      )
    }

    return (
      <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-2" />
          <p>Aperçu non disponible pour ce type de fichier</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => window.open(file.url, '_blank')}
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                {getFileIcon()}
              </div>
              <div>
                <CardTitle className="text-lg">{file.name}</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span>{file.type}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Zoom Controls for Images */}
              {isImage && (
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.25}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-gray-600 min-w-[40px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRotate}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenComments}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Commentaires</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(file.url, '_blank')}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Télécharger</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden">
          <div className="h-full p-4">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Chargement de l'aperçu...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-red-500">
                  <p className="mb-2">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le fichier
                  </Button>
                </div>
              </div>
            )}
            
            {!isLoading && !error && (
              <div className="h-full">
                {renderPreview()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

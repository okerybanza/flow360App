import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Download,
  FileText,
  Trash2,
  MessageSquare,
  ZoomIn,
  ZoomOut,
  RotateCw
} from 'lucide-react'
import FileComments from './FileComments'

interface FilePreviewPanelProps {
  file: {
    id: string
    name: string
    url: string
    type: string
    size: number
    createdAt: string
  } | null
  onClose: () => void
}

export default function FilePreviewPanel({ file, onClose }: FilePreviewPanelProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [showComments, setShowComments] = useState(true)

  if (!file) return null

  const isImage = file.type.startsWith('image/')
  const isPDF = file.type === 'application/pdf'


  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setRotation(prev => prev + 90)
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* getFileIcon(file.type) */}
          <div>
            <h3 className="font-semibold text-gray-900 truncate max-w-48">
              {file.name}
            </h3>
            <p className="text-sm text-gray-500">
              {/* formatFileSize(file.size) */}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setShowComments(false)}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            !showComments 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Aperçu
        </button>
        <button
          onClick={() => setShowComments(true)}
          className={`flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center space-x-2 ${
            showComments 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Commentaires</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {!showComments ? (
          <div className="h-full flex flex-col">
            {/* Preview Controls */}
            {isImage && (
              <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{Math.round(zoom * 100)}%</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotate}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}

            {/* Preview Area */}
            <div className="flex-1 p-4 overflow-auto">
              {isImage ? (
                <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden min-h-64">
                  <img
                    src={`http://localhost:3001${file.url}`}
                    alt={file.name}
                    className="max-w-full max-h-full object-contain"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </div>
              ) : isPDF ? (
                <div className="w-full h-full">
                  <iframe
                    src={`http://localhost:3001${file.url}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full border-0 rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2" />
                    <p>Aperçu non disponible pour ce type de fichier</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => window.open(`http://localhost:3001${file.url}`, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger pour voir
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{file.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taille:</span>
                  <span className="font-medium">
                    {/* formatFileSize(file.size) */}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Créé le:</span>
                  <span className="font-medium">
                    {new Date(file.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <FileComments
              fileId={file.id}
            />
          </div>
        )}
      </div>
    </div>
  )
}

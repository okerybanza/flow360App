import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, X, Paperclip } from 'lucide-react'

interface FileAttachmentProps {
  file: {
    name: string
    size: number
    type: string
    url: string
  }
  onRemove: () => void
}

export default function FileAttachment({ file, onRemove }: FileAttachmentProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️'
    if (type.startsWith('video/')) return '🎥'
    if (type.startsWith('audio/')) return '🎵'
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || type.includes('document')) return '📝'
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊'
    if (type.includes('powerpoint') || type.includes('presentation')) return '📽️'
    return '📎'
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <Paperclip className="h-4 w-4 mr-2" />
            Pièce jointe
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getFileIcon(file.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)} • {file.type}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(file.url, '_blank')}
            className="text-xs"
          >
            <FileText className="h-3 w-3 mr-1" />
            Voir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

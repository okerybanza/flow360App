import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Send,
  Clock,
  Paperclip,
  Smile,
  File,
  Image,
  X
} from 'lucide-react'
import { messagesAPI } from '@/lib/api'
import { useNotifications } from '@/hooks/useNotifications'
import { useAuth } from '@/hooks/useAuth'
import EmojiPicker from './EmojiPicker'
import FileSelector from './FileSelector'

interface ProjectDiscussionsProps {
  projectId: string
}

interface ProjectMessage {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatarUrl?: string
  }
  attachments?: Array<{
    file: {
      id: string
      originalName: string
      filename: string
      size: number
      mimetype: string
      path: string
    }
  }>
}

export default function ProjectDiscussions({ projectId }: ProjectDiscussionsProps) {
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileAttachment, setShowFileAttachment] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  
  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()

  // Fetch project messages with auto-refresh
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['project-messages', projectId],
    queryFn: () => messagesAPI.getByProject(projectId),
    refetchInterval: 5000, // Refresh every 5 seconds for real-time feel
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => messagesAPI.create({ content, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-messages', projectId] })
      setNewMessage('')
      setIsTyping(false)
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de l\'envoi du message.'
      })
    }
  })

  const handleSendMessage = async () => {
    if (newMessage.trim() || attachedFiles.length > 0) {
      try {
        const message = await messagesAPI.create({ content: newMessage.trim(), projectId });
        if (attachedFiles.length > 0) {
          for (const file of attachedFiles) {
            const formData = new FormData();
            formData.append("file", file);
            await messagesAPI.attachFile(message.id, formData);
          }
        }
        queryClient.invalidateQueries({ queryKey: ["project-messages", projectId] });
        setNewMessage("");
        setAttachedFiles([]);
        setIsTyping(false);
      } catch (error: any) {
        showNotification({
          type: "error",
          title: "Erreur",
          message: error.response?.data?.message || "Erreur lors de l'envoi du message."
        });
      }
    }
  }
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleFileSelect = (files: File[]) => {
    setAttachedFiles(prev => [...prev, ...files])
    setShowFileAttachment(false)
  }

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File | any) => {
    const fileType = file.type || file.mimetype || ''
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />
    if (fileType.startsWith('video/')) return <File className="h-4 w-4" />
    if (fileType.startsWith('audio/')) return <File className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number | undefined | null) => {
    if (!bytes || bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileUrl = (file: any) => {
    const baseUrl = 'http://localhost:3001'
    const filePath = file.url || file.path || ''
    return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } else {
      return date.toLocaleDateString('fr-FR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const isOwnMessage = (message: ProjectMessage) => {
    return message.user.id === user?.id
  }

  if (isLoading) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
            Chat du projet
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Chat Header */}
      <CardHeader className="border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Chat du projet</CardTitle>
              <p className="text-sm text-gray-600">
                {messages.length} message{messages.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            En ligne
          </Badge>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((message: ProjectMessage) => (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[70%] ${isOwnMessage(message) ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!isOwnMessage(message) && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={message.user.avatarUrl} />
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {getUserInitials(message.user.firstName, message.user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`flex flex-col ${isOwnMessage(message) ? 'items-end' : 'items-start'}`}>
                      {!isOwnMessage(message) && (
                        <div className="text-xs text-gray-500 mb-1">
                          {message.user.firstName} {message.user.lastName}
                        </div>
                      )}
                      
                      <div className={`rounded-lg px-3 py-2 max-w-full ${
                        isOwnMessage(message)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                        
                        {/* Attached Files */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment, index) => {
                              const file = attachment.file || attachment;
                              const isImage = file.mimetype?.startsWith('image/');
                              
                              return (
                                <div key={index} className="bg-white bg-opacity-20 rounded p-2">
                                  {isImage ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        {getFileIcon(file)}
                                        <span className="text-sm truncate">{file.originalName || file.filename || 'Image'}</span>
                                        <span className="text-xs opacity-75">({formatFileSize(file.size)})</span>
                                      </div>
                                      <div className="relative group">
                                        <img 
                                          src={getFileUrl(file)}
                                          alt={file.originalName || file.filename || 'Image'}
                                          className="max-w-full h-auto max-h-48 rounded cursor-pointer hover:opacity-90 transition-opacity"
                                          onClick={() => window.open(getFileUrl(file), '_blank')}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded flex items-center justify-center">
                                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-90 rounded-full p-2">
                                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2">
                                      {getFileIcon(file)}
                                                                             <span className="text-sm truncate">{file.originalName || file.filename || 'Fichier'}</span>
                                      <span className="text-xs opacity-75">({formatFileSize(file.size)})</span>
                                      <button
                                        onClick={() => window.open(getFileUrl(file), '_blank')}
                                        className="ml-auto text-blue-400 hover:text-blue-300 text-xs underline"
                                      >
                                        Télécharger
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      
                      <div className={`text-xs text-gray-500 mt-1 flex items-center space-x-1 ${
                        isOwnMessage(message) ? 'justify-end' : 'justify-start'
                      }`}>
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(message.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
                  <p className="text-gray-500">
                    Commencez la conversation en envoyant un message.
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t bg-white p-4">
            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Fichiers attachés ({attachedFiles.length})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAttachedFiles([])}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 p-1">
                      {getFileIcon(file)}
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachedFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value)
                    setIsTyping(e.target.value.length > 0)
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="pr-20 resize-none"
                  disabled={sendMessageMutation.isPending}
                />
                <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowFileAttachment(!showFileAttachment)}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={(!newMessage.trim() && attachedFiles.length === 0) || sendMessageMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {isTyping && (
              <div className="text-xs text-gray-500 mt-2">
                Vous tapez...
              </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="relative">
                <EmojiPicker
                  onSelect={handleEmojiSelect}
                />
              </div>
            )}

            {/* File Selector */}
            {showFileAttachment && (
              <div className="relative">
                <FileSelector
                  onFileSelect={handleFileSelect}
                  onClose={() => setShowFileAttachment(false)}
                  maxFiles={5}
                  maxSize={10}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

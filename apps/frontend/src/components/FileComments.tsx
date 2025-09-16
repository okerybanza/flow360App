import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Send, MessageSquare } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth.tsx'
import { useNotifications } from '@/hooks/useNotifications'
import { fileCommentsAPI } from '@/lib/api'

interface FileCommentsProps {
  fileId: string
}

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export default function FileComments({ fileId }: FileCommentsProps) {
  const [newComment, setNewComment] = useState('')
  const { user } = useAuth()
  const { showNotification } = useNotifications()
  const queryClient = useQueryClient()

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['file-comments', fileId],
    queryFn: () => fileCommentsAPI.getByFile(fileId),
  })

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => fileCommentsAPI.create(fileId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-comments', fileId] })
      setNewComment('')
      showNotification({
        type: 'success',
        title: 'Commentaire ajouté',
        message: 'Votre commentaire a été ajouté avec succès.'
      })
    },
    onError: () => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible d\'ajouter le commentaire.'
      })
    }
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => fileCommentsAPI.delete(fileId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-comments', fileId] })
      showNotification({
        type: 'success',
        title: 'Commentaire supprimé',
        message: 'Le commentaire a été supprimé avec succès.'
      })
    },
    onError: () => {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de supprimer le commentaire.'
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment.trim())
    }
  }

  const handleDelete = (commentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      deleteCommentMutation.mutate(commentId)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Commentaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Chargement des commentaires...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Commentaires ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Comment Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!newComment.trim() || addCommentMutation.isPending}
              className="btn-primary"
            >
              <Send className="h-4 w-4 mr-2" />
              {addCommentMutation.isPending ? 'Envoi...' : 'Envoyer'}
            </Button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Aucun commentaire pour le moment</p>
              <p className="text-sm">Soyez le premier à commenter !</p>
            </div>
          ) : (
            comments.map((comment: Comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={undefined} alt={comment.user.firstName} />
                  <AvatarFallback className="text-xs">
                    {comment.user.firstName[0]}{comment.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">
                        {comment.user.firstName} {comment.user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  {user?.id === comment.user.id && (
                    <div className="mt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        Supprimer
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

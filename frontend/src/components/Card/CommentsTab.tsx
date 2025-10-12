import { useState } from 'react'
import { Comment, commentService } from '../../services/boardService'

interface CommentsTabProps {
  cardId: string
  comments: Comment[]
  onUpdate: () => void
}

function CommentsTab({ cardId, comments, onUpdate }: CommentsTabProps) {
  const [newComment, setNewComment] = useState('')
  const [author, setAuthor] = useState('Utilisateur') // TODO: Récupérer depuis l'auth
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      setLoading(true)
      await commentService.create(cardId, author, newComment.trim())
      setNewComment('')
      onUpdate()
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) {
      setEditingId(null)
      return
    }

    try {
      await commentService.update(commentId, editContent.trim())
      setEditingId(null)
      onUpdate()
    } catch (error) {
      console.error('Erreur lors de la modification:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return

    try {
      await commentService.delete(commentId)
      onUpdate()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    return date.toLocaleDateString('fr-FR')
  }

  return (
    <div className="space-y-4">
      {/* Ajouter un commentaire */}
      <div className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Écrire un commentaire..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-secondary-300 focus:border-transparent"
        />
        {newComment.trim() && (
          <button
            onClick={handleAddComment}
            disabled={loading}
            className="btn-primary text-sm disabled:opacity-50"
          >
            Ajouter le commentaire
          </button>
        )}
      </div>

      {/* Liste des commentaires */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 group"
          >
            {/* En-tête */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-300 flex items-center justify-center text-primary-900 font-semibold text-sm">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                    {comment.author}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingId(comment.id)
                    setEditContent(comment.content)
                  }}
                  className="text-xs text-gray-600 hover:text-secondary-600 dark:text-gray-400 dark:hover:text-secondary-400 px-2 py-1"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-2 py-1"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Contenu */}
            {editingId === comment.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateComment(comment.id)}
                    className="px-3 py-1 text-xs bg-secondary-300 text-primary-900 font-semibold rounded hover:bg-secondary-400"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {comment.content}
              </p>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 italic">
            Aucun commentaire. Soyez le premier à commenter !
          </p>
        )}
      </div>
    </div>
  )
}

export default CommentsTab


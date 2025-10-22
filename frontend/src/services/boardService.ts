import api from './api'

export interface Board {
  id: string
  name: string
  description?: string
  color?: string
  columns: string[]
  columnColors: { [key: string]: string }
  clientName?: string
  clientEmail?: string
  clientAddress?: string
  clientPhone?: string
  cards?: Card[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  cardId: string
  author: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface History {
  id: string
  cardId: string
  user: string
  action: string
  field?: string
  oldValue?: string
  newValue?: string
  createdAt: string
}

export interface Card {
  id: string
  boardId: string
  parentId?: string
  quoteId?: string // ✅ NOUVEAU : Référence au devis associé
  key: string
  title: string
  description?: string
  status: string
  priority: 'low' | 'medium' | 'high'
  position: number
  assignee?: string
  reporter?: string
  category?: string
  labels?: string[]
  estimatedTime?: number
  actualTime?: number
  startDate?: string
  dueDate?: string
  completedAt?: string
  tags?: string[]
  subtasks?: Card[]
  comments?: Comment[]
  history?: History[]
  createdAt: string
  updatedAt: string
}

export interface CreateBoardData {
  name: string
  description?: string
  color?: string
  columns?: string[]
}

export interface UpdateBoardData {
  name?: string
  description?: string
  color?: string
  columns?: string[]
}

export interface CreateCardData {
  boardId: string
  title: string
  description?: string
  status?: string
  priority?: 'low' | 'medium' | 'high'
  assignee?: string
  estimatedTime?: number
  dueDate?: string
}

export interface UpdateCardData {
  title?: string
  description?: string
  status?: string
  priority?: 'low' | 'medium' | 'high'
  assignee?: string
  estimatedTime?: number
  actualTime?: number
  dueDate?: string
}

export interface MoveCardData {
  status: string
  position: number
}

// Boards API
export const boardService = {
  // Récupérer tous les boards
  getAll: async (): Promise<Board[]> => {
    const response = await api.get('/boards')
    return response.data.data
  },

  // Récupérer un board par ID
  getById: async (id: string): Promise<Board> => {
    const response = await api.get(`/boards/${id}`)
    return response.data.data
  },

  // Créer un board
  create: async (data: CreateBoardData): Promise<Board> => {
    const response = await api.post('/boards', data)
    return response.data.data
  },

  // Mettre à jour un board
  update: async (id: string, data: UpdateBoardData): Promise<Board> => {
    const response = await api.patch(`/boards/${id}`, data)
    return response.data.data
  },

  // Supprimer un board
  delete: async (id: string): Promise<void> => {
    await api.delete(`/boards/${id}`)
  },

  // Ajouter une colonne
  addColumn: async (id: string, columnName: string, color?: string): Promise<Board> => {
    const response = await api.post(`/boards/${id}/columns`, { columnName, color })
    return response.data.data
  },

  // Renommer une colonne
  renameColumn: async (id: string, oldName: string, newName: string): Promise<Board> => {
    const response = await api.patch(`/boards/${id}/columns/rename`, { oldName, newName })
    return response.data.data
  },

  // Supprimer une colonne
  deleteColumn: async (id: string, columnName: string): Promise<Board> => {
    const response = await api.delete(`/boards/${id}/columns`, { data: { columnName } })
    return response.data.data
  },

  // Mettre à jour la couleur d'une colonne
  updateColumnColor: async (id: string, columnName: string, color: string): Promise<Board> => {
    const response = await api.patch(`/boards/${id}/columns/color`, { columnName, color })
    return response.data.data
  },

  // Réorganiser les colonnes
  reorderColumns: async (id: string, columns: string[]): Promise<Board> => {
    const response = await api.patch(`/boards/${id}/columns/reorder`, { columns })
    return response.data.data
  },
}

// Cards API
export const cardService = {
  // Récupérer les cartes d'un board
  getByBoard: async (
    boardId: string,
    filters?: {
      status?: string
      priority?: string
      search?: string
    }
  ): Promise<Card[]> => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.priority) params.append('priority', filters.priority)
    if (filters?.search) params.append('search', filters.search)

    const response = await api.get(`/cards/board/${boardId}?${params.toString()}`)
    return response.data.data
  },

  // Récupérer une carte par ID
  getById: async (id: string): Promise<Card> => {
    const response = await api.get(`/cards/${id}`)
    return response.data.data
  },

  // Créer une carte
  create: async (data: CreateCardData): Promise<Card> => {
    const response = await api.post('/cards', data)
    return response.data.data
  },

  // Mettre à jour une carte
  update: async (id: string, data: UpdateCardData): Promise<Card> => {
    const response = await api.patch(`/cards/${id}`, data)
    return response.data.data
  },

  // Déplacer une carte (drag & drop)
  move: async (id: string, data: MoveCardData): Promise<Card> => {
    const response = await api.patch(`/cards/${id}/move`, data)
    return response.data.data
  },

  // Supprimer une carte
  delete: async (id: string): Promise<void> => {
    await api.delete(`/cards/${id}`)
  },
}

// Subtasks API
export const subtaskService = {
  // Récupérer les sous-tâches d'une carte
  getByCard: async (cardId: string): Promise<Card[]> => {
    const response = await api.get(`/subtasks/card/${cardId}`)
    return response.data.data
  },

  // Créer une sous-tâche
  create: async (
    cardId: string,
    data: {
      title: string
      description?: string
      status?: string
      priority?: 'low' | 'medium' | 'high'
    }
  ): Promise<Card> => {
    const response = await api.post(`/subtasks/card/${cardId}`, data)
    return response.data.data
  },

  // Mettre à jour une sous-tâche
  update: async (subtaskId: string, data: Partial<Card>): Promise<Card> => {
    const response = await api.patch(`/subtasks/${subtaskId}`, data)
    return response.data.data
  },

  // Supprimer une sous-tâche
  delete: async (subtaskId: string): Promise<void> => {
    await api.delete(`/subtasks/${subtaskId}`)
  },

  // Obtenir la progression d'une carte
  getProgress: async (cardId: string): Promise<{
    total: number
    completed: number
    percentage: number
    subtasks: Card[]
  }> => {
    const response = await api.get(`/subtasks/card/${cardId}/progress`)
    return response.data.data
  },
}

// Comments API
export const commentService = {
  // Récupérer les commentaires d'une carte
  getByCard: async (cardId: string): Promise<Comment[]> => {
    const response = await api.get(`/comments/card/${cardId}`)
    return response.data.data
  },

  // Créer un commentaire
  create: async (cardId: string, author: string, content: string): Promise<Comment> => {
    const response = await api.post(`/comments/card/${cardId}`, { author, content })
    return response.data.data
  },

  // Mettre à jour un commentaire
  update: async (commentId: string, content: string): Promise<Comment> => {
    const response = await api.patch(`/comments/${commentId}`, { content })
    return response.data.data
  },

  // Supprimer un commentaire
  delete: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}`)
  },
}

// History API
export const historyService = {
  // Récupérer l'historique d'une carte
  getByCard: async (cardId: string): Promise<History[]> => {
    const response = await api.get(`/history/card/${cardId}`)
    return response.data.data
  },
}


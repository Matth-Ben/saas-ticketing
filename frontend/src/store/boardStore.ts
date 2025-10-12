import { create } from 'zustand'

export interface Card {
  id: string
  title: string
  description?: string
  status: string
  priority?: 'low' | 'medium' | 'high'
  assignee?: string
}

export interface Board {
  id: string
  name: string
  columns: string[]
  cards: Card[]
}

interface BoardStore {
  boards: Board[]
  currentBoard: Board | null
  setBoards: (boards: Board[]) => void
  setCurrentBoard: (board: Board) => void
  addBoard: (board: Board) => void
  addCard: (card: Card) => void
}

export const useBoardStore = create<BoardStore>((set) => ({
  boards: [],
  currentBoard: null,
  setBoards: (boards) => set({ boards }),
  setCurrentBoard: (board) => set({ currentBoard: board }),
  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
  addCard: (card) =>
    set((state) => ({
      currentBoard: state.currentBoard
        ? {
            ...state.currentBoard,
            cards: [...state.currentBoard.cards, card],
          }
        : null,
    })),
}))


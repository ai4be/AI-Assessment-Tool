import { Context, createContext, useState } from 'react'
import { Board } from '../types/boards'

interface BoardContextType {
  board: Board | undefined
  setBoard: (board: any) => {}
}

const BoardContext: Context<BoardContextType> = createContext({
  board: null,
  setBoard: (board: Board) => {}
})

export function BoardContextProvider (props): JSX.Element {
  const [board, setBoard] = useState<Board>()

  const context: BoardContextType = {
    board,
    setBoard
  }

  return (
    <BoardContext.Provider value={context}>
      {props.children}
    </BoardContext.Provider>
  )
}

export default BoardContext

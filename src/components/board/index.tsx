import React, { useContext } from 'react'
import { Box } from '@chakra-ui/react'
import UserNavbar from '@/src/components/user-navbar'
import SubNavbar from '@/src/components/sub-navbar'
import BoardColumns from '@/src/components/board/columns'
import PropType from 'prop-types'
import BoardContext, { BoardContextProvider } from '@/src/store/board-context'

const Board = ({ board, session }): JSX.Element => {
  const boardContext = useContext(BoardContext)
  boardContext.setBoard(board)
  // console.log('in here')

  return (
    <Box
      backgroundImage={`url('${String(board?.backgroundImage)}')`}
      backgroundPosition='center'
      h='100vh'
      backgroundRepeat='no-repeat'
      backgroundSize='cover'
    >
      {board != null &&
        <BoardContextProvider>
          <UserNavbar />
          <SubNavbar board={board} />
          <BoardColumns boardId={board._id} session={session} />
        </BoardContextProvider>}
    </Box>
  )
}

Board.propTypes = {
  board: PropType.object,
  session: PropType.object
}

export default Board

import React from 'react'
import { Box } from '@chakra-ui/react'
import UserNavbar from '@/src/components/user-navbar'
import SubNavbar from '@/src/components/sub-navbar'
import BoardColumns from '@/src/components/board/columns'
import PropType from 'prop-types'

const Board = (props): JSX.Element => {
  const board = props.board

  return (
    <Box
      backgroundImage={`url('${board?.backgroundImage}')`}
      backgroundPosition='center'
      h='100vh'
      backgroundRepeat='no-repeat'
      backgroundSize='cover'
    >
      {board && <UserNavbar />}
      {board && <SubNavbar board={board} />}
      {board && <BoardColumns boardId={board._id} />}
    </Box>
  )
}

Board.propTypes = {
  board: PropType.object
}

export default Board

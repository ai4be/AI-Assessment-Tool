import React from 'react'
import PropType from 'prop-types'
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Input,
  Text
} from '@chakra-ui/react'
import Link from 'next/link'
import { AiOutlinePlus } from 'react-icons/ai'
import shortId from 'shortid'

const Boards = (props: any[]): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const board: any = {}
  const boardRequest: any = {}
  const { boards = [] }: {boards: any[]} = props
  const handleCreate = async () => {
    const id = shortId.generate()
    const date = new Date().toLocaleString()
    // TODO
    onClose()
  }

  const handleChange = (e) => {
    const data = {
      type: 'name',
      value: e.target.value
    }

    // TODO
  }

  const createBoardModal = () => {
    return (
      <>
        <Button
          onClick={onOpen}
          leftIcon={<AiOutlinePlus />}
          colorScheme='green'
          size='lg'
          mt='1rem'
        >
          Create a board
        </Button>
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create board</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                value={board.name}
                onChange={(e) => handleChange(e)}
                placeholder='Board name'
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleCreate} isLoading={boardRequest} loadingText='Creating board'>
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  const loadExistingBoards = () => {
    return (
      <Box mt='1rem' minWidth='50vw' display='flex' flexWrap='wrap'>
        {boards.map((board, index) => (
          <Link
            key={index}
            href={{
              pathname: '/boards/[slug]',
              query: { slug: board._id }
            }}
          >
            <Box
              mr='1rem'
              mt='1rem'
              height='150px'
              width='150px'
              background={`linear-gradient(
                rgba(0, 0, 0, 0.4),
                rgba(0, 0, 0, 0.4)
              ),
              url(${board.backgroundImage})`}
              backgroundPosition='center'
              backgroundRepeat='no-repeat'
              backgroundSize='cover'
              borderRadius='5px'
              boxShadow='lg'
              cursor='pointer'
            >
              <Text
                marginTop='calc(50% - 25px)'
                height='25px'
                textAlign='center'
                textTransform='capitalize'
                color='white'
                fontSize='20px'
                fontWeight='bold'
              >
                {board.name}
              </Text>
            </Box>
          </Link>
        ))}
      </Box>
    )
  }

  return (
    <Box flexGrow={3} mx='2%' boxShadow='base' rounded='lg' bg='white' p='1rem'>
      {createBoardModal()}
      {loadExistingBoards()}
    </Box>
  )
}

Boards.propTypes = {
  boards: PropType.array
}


export default Boards

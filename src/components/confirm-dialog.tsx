import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react'
import { useRef, useState } from 'react'

const ConfirmDialog = (props: any): JSX.Element => {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const {
    isOpen,
    title = 'Please confirm',
    content = 'Are you sure? You can\'t undo this action afterwards.',
    onClose,
    confirmHandler
  } = props

  const handleConfirm = async (): Promise<void> => {
    setIsLoading(true)
    await confirmHandler()
    setIsLoading(false)
    onClose()
  }

  const handleCancel = (): void => {
    setIsLoading(true)
    onClose()
    setIsLoading(false)
  }

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            {content}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleCancel} isLoading={isLoading}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={handleConfirm} ml={3} isLoading={isLoading}>
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default ConfirmDialog

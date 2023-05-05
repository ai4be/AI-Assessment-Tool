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
import { useTranslation } from 'next-i18next'

const ConfirmDialog = (props: any): JSX.Element => {
  const { t } = useTranslation()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const {
    isOpen,
    title = t('dialogs:confirm-please-confirm'),
    content = t('dialogs:confirm-confirmation-undo'),
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

  /* eslint-disable @typescript-eslint/no-misused-promises */
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
              {t('buttons:cancel')}
            </Button>
            <Button colorScheme='red' onClick={handleConfirm} ml={3} isLoading={isLoading}>
              {t('buttons:confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default ConfirmDialog

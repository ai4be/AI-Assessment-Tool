import { Context, createContext } from 'react'

import {
  useToast
} from '@chakra-ui/react'

interface ToastContextType {
  showToast: any
}

const ToastContext: Context<ToastContextType> = createContext({
  showToast: () => {}
})

export function ToastContextProvider (props: any): JSX.Element {
  const toast = useToast()
  const showToast = (props: any): void => {
    toast({
      position: 'top',
      title: '',
      status: 'success',
      duration: 2500,
      isClosable: true,
      ...props
    })
  }

  const context = {
    showToast
  }

  return (
    <ToastContext.Provider value={context}>
      {props.children}
    </ToastContext.Provider>
  )
}

export default ToastContext

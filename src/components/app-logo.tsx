import {
  Image,
  ImgProps
} from '@chakra-ui/react'

const AppLogo = (props: ImgProps): JSX.Element => {
  return (
    <Image {...props} src='/ai4logo.svg' alt='App Logo' width='120px' />
  )
}

export default AppLogo

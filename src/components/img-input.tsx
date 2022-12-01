// import {
//   Input,
//   useMultiStyleConfig,
//   InputProps
// } from '@chakra-ui/react'

// export const FileInput = (props: InputProps): JSX.Element => {
//   const styles = useMultiStyleConfig('Button', { variant: 'outline' })

//   return (
//     <Input
//       type='file'
//       sx={{
//         '::file-selector-button': {
//           border: 'none',
//           outline: 'none',
//           mr: 2,
//           ...styles
//         }
//       }}
//       {...props}
//     />
//   )
// }

// export default FileInput

import React, { useEffect, useState } from 'react'

import {
  AspectRatio,
  Box,
  Container,
  Heading,
  Input,
  Stack,
  Text,
  Avatar
} from '@chakra-ui/react'
import { resizeImg } from '@/util/img'

export default function ImgInput ({ onChange, data, placeholder }: { onChange?: Function, data?: string, placeholder: string }): JSX.Element {
  const [opacityImg, setOpacityImg] = useState<number>(1)
  const [dataBase64, setDataBase64] = useState<string>(data ?? '')

  useEffect(() => {
    if (typeof onChange === 'function' && dataBase64?.length > 0 && data !== dataBase64) onChange(dataBase64)
  }, [dataBase64, onChange])

  useEffect(() => {
    setDataBase64((preval) => {
      if (data != null && data !== preval) return data
      return preval
    })
  }, [data])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e?.target?.files?.length != null) {
      const imageFile = e.target.files[0]
      const reader = new FileReader()
      reader.onload = function () {
        void resizeImg(reader.result as string, 300, 300)
          .then((resizedImg) => setDataBase64(resizedImg))
      }
      reader.readAsDataURL(imageFile)
    }
  }

  return (
    <Container my='12'>
      <AspectRatio maxW={300} ratio={1}>
        <Box
          shadow='sm'
          role='group'
          borderRadius='full'
          transition='all 150ms ease-in-out'
          _hover={{
            shadow: 'md'
          }}
          initial='rest'
          animate='rest'
          whileHover='hover'
          overflow='hidden'
        >
          <Box position='relative' height='100%' width='100%' overflow='hidden'>
            <Box
              position='absolute'
              top='0'
              left='0'
              height='100%'
              width='100%'
              display='flex'
              flexDirection='column'
              cursor='pointer'
              borderColor='gray.300'
              borderStyle='dashed'
              borderWidth='2px'
              borderRadius='full'
            >
              <Stack p='8' textAlign='center' spacing='1' alignItems='center' height='100%' width='100%'>
                <Heading fontSize='lg' color='gray.700' fontWeight='bold'>
                  Drop images here
                </Heading>
                <Text fontWeight='light'>or click to upload</Text>
              </Stack>
            </Box>
            <Avatar src={dataBase64} name={placeholder} position='absolute' bottom='0' left='0' height='100%' width='100%' opacity={opacityImg} />
            <Input
              type='file'
              height='100%'
              width='100%'
              position='absolute'
              p='0'
              top='0'
              left='0'
              opacity='0'
              aria-hidden='true'
              accept='image/*'
              cursor='pointer'
              overflow='hidden'
              onPointerEnter={() => setOpacityImg(0.2)}
              onPointerLeave={() => setOpacityImg(1)}
              onChange={handleFile}
              borderRadius='full'
            />
          </Box>
        </Box>
      </AspectRatio>
    </Container>
  )
}

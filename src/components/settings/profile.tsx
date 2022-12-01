import React, { useState, useEffect, useContext } from 'react'
import {
  Box, Heading, FormControl, Button,
  Input,
  Text,
  useToast,
  Avatar
} from '@chakra-ui/react'
import { defaultFetchOptions } from '@/util/api'
import isEmpty from 'lodash.isempty'
import UserContext from '../../store/user-context'
import ImgInput from '../img-input'
import { resizeImg } from '@/util/img'

const Profile = (): JSX.Element => {
  const toast = useToast()
  const { user, triggerReloadUser } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [firstNameErr, setFirstNameErr] = useState(false)
  const [lastNameErr, setLastNameErr] = useState(false)
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    avatar: false
  })
  const [values, setValues] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    avatar: user?.avatar ?? ''
  })

  useEffect(() => {
    if (user == null) return
    setValues({
      firstName: user?.firstName,
      lastName: user?.lastName,
      avatar: user?.avatar ?? ''
    })
  }, [user])

  useEffect(() => {
    const isDisabled = isEmpty(values.firstName) || isEmpty(values.lastName) || firstNameErr || lastNameErr
    setIsDisabled(isDisabled)
  }, [values.firstName, values.lastName, firstNameErr, lastNameErr])

  useEffect(() => {
    if (!touched.firstName) return
    setFirstNameErr(values.firstName?.length < 2)
  }, [values.firstName, touched.firstName])

  useEffect(() => {
    if (!touched.lastName) return
    setLastNameErr(values.lastName?.length < 2)
  }, [values.lastName, touched.lastName])

  const setTouchedWrapper = (field: string, waitTimeMS = 0): void => {
    if (touched[field] !== true) {
      waitTimeMS > 0
        ? setTimeout(() => setTouchedWrapper(field, 0), waitTimeMS)
        : setTouched({ ...touched, [field]: true })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
    setTouchedWrapper(name, 800)
  }

  const updateProfile = async (e): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    const { firstName, lastName, avatar } = values
    const data: any = {
      firstName,
      lastName,
      avatar
    }
    // avoid heavy request payload
    if (user?.avatar === avatar) delete data.avatar
    else if (avatar != null) {
      data.xsAvatar = await resizeImg(avatar, 100, 100)
    }
    const url = `/api/users/${String(user?._id)}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'PATCH',
      body: JSON.stringify(data)
    })
    const toastDefaultOptions: any = {
      position: 'top',
      duration: 2500,
      isClosable: true
    }

    if (response.ok) {
      toast({
        ...toastDefaultOptions,
        title: 'Profile updated',
        status: 'success'
      })
      triggerReloadUser()
    } else {
      toast({
        ...toastDefaultOptions,
        title: 'Profile change failed',
        status: 'error'
      })
    }
    setIsLoading(false)
  }

  return (
    <Box shadow='md' p='2' height='fit-content' maxW={300}>
      <Heading size='md'>Profile</Heading>
      <FormControl my='4' isRequired isInvalid={firstNameErr}>
        <Input
          type='text'
          name='firstName'
          value={values.firstName}
          placeholder='First Name'
          onBlur={() => setTouched({ ...touched, firstName: true })}
          onChange={handleChange}
        />
        <Text noOfLines={1} fontSize='xs' color='red.500'>
          {firstNameErr && 'First name is required'}
        </Text>
      </FormControl>
      <FormControl my='4' isInvalid={lastNameErr} isRequired>
        <Input
          type='text'
          name='lastName'
          value={values.lastName}
          placeholder='Last Name'
          onBlur={() => setTouched({ ...touched, lastName: true })}
          onChange={handleChange}
        />
        <Text noOfLines={1} fontSize='xs' color='red.500'>
          {lastNameErr && 'Last name is required'}
        </Text>
      </FormControl>
      <ImgInput
        data={values.avatar}
        onChange={(base64Data) => setValues({ ...values, avatar: base64Data})}
        placeholder={`${user?.firstName} ${user?.lastName}`}
      />
      <Button
        fontWeight='semibold'
        width='full'
        mt={4}
        disabled={isDisabled}
        bg='success'
        color='white'
        onClick={updateProfile}
        isLoading={isLoading}
        loadingText='Updating'
      >
        Update
      </Button>
    </Box>
  )
}

export default Profile

import React, { useState, useEffect, useContext } from 'react'
import {
  Box, Heading, FormControl, Button,
  FormLabel,
  Input,
  Text
} from '@chakra-ui/react'
import { defaultFetchOptions } from '@/util/api'
import { isEmpty } from '@/util/index'
import UserContext from '../../store/user-context'
import ImgInput from '../img-input'
import { resizeImg } from '@/util/img'
import ToastContext from '@/src/store/toast-context'

const Profile = (): JSX.Element => {
  const { showToast } = useContext(ToastContext)
  const { user, triggerReloadUser } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [firstNameErr, setFirstNameErr] = useState(false)
  const [lastNameErr, setLastNameErr] = useState(false)
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    organization: false,
    department: false,
    role: false,
    avatar: false
  })
  const [values, setValues] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    organization: user?.organization ?? '',
    department: user?.department ?? '',
    role: user?.role ?? '',
    avatar: user?.avatar ?? ''
  })

  useEffect(() => {
    if (user == null) return
    setValues({
      firstName: user?.firstName,
      lastName: user?.lastName,
      avatar: user?.avatar ?? '',
      organization: user?.organization ?? '',
      department: user?.department ?? '',
      role: user?.role ?? ''
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

  const handleTouch = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name } = e.target
    setTouched({ ...touched, [name]: true })
  }

  const updateProfile = async (e): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    const data: any = {
      ...values
    }
    // avoid heavy request payload
    if (user?.avatar === data.avatar) delete data.avatar
    else if (data.avatar != null && data.avatar !== '') {
      data.xsAvatar = await resizeImg(data.avatar, 100, 100)
    } else if (data.avatar === '') {
      data.xsAvatar = ''
    }
    const url = `/api/users/${String(user?._id)}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'PATCH',
      body: JSON.stringify(data)
    })

    if (response.ok) {
      showToast({
        title: 'Profile updated',
        status: 'success'
      })
      triggerReloadUser()
    } else {
      showToast({
        title: 'Profile change failed',
        status: 'error'
      })
    }
    setIsLoading(false)
  }

  return (
    <Box shadow='md' p='2' height='fit-content' minW={300}>
      <Heading size='md'>Profile</Heading>
      <FormControl my='4' isRequired isInvalid={firstNameErr}>
        <FormLabel fontSize='xs' pl='1' color='var(--text-grey)'>First name</FormLabel>
        <Input
          type='text'
          name='firstName'
          value={values.firstName}
          placeholder='First name'
          onBlur={handleTouch}
          onChange={handleChange}
        />
        <Text noOfLines={1} fontSize='xs' color='red.500'>
          {firstNameErr && 'First name is required'}
        </Text>
      </FormControl>
      <FormControl my='4' isInvalid={lastNameErr} isRequired>
        <FormLabel fontSize='xs' pl='1' color='var(--text-grey)'>Last name</FormLabel>
        <Input
          type='text'
          name='lastName'
          value={values.lastName}
          placeholder='Last name'
          onBlur={handleTouch}
          onChange={handleChange}
        />
        <Text noOfLines={1} fontSize='xs' color='red.500'>
          {lastNameErr && 'Last name is required'}
        </Text>
      </FormControl>
      <FormControl my='4'>
        <FormLabel fontSize='xs' pl='1' color='var(--text-grey)'>Company / Affiliation / Organization</FormLabel>
        <Input
          type='text'
          name='organization'
          value={values.organization}
          onBlur={handleTouch}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl my='4'>
        <FormLabel fontSize='xs' pl='1' color='var(--text-grey)'>Department / Team</FormLabel>
        <Input
          type='text'
          name='department'
          value={values.department}
          onBlur={handleTouch}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl my='4' size='xs'>
        <FormLabel fontSize='xs' pl='1' color='var(--text-grey)'>Role / Title</FormLabel>
        <Input
          type='text'
          name='role'
          value={values.role}
          onBlur={handleTouch}
          onChange={handleChange}
        />
      </FormControl>
      <ImgInput
        data={values.avatar}
        onChange={(base64Data) => setValues({ ...values, avatar: base64Data })}
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

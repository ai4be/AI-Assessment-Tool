import React, { FC, Fragment, memo, useContext, useEffect, useMemo, useState, useRef, createRef } from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  Button,
  Input,
  ModalOverlay,
  Text,
  Textarea,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Badge,
  RadioGroup,
  Radio,
  Stack,
  CheckboxGroup,
  Checkbox,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  border
} from '@chakra-ui/react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import isEmpty from 'lodash.isempty'
import { AiOutlineDelete, AiOutlineClose, AiOutlineLaptop, AiOutlineDown } from 'react-icons/ai'
import { FiUserPlus } from 'react-icons/fi'
import { GrTextAlignFull } from 'react-icons/gr'
import CardLabel from '@/src/components/project/columns/modals/card-labels-menu'
import Comment from '@/src/components/project/columns/modals/comment'

export default function Page (props): JSX.Element {
  return (
    <Modal size='xl' isOpen={true} isCentered>
      <ModalOverlay maxHeight='100vh' />
      <ModalContent maxW='64rem' overflow='hidden' minHeight='50vh' maxHeight={['100vh', '90vh']} position='relative'>
        <ModalBody p='0' height='100%' display='flex' width='100%' overflowY='scroll' position='relative'>
          <Flex flexDirection='column' height='100%' width='100%' justifyContent='space-between'>
            <Box display='flex'>
              <Box width='100%' marginTop='2rem' ml='4'>
                <Box ml='-4' position='relative'>
                  <Box width='4px' bgColor='var(--main-blue)' borderRightRadius='15px' height='100%' position='absolute' left='0' top='0' />
                  <Text fontSize={[16, 20]} fontWeight='400' px='4'>
                    TEST
                  </Text>
                </Box>

                <Box p={3}>
                  <Comment comment={{ }} />
                </Box>
              </Box>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

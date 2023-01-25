import React, { FC } from 'react'
import {
  Button,
  Text,
  Box,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import { MdLabelOutline } from 'react-icons/md'
import { Label } from '@/src/types/cards'
import { defaultFetchOptions } from '@/util/api'

interface IProps {
  id: string
  projectId: string
}

const cardLabels = [
  {
    type: 'performance',
    bg: '#0079bf'
  },
  {
    type: 'bug',
    bg: '#eb5a46'
  },
  {
    type: 'feature',
    bg: '#61bd4f'
  },
  {
    type: 'information',
    bg: '#ff9f1a'
  },
  {
    type: 'warning',
    bg: '#f2d600'
  }
]

const CardLabel: FC<IProps> = ({ id, projectId }) => {
  const handleClick = async (label: Label): Promise<void> => {
    const data = {
      _id: id,
      projectId,
      label
    }
    const url = `/api/projects/${projectId}/cards/${data._id}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'PATCH',
      body: JSON.stringify(data)
    })
    const inJSON = await response.json()
  }

  return (
    <Box marginTop='2rem' flexDirection='column' width='20%'>
      <List spacing={3} p='5px'>
        <ListItem>
          <Menu size='xs'>
            <MenuButton leftIcon={<MdLabelOutline />} size='xs' whiteSpace='nowrap' as={Button}>
              Labels
            </MenuButton>
            <MenuList padding='5px'>
              {cardLabels.map((item, index) => (
                <MenuItem
                  bg={item.bg}
                  marginBottom='5px'
                  key={index}
                  onClick={async () => await handleClick(item)}
                >
                  <Box minH='20px' />
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </ListItem>
      </List>
    </Box>
  )
}

export default CardLabel
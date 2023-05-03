import React from 'react'
import { Box, Center, Heading, Flex, Wrap } from '@chakra-ui/react'

const teamMemberData = [
  {
    src: '/frontpage/avatars/priscila.jpeg',
    name: 'Priscila Silva',
    workTitle: 'Software Engineer at ATS4IT',
    social: 'https://www.linkedin.com/in/priscilar',
    quote: `Using CSS and knowing CSS are two very different things. I've been using CSS for years, but I didn't know it well.
            <strong>This course is awesome</strong> - I've already learned a ton, and I can't wait to keep going!`
  },
  {
    src: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    name: 'Alain Coletta',
    workTitle: 'Project Manager at AI4Belgium',
    social: 'https://www.linkedin.com',
    quote: 'Using CSS and knowing CSS are two very different things.!'
  },
  {
    src: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    name: 'Robin Duqué',
    workTitle: 'Software Engineer at AI4Belgium',
    social: 'https://www.linkedin.com',
    quote: 'Using CSS and knowing CSS are two very different things.!'
  },
  {
    src: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    name: 'Nathanaël Ackerman',
    workTitle: 'XX at AI4Belgium',
    social: 'https://www.linkedin.com',
    quote: 'Using CSS and knowing CSS are two very different things.!'
  },
  {
    src: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    name: 'Jane Cooper',
    workTitle: 'CEO at ABC Corporation',
    social: 'https://www.linkedin.com',
    quote: 'Using CSS and knowing CSS are two very different things.!'
  },
  {
    src: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    name: 'Jane Cooper',
    workTitle: 'CEO at ABC Corporation',
    social: 'https://www.linkedin.com',
    quote: 'Using CSS and knowing CSS are two very different things.!'
  },
  {
    src: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    name: 'Jane Cooper',
    workTitle: 'CEO at ABC Corporation',
    social: 'https://www.linkedin.com',
    quote: 'Using CSS and knowing CSS are two very different things.!'
  },
  {
    src: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    name: 'Jane Cooper',
    workTitle: 'CEO at ABC Corporation',
    social: 'https://www.linkedin.com',
    quote: 'Using CSS and knowing CSS are two very different things.!'
  }
]

const TeamMemberAvatarBlock = ({ teamMember: { src, quote, social, name, workTitle } }): JSX.Element => {
  return (
    <Box className='dKpDmq'>
      <figure>
        <img src={src} className='fbemPN' />
        <blockquote className='izllJD not-safari'>
          {quote}
        </blockquote>
        <figcaption className='XeeXd'><a href={social}>{name}</a>{workTitle}</figcaption>
      </figure>
    </Box>
  )
}

export const TeamMembersContainer = (): JSX.Element => {
  return (
    <Box py='20vh' px={['5vh', '15vh']} fontSize='2em' bgColor='rgba(20, 17, 24)'>
      <section>
        <section className='kxXjAn'>
          <div className='sLKkl'>
            <div className='gupFpE'>
              <Center>
                <Heading fontSize={['2em', '1em']} className='highlight dark-yellow'>MEET OUR TEAM</Heading>
              </Center>
              <Flex mt='10vh'>
                <Wrap>
                  {teamMemberData.map((tm, i) => (
                    <TeamMemberAvatarBlock key={i} teamMember={tm} />
                  ))}
                </Wrap>
              </Flex>
            </div>
          </div>
        </section>
      </section>
    </Box>
  )
}

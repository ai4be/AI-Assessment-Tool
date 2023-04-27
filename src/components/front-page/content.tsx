import React from 'react'
import { Box, Flex, Text, Center, Image, Wrap, Heading, Spacer } from '@chakra-ui/react'
import Typed from 'typed.js'
import checkEnvironment from '@/util/check-environment'
import { TeamMembersContainer } from './team'
import { AltaiSections } from './altai-sections'
import { TryItOutButton } from './try-out-button'
import { Waves, WavesOutline } from './waves'

export const Content = (): JSX.Element => {
  return (
    <Flex flexDirection='column'>
      <Box mt={['5vh', '10vh']} mb={['5vh', '10vh']} ml={['5vh', '35vh']} mr={['5vh', '35vh']} justifyContent='center' color='white' fontSize='2em' textAlign={['center', 'left']}>
        <Flex>
          <Wrap align={['center', 'left']} justify={['center', 'left']}>
            <Box>
              <TypingEffect texts={['ethical?', 'trustworthy?', 'racially unbiased?']} />
            </Box>
            <Box>
              <Image src='/frontpage/demo1.png' alt='Demo image' height='30vh' width='50vh' />
            </Box>
          </Wrap>
        </Flex>
        <Box mt='10vh'>
          <Text fontSize='1em'>Welcome to our <span className='text-gradient-purple-light-blue'>Open Source</span> <span className='wave-underline yellow'>multidisciplinary</span> and <span className='wave-underline green'>interactive</span> online tool for assessing the trustworthiness of an organization's AI implementation.</Text>
          <Text fontSize='1em' mt='5vh'>The tool is based on the <span className='wave-underline purple'>ALTAI</span> recommendations published by the <span className='text-gradient-light-blue-purple'>European Commission</span> and is designed to help organizations ensure their AI systems are transparent, robust, and trustworthy.</Text>
        </Box>
      </Box>

      <WavesOutline />
      <Box m='10vh' color='white'>
        {/* <span className='hsnUkW'><strong>Highlight Areas of Risk</strong>
          <img alt='' src='/frontpage/long-underline.png' className='jPBecK hyFyLL' />
        </span> */}
        {/* <Heading className='container'>
          <h1>This <span className='highlight-container'><span className='highlight'>Highlight</span></span> Areas of Risk</h1>
        </Heading> */}
        {/* <Center> */}
        <Heading mb='5vh' className='heading-gradient-pink-yellow-white'>Highlight Areas of Risk</Heading>
        {/* </Center> */}
        <Text>In today's fast-paced world, organizations are increasingly adopting AI to streamline operations and improve decision-making. However, AI systems must be developed and <span className='wave-underline green'>implemented with caution</span>, ensuring that they do not compromise fundamental human rights or perpetuate bias and discrimination. Our tool provides a comprehensive assessment of your organization's AI implementation, highlighting areas of strength and areas for improvement.</Text>
        <Heading mt='5vh' style={{ position: 'relative' }}>
          <Image src='/frontpage/arrow.png' alt='Demo image' className='fniWYQ' />
          <strong className='jezIaW'>Recommendations Report</strong>
        </Heading>
        <Text mt='5vh'>You will also receive detailed suggestions and guidance for improving the trustworthiness of your AI system. This will enable you to build and maintain trust with your customers, employees, and other stakeholders, and mitigate the risks associated with AI implementation.</Text>
        <Heading mt='10vh'>YOU ARE IN CONTROL</Heading>
        <Text mt='5vh'>One of the key benefits of our open-source tool is that it can be hosted and fully controlled by your organization. This means that you can maintain complete ownership and control over your data and assessments.</Text>
        <Text mt='5vh'>By hosting the tool on your own servers, you can also ensure that the tool meets your organization's specific security and privacy requirements.</Text>
        <Text mt='5vh'>Additionally, as an open-source tool, you can modify and adapt the tool to fit your organization's unique needs.</Text>
        <Text mt='5vh'>This flexibility and control make our tool an ideal solution for organizations looking to assess the trustworthiness of their AI systems while maintaining full control over their data and assessments.</Text>
        <Center mt='10vh'>
          <TryItOutButton link={checkEnvironment()} label='Try it here' />
        </Center>
      </Box>
      <Waves colour4='rgba(238,242,246)' colour3='#fff' />
      <TeamMembersContainer />
      <AltaiSections />
      <Waves />
      <FinalConsiderations />
    </Flex>
  )
}

const TypingEffect = ({ texts }): JSX.Element => {
  const el = React.useRef(null)

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: texts,
      typeSpeed: 110,
      loop: true
    })

    return () => {
      typed.destroy()
    }
  }, [])

  return (
    <Box w='600px' h='250px'>
      <Text className='text-gradient-purple-light-blue' style={{ fontSize: '1.2em' }}>Is your AI</Text>
      <span className='text-gradient-purple-light-blue' style={{ fontSize: '2em' }} ref={el} />
    </Box>
  )
}

const FinalConsiderations = (): JSX.Element => {
  return (
    <Box m='5vh' textAlign='center' color='white' fontSize='0.75em'>
      <Text>
        Thank you for considering our tool for assessing the trustworthiness of your AI implementation. We are committed to ensuring that AI is developed and implemented in a responsible and trustworthy manner.
      </Text>
      <Text mt='5vh'>
        Install On your own - Instructions from README file
      </Text>
    </Box>
  )
}

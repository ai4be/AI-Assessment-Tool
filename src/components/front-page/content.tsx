import React from 'react'
import { Box, Flex, Text, Center, Image, Wrap, Heading, Spacer } from '@chakra-ui/react'
import Typed from 'typed.js'
import checkEnvironment from '@/util/check-environment'
import { TeamMembersContainer } from './team'
import { AltaiSections } from './altai-sections'
import { TryItOutButton } from './try-out-button'
import { WaveBlackToGray, WavePurple, WavesOutline } from './waves'

export const Content = (): JSX.Element => {
  return (
    <Flex flexDirection='column'>
      <Part1 />
      <WavesOutline />
      <Part2 />
      <WaveBlackToGray />
      <Part3 />
      <WaveBlackToGray />
      <TeamMembersContainer />
      <WavePurple />
      <AltaiSections />
      <WaveBlackToGray />
    </Flex>
  )
}

const Part1 = (): JSX.Element => {
  return (
    <Box py='20vh' px={['5vh', '35vh']} color='white' fontSize='2em' textAlign={['center', 'left']} bgColor='rgba(20, 17, 24)'>
      <Flex flexDirection='column' justifyContent='space-between' mt='5vh'>
        <Wrap>
          <Box maxWidth='40vh'>
            <TypingEffect texts={['ethical?', 'trustworthy?', 'racially unbiased?']} />
          </Box>
          <Spacer />
          <Box>
            <Image src='/frontpage/demo1.png' alt='Demo image' height='30vh' width='50vh' />
          </Box>
        </Wrap>
      </Flex>
      <Box mt='10vh'>
        <Text fontSize={['2em', '1em']}>Welcome to our <span className='text-gradient-purple-light-blue'>Open Source</span> <span className='wave-underline yellow'>multidisciplinary</span> and <span className='wave-underline green'>interactive</span> online tool for assessing the trustworthiness of an organization's AI implementation.</Text>
        <Text fontSize={['2em', '1em']} mt='5vh'>The tool is based on the <span className='wave-underline purple'>ALTAI</span> recommendations published by the <span className='text-gradient-light-blue-purple'>European Commission</span> and is designed to help organizations ensure their AI systems are transparent, robust, and trustworthy.</Text>
      </Box>
    </Box>
  )
}

const Part2 = (): JSX.Element => {
  return (
    <Box py='20vh' px={['5vh', '35vh']} color='white' fontSize='2em' bgColor='rgba(14, 16, 18)'>
      <Heading fontSize={['2em', '1em']} className='heading-gradient-pink-yellow-white'>Highlight Areas of Risk</Heading>
      <Text fontSize={['2em', '1em']} mt='10vh'>In today's fast-paced world, organizations are increasingly adopting AI to streamline operations and improve decision-making. However, AI systems must be developed and <Text as='span' className='highlight dark-yellow'>implemented with caution</Text>, ensuring that they do not compromise fundamental human rights or perpetuate bias and discrimination. Our tool provides a comprehensive assessment of your organization's AI implementation, <Text as='span' className='highlight pink'>highlighting areas of strength and areas for improvement.</Text></Text>
      <Heading mt={['20vh', '10vh']} style={{ position: 'relative' }}>
        <Image src='/frontpage/arrow.png' alt='Demo image' className='fniWYQ' />
        <Text className='jezIaW' fontSize={['2em', '1em']}>Recommendations Report</Text>
      </Heading>
      <Text fontSize={['2em', '1em']} mt='10vh'>You will also receive detailed <Text as='span' className='highlight red'>suggestions and guidance</Text> for improving the trustworthiness of your AI system. This will enable you to build and maintain <Text as='span' className='highlight yellow'>trust</Text> with your customers, employees, and other stakeholders, and <Text as='span' className='highlight red'>mitigate the risks</Text> associated with AI implementation.</Text>
      <Heading mt={['20vh', '10vh']} className='highlight red' fontSize={['2em', '1em']}>YOU ARE IN CONTROL</Heading>
      <Text fontSize={['2em', '1em']} mt='10vh'>One of the key benefits of our <Text as='span' className='highlight yellow bold'>open-source</Text> tool is that it can be <Text as='span' className='highlight yellow'>hosted and fully controlled by your organization</Text>. This means that you can maintain complete ownership and control over your data and assessments.</Text>
      <Text fontSize={['2em', '1em']} mt='10vh'>By hosting the tool on your own servers, you can also ensure that the tool <Text as='span' className='highlight red'>meets your</Text> organization's specific <Text as='span' className='highlight red'>security and privacy requirements</Text>.</Text>
      <Text fontSize={['2em', '1em']} mt='10vh'>Additionally, as an open-source tool, you can modify and adapt the tool to fit your <Text as='span' className='highlight yellow'>organization's unique needs</Text>.</Text>
      <Text fontSize={['2em', '1em']} mt='10vh'>This flexibility and control make our tool an ideal solution for organizations looking to assess the trustworthiness of their AI systems while maintaining full control over their data and assessments.</Text>
      <Center mt='10vh'>
        <Heading className='highlight dark-yellow' fontSize={['2em', '1em']}>GET AND INSTALL IN YOUR OWN SERVERS</Heading>
      </Center>
      <Center mt='10vh'>
        <TryItOutButton link={checkEnvironment()} label='Install it here' />
      </Center>
    </Box>
  )
}

const Part3 = (): JSX.Element => {
  return (
    <Box py='20vh' px={['5vh', '35vh']} color='white' fontSize='2em' bgColor='rgba(20, 17, 24)'>
      <Heading className='highlight dark-yellow' fontSize={['2em', '1em']} textAlign={['center', 'left']}>TRY OUR DEMO INSTANCE</Heading>
      <Flex flexDirection='column' justifyContent='space-between' mt='10vh'>
        <Wrap>
          <Box width='12em'>
            <Text fontSize={['2em', '1em']}>This text explains this is for demo purposes only ad we hold no responsibility</Text>
          </Box>
          <Spacer />
          <Box>
            <Image src='/frontpage/demo2.png' alt='Demo image' height='30vh' width='50vh' />
          </Box>
        </Wrap>
      </Flex>
      <Center mt='10vh'>
        <TryItOutButton link={checkEnvironment()} label='Try it here' />
      </Center>
    </Box>
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
    <Box w='12em' h={['350px', '250px']}>
      <Text className='text-gradient-purple-light-blue' style={{ fontSize: '2em' }}>Is your AI</Text>
      <span className='text-gradient-purple-light-blue' style={{ fontSize: '2em', width: 'fit-content' }} ref={el} />
    </Box>
  )
}

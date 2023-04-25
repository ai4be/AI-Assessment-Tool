import React from 'react'
import { Box, Flex, Text, Center } from '@chakra-ui/react'
import Typed from 'typed.js'
import checkEnvironment from '@/util/check-environment'
import { TeamMembersContainer } from './team'
import { AltaiSections } from './altai-sections'
import { TryItOutButton } from './try-out-button'
import { Waves, WavesOutline } from './waves'

export const Content = (): JSX.Element => {
  return (
    <Flex flexDirection='column' fontSize='1.5em'>
      <TypingEffect texts={['ethical?', 'trustworthy?', 'racially unbiased?']} />
      <Text m='10vh' mt='5vh' color='white'>Welcome to our Open Source multidisciplinary and interactive online tool for assessing the trustworthiness of an organization's AI implementation. The tool is based on the ALTAI recommendations published by the European Commission and is designed to help organizations ensure their AI systems are transparent, robust, and trustworthy.</Text>
      <WavesOutline />
      <Box m='5vh' mt='10vh' color='white' textAlign='center'>
        <Text>In today's fast-paced world, organizations are increasingly adopting AI to streamline operations and improve decision-making. However, AI systems must be developed and implemented with caution, ensuring that they do not compromise fundamental human rights or perpetuate bias and discrimination. Our tool provides a comprehensive assessment of your organization's AI implementation, highlighting areas of strength and areas for improvement.</Text>
        <Text mt='5vh'>By using our tool, your organization will gain a better understanding of the strengths and weaknesses of your AI implementation. You will also receive detailed recommendations for improving the trustworthiness of your AI system. This will enable you to build and maintain trust with your customers, employees, and other stakeholders, and mitigate the risks associated with AI implementation.</Text>
        <Text mt='5vh'>One of the key benefits of our open-source tool is that it can be hosted and fully controlled by your organization. This means that you can maintain complete ownership and control over your data and assessments. By hosting the tool on your own servers, you can also ensure that the tool meets your organization's specific security and privacy requirements. Additionally, as an open-source tool, you can modify and adapt the tool to fit your organization's unique needs. This flexibility and control make our tool an ideal solution for organizations looking to assess the trustworthiness of their AI systems while maintaining full control over their data and assessments.</Text>
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
    <>
      <Box height='200px' ml='10vh' mt='15vh'>
        <Text className='typed'>Is your AI <span className='typed' style={{ fontSize: '2em' }} ref={el} /></Text>
      </Box>
    </>
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

import React from 'react'
import { Box, Center, Heading, Flex, Wrap } from '@chakra-ui/react'
import style from './team.module.scss'

const teamMemberData = [
  {
    src: 'https://res.cloudinary.com/dokuarhtk/image/upload/v1647090512/AI4Belgium/Nathalie_Smuha_im4ukv.jpg',
    name: 'Nathalie Smuha',
    workTitle: 'Researcher at KU Leuven',
    social: 'https://www.linkedin.com/in/nathalie-smuha-2aa0b071/ ',
    quote: 'Nathalie Smuha is a legal scholar and philosopher at the KU Leuven Faculty of Law, where she examines legal, ethical and philosophical questions around Artificial Intelligence (AI) and other digital technologies.'
  },
  {
    src: 'https://res.cloudinary.com/dinbpwxre/image/upload/v1676974360/1516489086811_lo0q5e.jpg',
    name: 'Nele Roekens',
    workTitle: 'Legal Advisor - Unia • Interfederal Centre for Equal Opportunities',
    social: 'https://www.linkedin.com/in/nele-roekens-ab127573/',
    quote: 'Nele is legal advisor at Unia, the Belgian National Human Rights Institution and Equality Body. She specializes in tech and human rights, most notably non-discrimination.'
  },
  {
    src: 'https://res.cloudinary.com/dokuarhtk/image/upload/v1647090530/AI4Belgium/Jelle_Hoedemaekers_ymickc.jpg',
    name: ' Jelle Hoedemaekers',
    workTitle: 'Stadardization Expert at Agoria',
    social: 'https://www.linkedin.com/in/jelle-hoedemaekers-0478895a/',
    quote: 'Jelle is an expert in AI Regulation. He works as ICT Normalisation expert at Agoria, where he is focused on the standardisation and regulation of new technologies such as Artificial Intelligence. Within Agoria he also works on policies surrounding new technologies. Jelle also co-leads the AI4belgium work group on Ethics and Law, which looks at the ethical and juridical implications of AI on the Belgian ecosystem.'
  },
  {
    src: 'https://res.cloudinary.com/dokuarhtk/image/upload/v1647090556/AI4Belgium/CarlMorch_ox7x1j.png',
    name: 'Carl Mörch',
    workTitle: ' Co-manager - FARI • AI Institute for Common Good ',
    social: 'https://www.linkedin.com/in/carl-maria-m%C3%B6rch-99429976/',
    quote: ' am co-directing FARI - AI for the Common Good Institute. This project is a joint initiative between Université Libre de Bruxelles (ULB) and the Vrije Universiteit Brussel (VUB).I am also an associate researcher at Algora Lab (UdeM, Mila, Canada) and an adjunct professor (UQAM, Canada). I have developed and published an AI Ethics Tool, and I work on the responsible use of technologies in healthcare.'
  },
  {
    src: 'https://res.cloudinary.com/dinbpwxre/image/upload/v1676974424/Rob-Heyman_oslgv4.png',
    name: 'Rob Heyman',
    workTitle: ' Director - Data & Maatschappij Kennis Centrum',
    social: 'https://www.linkedin.com/in/rob-heyman-7182976/',
    quote: 'The more digitalised we live, the more we get personalised decisions based on our information. My goal is to uncover how these things work and get people to understand what happens with data. I find it curious that so little is known about data in the age of big data. My method consists of uncovering the hidden life of data by mapping these processes in easy to digest, texts, scenarios and visuals. We then use co-creation sessions to map current practices with end-users expectations, regulators or innovators.'
  },
  {
    src: 'https://res.cloudinary.com/dokuarhtk/image/upload/v1647090511/AI4Belgium/Nathanael_Ackerman_pqsczu.jpg',
    name: 'Nathanaël Ackerman',
    workTitle: ' Manager BOSA - AI - Minds Team ',
    social: 'https://www.linkedin.com/in/nathanael-ackerman-4715881/',
    quote: 'Nathanaël Ackerman is the managing director of the AI4Belgium coalition and Digital Mind for Belgium appointed by the Secretary of State for Digitalization. He is also head of the “AI – Blockchain & Digital Minds” team for the Belgian Federal Public Service Strategy and Support (BoSa).'
  }
]

const TeamMemberAvatarBlock = ({ teamMember: { src, quote, social, name, workTitle } }: { teamMember: { src: string, quote: string, social: string, name: string, workTitle: string } }): JSX.Element => {
  return (
    <Box className={style.team_member}>
      <figure>
        <img src={src} />
        <figcaption><a href={social}>{name}</a>{workTitle}</figcaption>
        <blockquote className='not-safari'>
          {quote}
        </blockquote>
      </figure>
    </Box>
  )
}

export const TeamMembersContainer = (): JSX.Element => {
  return (
    <Box py='20vh' px={['5vh', '15vh']} fontSize='2em' className={style.team_container}>
      <Box as='section' position='relative' zIndex='2'>
        <Center>
          <Heading fontSize={['2em', '1em']} className='highlight dark-yellow'>Meet the <span className='text-white'>AI</span><span className='text-sky-600'>4</span><span className='text-white'>Belgium</span> Ethics <span className='text-base'>&</span> Law <span className='text-white'>advisory board</span></Heading>
        </Center>
        <Flex mt='10vh'>
          <Wrap>
            {teamMemberData.map((tm, i) => <TeamMemberAvatarBlock key={i} teamMember={tm} />)}
          </Wrap>
        </Flex>
      </Box>
    </Box>
  )
}

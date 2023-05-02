
import { Box, Text, Container, SimpleGrid, HStack, VStack } from '@chakra-ui/react'

const altaiSections = [
  {
    title: '1. Fundamental rights',
    description: 'This section emphasizes the need to respect fundamental human rights in the development and deployment of AI systems. It includes guidelines for ensuring that AI systems do not violate human dignity, privacy, or other fundamental rights.'
  },
  {
    title: '2. Human agency and oversight',
    description: 'This section stresses the importance of human oversight in AI decision-making. It provides guidelines for ensuring that humans remain in control of AI systems and that decisions made by AI systems are explainable and auditable.'
  },
  {
    title: '3. Technical robustness and safety',
    description: 'This section provides guidelines for ensuring the technical robustness and safety of AI systems. It covers topics such as system reliability, cybersecurity, and resilience.'
  },
  {
    title: '4. Privacy and data governance',
    description: 'This section focuses on the need to protect personal data and ensure proper data governance in the development and deployment of AI systems. It provides guidelines for ensuring that personal data is collected, processed, and stored in a transparent and secure manner.'
  },
  {
    title: '5. Transparency',
    description: 'This section stresses the importance of transparency in AI decision-making. It provides guidelines for ensuring that AI decision-making processes are explainable and that users can understand how decisions are made.'
  },
  {
    title: '6. Diversity, non-discrimination, and fairness',
    description: 'This section provides guidelines for ensuring that AI systems do not perpetuate bias and discrimination. It covers topics such as data bias, fairness in decision-making, and inclusivity.'
  },
  {
    title: '7. Societal and environmental wellbeing',
    description: 'This section emphasizes the need to consider the societal and environmental impact of AI systems. It provides guidelines for ensuring that AI systems are developed and deployed in a way that promotes social and environmental wellbeing.'
  },
  {
    title: '8. Accountability',
    description: 'This section provides guidelines for ensuring accountability in AI development and deployment. It covers topics such as legal compliance, risk management, and stakeholder engagement.'
  }
]

// export const AltaiSections = (): JSX.Element => {
//   return (
//     <Box color='white' mt='5vh' textAlign='center'>
//       <Text m='5vh'>
//         Our tool was designed with a multidisciplinary team in mind, enabling team members with diverse expertise to collaborate and have conversations about key topics related to the trustworthiness of their AI implementation. The tool consists of eight sections, each covering a specific area, including fundamental rights, human agency and oversight, technical robustness and safety, privacy and data governance, transparency, diversity, non-discrimination and fairness, societal and environmental wellbeing, and accountability. These sections contain a series of questions that facilitate discussions and assessments related to the AI implementation, allowing the team to identify areas of strength and areas for improvement. By providing a comprehensive framework for team collaboration and evaluation, our tool helps organizations ensure that their AI systems are trustworthy and meet ethical and legal standards.
//       </Text>
//       <Text m='5vh'>
//         The ALTAI (Assessment List for Trustworthy Artificial Intelligence) is a set of guidelines published by the European Commission for developing and implementing trustworthy AI. The ALTAI consists of eight sections, each covering a specific aspect of AI development and implementation.
//       </Text>
//       <Container maxW='6xl' mt={10} textAlign='start'>
//         <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
//           {altaiSections.map((feature, i) => (
//             <HStack key={i} align='top'>
//               <Box color='blue.400'>
//                 <Text>{i + 1}</Text>
//               </Box>
//               <VStack align='start'>
//                 <Text fontWeight={600}>{feature.title}</Text>
//                 <Text fontSize='0.75em'>{feature.description}</Text>
//               </VStack>
//             </HStack>
//           ))}
//         </SimpleGrid>
//       </Container>
//     </Box>
//   )
// }

export const AltaiSections = (): JSX.Element => {
  return (
    <div className='ijRRAe hUUorZ'>
      <em className='dErbTQ'>TOOL DESCRIPTION</em>
      <p className='cNGIMJ'>
        Our tool was designed with a multidisciplinary team in mind, enabling team members with diverse expertise to collaborate and have conversations about key topics related to the trustworthiness of their AI implementation. <br className='dlKhGG' />
        The tool consists of eight sections:
      </p>
      <div className='ksXelq'>
        <div className='jdPXMj'>
          <ul className='loozsJ'>
            {altaiSections.map((altaiSection, i) => (
              <li key={i} className='bwvpxK'>
                <span className='lkSYSE'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <line x1='5' y1='12' x2='19' y2='12' />
                    <polyline points='12 5 19 12 12 19' />
                  </svg>
                </span>
                <div role='listitem'><strong>{altaiSection.title}</strong> {altaiSection.description}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='kWZXb' />
      </div>
      <div className='LFaQi bmXsqC' />
      <div className='LFaQi cRgQMO' />
    </div>
  )
}

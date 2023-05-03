
import { Box, Text, Heading } from '@chakra-ui/react'

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

export const AltaiSections = (): JSX.Element => {
  return (
    <Box py='20vh' px={['15vh', '35vh']} justifyContent='center' color='white' bgColor='rgba(14, 16, 18)'>
      <div className='centralised-container'>
        <Heading className='centralised-sunshine-gradient-title'>TOOL DESCRIPTION</Heading>
        <Text fontSize='1em'>Our tool was designed with a multidisciplinary team in mind, enabling team members with diverse expertise to collaborate and have conversations about key topics related to the trustworthiness of their AI implementation.</Text>
        <Text fontSize='1em' my='5vh'>The tool consists of eight sections:</Text>
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
        <div className='gradient-fade-section bmXsqC' />
        <div className='gradient-fade-section cRgQMO' />
      </div>
    </Box>
  )
}

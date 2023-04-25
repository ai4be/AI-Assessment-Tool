
import { Box, Text, Container, SimpleGrid, HStack, VStack } from '@chakra-ui/react'

const altaiSections = [
  {
    title: 'Fundamental rights',
    description: 'This section emphasizes the need to respect fundamental human rights in the development and deployment of AI systems. It includes guidelines for ensuring that AI systems do not violate human dignity, privacy, or other fundamental rights.'
  },
  {
    title: 'Human agency and oversight',
    description: 'This section stresses the importance of human oversight in AI decision-making. It provides guidelines for ensuring that humans remain in control of AI systems and that decisions made by AI systems are explainable and auditable.'
  },
  {
    title: 'Technical robustness and safety',
    description: 'This section provides guidelines for ensuring the technical robustness and safety of AI systems. It covers topics such as system reliability, cybersecurity, and resilience.'
  },
  {
    title: 'Privacy and data governance',
    description: 'This section focuses on the need to protect personal data and ensure proper data governance in the development and deployment of AI systems. It provides guidelines for ensuring that personal data is collected, processed, and stored in a transparent and secure manner.'
  },
  {
    title: 'Transparency',
    description: 'This section stresses the importance of transparency in AI decision-making. It provides guidelines for ensuring that AI decision-making processes are explainable and that users can understand how decisions are made.'
  },
  {
    title: 'Diversity, non-discrimination, and fairness',
    description: 'This section provides guidelines for ensuring that AI systems do not perpetuate bias and discrimination. It covers topics such as data bias, fairness in decision-making, and inclusivity.'
  },
  {
    title: 'Societal and environmental wellbeing',
    description: 'This section emphasizes the need to consider the societal and environmental impact of AI systems. It provides guidelines for ensuring that AI systems are developed and deployed in a way that promotes social and environmental wellbeing.'
  },
  {
    title: 'Accountability',
    description: 'This section provides guidelines for ensuring accountability in AI development and deployment. It covers topics such as legal compliance, risk management, and stakeholder engagement.'
  }
]

export const AltaiSections = (): JSX.Element => {
  return (
    <Box color='white' mt='5vh' textAlign='center'>
      <Text m='5vh'>
        Our tool was designed with a multidisciplinary team in mind, enabling team members with diverse expertise to collaborate and have conversations about key topics related to the trustworthiness of their AI implementation. The tool consists of eight sections, each covering a specific area, including fundamental rights, human agency and oversight, technical robustness and safety, privacy and data governance, transparency, diversity, non-discrimination and fairness, societal and environmental wellbeing, and accountability. These sections contain a series of questions that facilitate discussions and assessments related to the AI implementation, allowing the team to identify areas of strength and areas for improvement. By providing a comprehensive framework for team collaboration and evaluation, our tool helps organizations ensure that their AI systems are trustworthy and meet ethical and legal standards.
      </Text>
      <Text m='5vh'>
        The ALTAI (Assessment List for Trustworthy Artificial Intelligence) is a set of guidelines published by the European Commission for developing and implementing trustworthy AI. The ALTAI consists of eight sections, each covering a specific aspect of AI development and implementation.
      </Text>
      <Container maxW='6xl' mt={10} textAlign='start'>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          {altaiSections.map((feature, i) => (
            <HStack key={i} align='top'>
              <Box color='blue.400'>
                <Text>{i + 1}</Text>
              </Box>
              <VStack align='start'>
                <Text fontWeight={600}>{feature.title}</Text>
                <Text fontSize='0.75em'>{feature.description}</Text>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}
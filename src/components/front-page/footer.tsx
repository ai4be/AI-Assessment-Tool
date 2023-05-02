import React, { ReactNode } from 'react'
import { Box, Text, Image, Stack, Button, useColorModeValue, Container, VisuallyHidden } from '@chakra-ui/react'
import { FaGithub, FaNewspaper } from 'react-icons/fa'

const Logo = (): JSX.Element => {
  return (
    <>
      <div className='px-3 py-5 flex font-semibold text-lg cursor-pointer'>
        <Image src='/frontpage/bosa-logo.svg' alt='BOSA logo' height='30px' mr='2vh' />
        <Text> AI<sub className='icon-blue-color text-lg'>4</sub>Belgium</Text>
      </div>
    </>
  )
}

const SocialButton = ({ children, label, href }: { children: ReactNode, label: string, href: string }): JSX.Element => {
  return (
    <Button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded='full'
      w={16}
      h={16}
      cursor='pointer'
      as='a'
      href={href}
      display='inline-flex'
      alignItems='center'
      justifyContent='center'
      transition='background 0.3s ease'
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Button>
  )
}

// export const Footer = (): JSX.Element => {
//   return (
//     <Box>
//       <Container
//         as={Stack}
//         maxW='6xl'
//         py={4}
//         direction={{ base: 'column', md: 'row' }}
//         spacing={4}
//         justify={{ base: 'center', md: 'space-between' }}
//         align={{ base: 'center', md: 'center' }}
//       >
//         <Logo />
//         <Text>Made with love ❤️ in Belgium</Text>
//         <Stack direction='row' spacing={8}>
//           <SocialButton label='GitHub' href='https://github.com/AI4Belgium/AI-Assessment-Tool'>
//             <FaGithub />
//           </SocialButton>
//           <SocialButton label='Docs' href='#'>
//             <FaNewspaper />
//           </SocialButton>
//         </Stack>
//       </Container>
//     </Box>
//   )
// }

export const Footer = (): JSX.Element => {
  return (
    <>
      <div className='Spacer-sc-10g2e3i-0 bVJRxK' />
      <footer role='contentinfo' className='Footer__Wrapper-sc-1845965-2 hHFNMG'>
        <div className='MaxWidthWrapper-sc-1m82fou-0 Footer__InnerWrapper-sc-1845965-3 krGdMj jewhyu'>
          <div className='Footer__Left-sc-1845965-4 kJcUuM'>
            <div className='Footer__Top-sc-1845965-10 gSInsy'>
              <a aria-current='page' href='/' className='Link__ExternalLink-sc-l9zb01-0 Link__InternalLink-sc-l9zb01-1 ePaTNF bRFiMF Logo__Wrapper-sc-r9y15f-0 bBRTXo'>
                <span className='Logo__First-sc-r9y15f-1 hJkUTO'>Josh</span>
                <span className='Logo__MissingLetter-sc-r9y15f-6 evdgOg'>
                  <svg width='14' height='12' viewBox='0 0 14 12' fill='none' className='Logo__W-sc-r9y15f-4 cKibfp'>
                    <path
                      d='M1.83685 4.19021C2.50472 5.35898 3.23081 6.5572 3.80331 7.77375C4.05248 8.30325 4.35843 9.36185 4.81149 9.75018C5.73454 10.5414 6.29678 10.273 6.76796 9.06143C7.13194 8.12547 7. 08915 7.54655 6.12672C7.91111 5.10596 9.23909 6.70274 9.78252 7.06503C10.3171 7.42139 13.574 9.528 12.8869 7.60406C12.6687 6.99301 12.6107 6.33922 12.4777 5.70748C12.3451 5.07774 1228137 12.0784 3.65119C12.0399 2.88207 11.719 2.12838 11.719 1.3154'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className='Logo__Path-sc-r9y15f-5 eMFrIG'
                    />
                  </svg>
                  <svg width='9' height='10' viewBox='0 0 9 10' fill='none' className='Logo__Under-sc-r9y15f-3 idVJDh'>
                    <path
                      d='M1 9C2.23995 7.12464 3.87268 5.18927 4.17593 2.59926C4.22017 2.22137 4.11111 0.731563 4.11111 1.04233C4.11111 1.49132 4.41831 2.03152 4.55761 2.40705C4.98522 3.55977 5.31447 4.92593 5.70352C6.43274 6.54092 7.08081 7.96204 8 7.96204'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className='Logo__Path-sc-r9y15f-5 eMFrIG'
                    />
                  </svg>
                  <span className='Logo__Invisible-sc-r9y15f-7 euWFEy'>W</span>
                </span>
                <span className='Logo__Second-sc-r9y15f-2 fQqeXr'>Comeau</span>
              </a>
            </div>
            <span className='Footer__DesktopOnly-sc-1845965-0 cnSRnp'><div className='Footer__Copyright-sc-1845965-11 daAVuX'>© 2020-present Joshua Comeau. All Rights Reserved.</div></span>
          </div>
          <div className='Footer__Right-sc-1845965-5 cZBtTw'>
            <div className='Footer__Column-sc-1845965-6 fbrthz'>
              <h3 className='Footer__Heading-sc-1845965-8 gGVGIr'>Links</h3>
              <div className='Footer__OneColumnChildren-sc-1845965-9 dtPvvd'>
                <a href='https://courses.joshwcomeau.com/terms' rel='noopener noreferrer' target='_blank' className='Link__ExternalLink-sc-l9zb01-0 ePaTNF Footer__FooterLink-sc-1845965-7 bXtwwk'>Terms of Use</a>
                <a href='https://courses.joshwcomeau.com/privacy' rel='noopener noreferrer' target='_blank' className='Link__ExternalLink-sc-l9zb01-0 ePaTNF Footer__FooterLink-sc-1845965-7 bXtwwk'>Privacy Policy</a>
                <a href='mailto:support@joshwcomeau.com' rel='noopener noreferrer' target='_blank' className='Link__ExternalLink-sc-l9zb01-0 ePaTNF Footer__FooterLink-sc-1845965-7 bXtwwk'>Contact</a>
                <a href='https://twitter.com/joshwcomeau' rel='noopener noreferrer' target='_blank' className='Link__ExternalLink-sc-l9zb01-0 ePaTNF Footer__FooterLink-sc-1845965-7 bXtwwk'>Twitter</a>
              </div>
            </div>
          </div>
          <span className='Footer__MobileOnly-sc-1845965-1 ixxfuT'>
            <div className='Footer__Copyright-sc-1845965-11 Footer__MobileCopyright-sc-1845965-12 daAVuX kBLCHA'>© 2020-present Joshua Comeau. All Rights Reserved.</div>
          </span>
        </div>
      </footer>
    </>
  )
}

import { Select } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function LocaleSwitcher() {
  const router = useRouter()
  const lngs = [
    { key: 'en', name: 'English' },
    { key: 'fr', name: 'Français' },
    { key: 'nl', name: 'Nederlands'}
  ]

  const handleOnChange = (locale) => {
    router.push(router.asPath, router.asPath, { locale: locale })
  }

  return (
    <span>
      <Select size="xs" onChange={(e) => handleOnChange(e.target.value)} value={router.locale}>
        {lngs?.map((locale) => (
          <option key={locale.key} value={locale.key}>
            {locale.name}
          </option>
        ))}
      </Select>
    </span>
  )
}

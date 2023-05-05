import { Select } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function LocaleSwitcher (): JSX.Element {
  const router = useRouter()
  const lngs = [
    { key: 'en', name: 'English' },
    { key: 'fr', name: 'Français' },
    { key: 'nl', name: 'Nederlands' }
  ]

  const handleOnChange = (locale: string): void => {
    // push new locale into a cookie so it can be overwritten and used on middleware
    setCookie(locale)
    void router.push(router.asPath, router.asPath, { locale })
  }

  const setCookie = (lang: string): void => {
    document.cookie = `NEXT_LOCALE=${lang}; path=/;`
  }

  return (
    <span>
      <Select size='xs' onChange={(e) => handleOnChange(e.target.value)} value={router.locale}>
        {lngs?.map((locale) => (
          <option key={locale.key} value={locale.key}>
            {locale.name}
          </option>
        ))}
      </Select>
    </span>
  )
}

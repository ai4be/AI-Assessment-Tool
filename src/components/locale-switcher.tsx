import { useState } from 'react'
import { Select } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function LocaleSwitcher() {
  const router = useRouter()
  const lngs = [
    { key: 'en', name: 'English' },
    { key: 'fr', name: 'Français' },
    { key: 'nl', name: 'Nederlands'}
  ]
  const defaultLng = lngs[0];
  const [selectedLang, setSelectedLang] = useState(defaultLng)

  const handleOnChange = (locale) => {
    const selected = lngs.find((l) => l.key === locale)
    setSelectedLang(selected || defaultLng)
    router.push(router.asPath, router.asPath, { locale: locale })
  }

  return (
    <span>
      <Select size="xs" onChange={(e) => handleOnChange(e.target.value)} value={selectedLang.key}>
        {lngs?.map((locale) => (
          <option key={locale.key} value={locale.key}>
            {locale.name}
          </option>
        ))}
      </Select>
    </span>
  )
}

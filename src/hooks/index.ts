import { useEffect, useState, useMemo, RefObject } from 'react'

export const useOnScreen = (ref: RefObject<HTMLElement>, rootMargin: string = '0px'): boolean => {
  const [isIntersecting, setIntersecting] = useState(false)

  const observer = useMemo(() => new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting),
    { rootMargin, threshold: 1.0 }
  ), [ref])

  useEffect(() => {
    if (ref.current != null) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return isIntersecting
}

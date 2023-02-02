import { useEffect, useState, useMemo, RefObject } from 'react'
import { useRouter } from 'next/router'
import { Card } from '../types/card'

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

export const useQueryCardId = (cards: Card[]): Card | null => {
  const router = useRouter()
  const [card, setCard] = useState<Card | null>(null)
  const { card: cardId } = router.query

  useEffect(() => {
    if (cardId != null && Array.isArray(cards)) {
      const card = cards.find((card) => card._id === cardId)
      if (card != null) setCard(card)
      else {
        const query: any = { ...router.query }
        delete query.card
        void router.push({ query }, undefined, { shallow: true })
      }
    } else if (cardId == null && card != null) setCard(null)
  }, [cardId, cards])

  return card
}

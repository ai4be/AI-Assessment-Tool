import { useEffect, useState, useRef, useMemo, RefObject } from 'react'
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

interface UseQueryCardIdReturnType {
  card: Card | null
  setCardQuery: (cardId: string, questionId?: string, commentId?: string) => Promise<void>
  unSetCardQuery: () => Promise<void>
}

export const useQueryCardId = (cards: Card[], cardSetCb?: Function, cardUnsetCb?: Function): UseQueryCardIdReturnType => {
  const router = useRouter()
  const [card, setCard] = useState<Card | null>(null)
  const { card: cardId } = router.query

  const setCardQuery = async (cardId: string, questionId?: string, commentId?: string): Promise<void> => {
    const query: any = { ...router.query }
    query.card = cardId
    if (questionId != null) query.question = questionId
    if (commentId != null) query.comment = commentId
    await router.push({ query }, undefined, { shallow: true })
  }

  const unSetCardQuery = async (): Promise<void> => {
    const query: any = { ...router.query }
    delete query.card
    delete query.question
    delete query.comment
    void router.push({ query }, undefined, { shallow: true })
  }

  useEffect(() => {
    if (cardId != null && Array.isArray(cards)) {
      const card = cards.find((card) => card._id === cardId)
      if (card != null) setCard(card)
      else void unSetCardQuery()
    } else if (cardId == null && card != null) setCard(null)
  }, [cardId, cards])

  useEffect(() => {
    if (card == null) {
      cardUnsetCb?.()
    } else {
      cardSetCb?.(card)
    }
  }, [card])

  return { card, setCardQuery, unSetCardQuery }
}

/**
 * Helps tracking the props changes made in a react functional component.
 *
 * Prints the name of the properties/states variables causing a render (or re-render).
 * For debugging purposes only.
 *
 * @usage You can simply track the props of the components like this:
 *  useRenderingTrace('MyComponent', props);
 *
 * @usage You can also track additional state like this:
 *  const [someState] = useState(null);
 *  useRenderingTrace('MyComponent', { ...props, someState });
 *
 * @param componentName Name of the component to display
 * @param propsAndStates
 * @param level
 *
 * @see https://stackoverflow.com/a/51082563/2391795
 */
export const useRenderingTrace = (componentName: string, propsAndStates: any, level: 'debug' | 'info' | 'log' = 'debug'): void => {
  const prev = useRef(propsAndStates)

  useEffect(() => {
    const changedProps: { [key: string]: { old: any, new: any } } = Object.entries(propsAndStates).reduce((property: any, [key, value]: [string, any]) => {
      if (prev.current[key] !== value) {
        property[key] = {
          old: prev.current[key],
          new: value
        }
      }
      return property
    }, {})

    if (Object.keys(changedProps).length > 0) {
      console[level](`[${componentName}] Changed props:`, changedProps)
    }

    prev.current = propsAndStates
  })
}

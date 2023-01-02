export function timeAgo (value: string | Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(value).getTime()) / 1000)
  let interval = seconds / 31536000
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  if (interval > 1) { return rtf.format(-Math.floor(interval), 'year') }
  interval = seconds / 2592000
  if (interval > 1) { return rtf.format(-Math.floor(interval), 'month') }
  interval = seconds / 86400
  if (interval > 1) { return rtf.format(-Math.floor(interval), 'day') }
  interval = seconds / 3600
  if (interval > 1) { return rtf.format(-Math.floor(interval), 'hour') }
  interval = seconds / 60
  if (interval > 1) { return rtf.format(-Math.floor(interval), 'minute') }
  return rtf.format(-Math.floor(interval), 'second')
}

export const isEmpty = (value: any): boolean => {
  return (
    value == null || // From standard.js: Always use === - but obj == null is allowed to check null || undefined
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  )
}

export const isEqual = (first: any, second: any): boolean => {
  if (first === second) {
    return true
  }
  if ((first == null || second == null) && (first != null || second != null)) {
    return false
  }
  const firstType = first?.constructor.name
  const secondType = second?.constructor.name
  if (firstType !== secondType) {
    return false
  }
  if (firstType === 'Array') {
    if (first.length !== second.length) {
      return false
    }
    let equal = true
    for (let i = 0; i < first.length; i++) {
      if (!isEqual(first[i], second[i])) {
        equal = false
        break
      }
    }
    return equal
  }
  if (firstType === 'Object') {
    let equal = true
    const fKeys = Object.keys(first)
    const sKeys = Object.keys(second)
    if (fKeys.length !== sKeys.length) {
      return false
    }
    for (let i = 0; i < fKeys.length; i++) {
      if (first[fKeys[i]] && second[fKeys[i]]) {
        if (first[fKeys[i]] === second[fKeys[i]]) {
          continue; // eslint-disable-line
        }
        if (first[fKeys[i]] && (first[fKeys[i]].constructor.name === 'Array'
          || first[fKeys[i]].constructor.name === 'Object')) {
          equal = isEqual(first[fKeys[i]], second[fKeys[i]])
          if (!equal) {
            break
          }
        } else if (first[fKeys[i]] !== second[fKeys[i]]) {
          equal = false
          break
        }
      } else if ((first[fKeys[i]] && !second[fKeys[i]]) || (!first[fKeys[i]] && second[fKeys[i]])) {
        equal = false
        break
      }
    }
    return equal
  }
  return first === second
}

export function randomIntFromInterval (min: number, max: number): number { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// WARNING: This is not a drop in replacement solution and
// it might not work for some edge cases. Test your code!
export const debounce = (func: Function, delay: number, { leading }: { leading?: boolean } = {}): Function => {
  let timerId

  return (...args: any[]) => {
    if (!timerId && leading) {
      func(...args)
    }
    clearTimeout(timerId)

    timerId = setTimeout(() => func(...args), delay)
  }
}

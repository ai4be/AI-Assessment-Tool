export const fetcher = async (url: string): Promise<any> => await fetch(url).then(async r => await r.json())

export const defaultFetchOptions: any = {
  method: 'GET',
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json'
  },
  redirect: 'follow',
  referrerPolicy: 'no-referrer'
}

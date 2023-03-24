import {
  Status
} from '@chakra-ui/react'

export const fetcher = async (url: string, options?: any): Promise<any> => await fetch(url).then(async r => await r.json())

export enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export const defaultFetchOptions: any = {
  method: HTTP_METHODS.GET,
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json'
  },
  redirect: 'follow',
  referrerPolicy: 'no-referrer'
}

export const getResponseHandler = (showToast: Function): (response: Response, defaultSuccesMsg?: string, defaultErrMsg?: string) => Promise<void> => {
  return async (response: Response, defaultSuccesMsg = '', defaultErrMsg: string = 'Something went wrong'): Promise<void> => {
    let msg = defaultSuccesMsg
    let status: Status = 'success'
    if (!response.ok) {
      msg = defaultErrMsg
      status = 'error'
    }
    try {
      const result = await response.json()
      msg = String(result?.message ?? msg)
    } catch (error) {}
    showToast({
      title: msg,
      status
    })
  }
}

export const getResponseHandlerCustomMessage = (showToast: Function): (response: Response, customMsg: String, defaultSuccesMsg?: string, defaultErrMsg?: string) => Promise<void> => {
  return async (response: Response,  customMsg: String, defaultSuccesMsg = '', defaultErrMsg: string = 'Something went wrong'): Promise<void> => {
    let msg = defaultSuccesMsg
    let status: Status = 'success'
    if (!response.ok) {
      msg = defaultErrMsg
      status = 'error'
    }    
    showToast({
      title: customMsg,
      status
    })
  }
}
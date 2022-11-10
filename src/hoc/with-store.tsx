import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { setOrGetStore } from '@/util/initialise-store'
import { RootState } from '@/src/store'

interface Props {
  reduxState: RootState
}

const WithStore = (App) => {
  class AppWithStore extends Component<Props> {
    static async getInitialProps (ctx): Promise<any> {
      let appProps = {}
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx)
      }

      return {
        ...appProps,
        reduxState: ctx.reduxState || setOrGetStore().getState()
      }
    }

    render () {
      return (
        <Provider store={setOrGetStore(this.props.reduxState)}>
          <App />
        </Provider>
      )
    }
  }

  return AppWithStore
}

export default WithStore

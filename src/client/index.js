import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'

import createAppStore from 'client/store'
import App from 'client/components/app'

const initialState = window.__INITIAL_STATE__
delete window.__INITIAL_STATE__
const store = createAppStore(initialState)

window.onload = () => {
  ReactDOM.hydrate(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}
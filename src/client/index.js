import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'

import store from 'store'
import App from 'components/app'

const initialState = window.__INITIAL_STATE__
delete window.__INITIAL_STATE__
const store_ = store(initialState)

window.onload = () => {
  ReactDOM.hydrate(
    <Provider store={store_}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}
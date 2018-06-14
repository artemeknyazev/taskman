import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'

import { clearSelection } from 'client/reducers'
import configureStore from 'client/store'
import App from 'client/components/app'

const initialState = window.__INITIAL_STATE__
delete window.__INITIAL_STATE__
const store = configureStore(initialState)

window.onload = () => {
  ReactDOM.hydrate(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}
// TODO: think about a better way to deselect when clicking outside the list
window.onclick = () =>
  store.dispatch(clearSelection())
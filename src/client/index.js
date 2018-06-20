import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'

import { configureStore } from 'client/store'
import App from 'client/components/app'
import './index.scss'

const history = createBrowserHistory()
const initialState = window.__INITIAL_STATE__
delete window.__INITIAL_STATE__
const store = configureStore(history, initialState)

window.onload = () => {
  ReactDOM.hydrate(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  )
}
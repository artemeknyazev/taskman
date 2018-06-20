import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import configureStore from 'client/store'
import App from 'client/components/app'
import './index.scss'

const initialState = window.__INITIAL_STATE__
delete window.__INITIAL_STATE__
const store = configureStore(initialState)

window.onload = () => {
  ReactDOM.hydrate(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    document.getElementById('root')
  )
}
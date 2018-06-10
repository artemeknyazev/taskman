import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import reducer from 'reducers'

export default (initialState = undefined) =>
  createStore(
    reducer,
    initialState,
    applyMiddleware(logger)
  )
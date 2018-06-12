import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from 'client/reducers'

let middlewares = [ thunk ]
if (IS_DEVELOPMENT) {
  if (IS_CLIENT)
    middlewares.push(logger)
}

export default (initialState = undefined) =>
  createStore(
    reducer,
    initialState,
    applyMiddleware(...middlewares),
  )
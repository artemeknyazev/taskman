import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from 'client/reducers'

export const configureStore = (
  history,
  initialState,
) => {
  let middlewares = [
    routerMiddleware(history),
    thunk,
  ]
  if (IS_DEVELOPMENT) {
    if (IS_CLIENT)
      middlewares.push(logger)
  }

  return createStore(
    connectRouter(history)(reducer),
    initialState,
    applyMiddleware(...middlewares),
  )
}
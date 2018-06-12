import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import createAppStore from 'client/store'
import App from 'client/components/app'

import routes from 'server/routes'
import indexHtml from './index-html'

const port = process.env.PORT || 8080

// TODO: add global and api error handling
let app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, 'public')))
app.use('/', routes)

app.get('*', (req, res) => {
  const title = "Taskman"
  const store = createAppStore()
  const initialState = JSON.stringify(store.getState())
  const content = renderToString(
    <Provider store={store}>
      <App />
    </Provider>,
  )
  res.send(indexHtml({ title, content, initialState }))
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
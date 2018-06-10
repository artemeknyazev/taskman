import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import store from './../client/store'
import App from './../client/components/app'

import routes from 'routes'
import indexHtml from './index.html.js'

const port = process.env.PORT || 8080

// TODO: add global and api error handling
let app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, 'public')))
app.use('/', routes)

app.get('*', (req, res) => {
  const title = "Test"
  const store_ = store()
  const initialState = JSON.stringify(store_.getState())
  const content = renderToString(
    <Provider store={store_}>
      <App />
    </Provider>,
  )
  res.send(indexHtml({ title, content, initialState }))
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
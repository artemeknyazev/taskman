import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import { domain, port } from 'server/common'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import { configureStore } from 'client/store'
import { appInit } from 'client/reducers'
import App from 'client/components/app'

import routes from 'server/routes'
import indexHtml from './index-html'

// TODO: add global and api error handling
let app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, 'public')))
app.use('*', (req, res, next) => {
  if (IS_DEVELOPMENT && IS_SERVER) {
    console.log('--> Request: ' + req.method + ' ' + req.originalUrl)
    console.log('    Date:    ' + new Date().toString())
    if ([ 'POST', 'PUT' ].includes(req.method))
      console.log('    Body:    ' + JSON.stringify(req.body))
  }
  next()
})
app.use('/', routes)

app.get('*', (req, res) => {
  const history = createMemoryHistory({
    initialEntries: [req.url]
  })
  const store = configureStore(history)
  const context = {}
  const markup = (
    <Provider store={store}>
      <StaticRouter
        location={req.url}
        context={context}
      >
        <App />
      </StaticRouter>
    </Provider>
  )
  store.dispatch(
    appInit()
  ).then(() => {
    const content = renderToString(markup)
    if (context.url) {
      res.redirect(301, context.url)
    } else {
      res.send(indexHtml({
        title: 'Taskman',
        content,
        initialState: store.getState(),
        domain,
        port,
      }))
    }
  })
})

const server = app.listen(port, () => {
  const { address, port } = server.address()
  console.log(`Server is listening on ${address}:${port}`)
})

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
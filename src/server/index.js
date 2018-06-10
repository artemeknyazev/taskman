import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import routes from 'routes'
const port = process.env.PORT || 8080

// TODO: add global and api error handling
let app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, 'public')))
app.use('/', routes)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'))
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
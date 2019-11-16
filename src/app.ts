import bodyParser from 'body-parser'
import express from 'express'
import helmet from 'helmet'
import http from 'http'

import config from './env'
import * as bouncer from './middlewares/bouncer'
import UserRouter from './routes/user_router'

// Create Express server
const app: express.Application = express()

app.set('port', config.port || 3014)
app.set('secret', config.secret || 'StupidSecret')

// Configure expres middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())
app.use(bouncer.check)

// Initialize routes
app.use('/v1/api/users', UserRouter)

app.use((req, res, next) => {
  res.status(404).send(http.STATUS_CODES[404])
})

export default app
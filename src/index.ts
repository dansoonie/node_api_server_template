import * as http from 'http'
import debug from 'debug'
import { AddressInfo } from 'net'
import App from './app'

const server: http.Server = http.createServer(App)

/**
 * Binds and listens for connections on the specified host
 */
server.listen(App.get('port'))

/**
 * Server Events
 */
server.on('error', (err: Error) => {
  const port = App.get('port')
  const error = err as NodeJS.ErrnoException
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind: string = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port}`
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)

      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)

      break
    default:
      throw error
  }
})

server.on('listening', (): void => {
  const addr: AddressInfo | string | null = server.address()
  if (addr) {
    const bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`
    debug(`Listening on ${bind}`)
  }
})

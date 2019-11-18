import http from 'http'
import { Request, Response, NextFunction } from 'express'

/**
 * AppError wraps plain Error object with some additional information.
 * Additional information consists of a message to send to api caller.
 *
 * The errorHandler is used as the app's error handling middleware.
 * When an error occurs the error handler must recieve the error.
 * If not there is a problem and must be fixed.
 *
 * An error is handled in the following manner.
 * If the error is not originated from
 *
 */


/**
 * @export
 * @class AppError
 * @extends {Error}
 */
export class AppError extends Error {
  status: number
  message: string

  /**
   * Creates an instance of AppError.
   * @param {number} [status] status code to send in the response for api caller
   * @param {string} [message] message to send in the response for api caller
   * @param {Error} [err] original error object
   * @memberof AppError
   */
  constructor(status: number, message?: string, err?: Error) {
    super(message)
    this.status = status
    this.message = message || http.STATUS_CODES[this.status] || 'Error'
    if (err) {
      // User stack trace of original error's stack trace
      this.stack = err.stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export const errorHandler = function(err: Error, req: Request, res: Response, next: NextFunction) {
  const appError = err instanceof AppError? err : new AppError(500, 'Unknown error occurred', err)
  const status = appError.status
  const description = http.STATUS_CODES[status]
  const msg = appError.message
  res.status(status).json({
    description, msg
  })
  // TODO: Log more information on error
  console.error('Error ---->')
  console.error(` * API PATH: ${req.path}`)
  console.error(` * HEADERS:`)
  console.error(req.headers)
  if (req.path === '/api/v1/users/signup') {
    req.body.password = req.body.password.replace(/./g, '*')
  }
  console.error(` * BODY:`)
  console.error(req.body)
  console.error(` * MESSAGE: ${appError.message}`)
  console.error(appError)
  console.error('<----')

}
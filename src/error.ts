import http from 'http'
import { Request, Response, NextFunction } from 'express'

/**
 * @export
 * @class JsonError
 * @extends {Error}
 */
export class AppError extends Error {
  status: number
  msg: string
  
  /**
   * Creates an instance of HttpError.
   * @param {number} [status]
   * @param {string} [message]
   * @memberof JsonError
   */
  constructor(status: number, message?: string) {
    super(message)

    Error.captureStackTrace(this, this.constructor)

    this.status = status    
    this.msg = message || http.STATUS_CODES[this.status] || 'Error'
  }
}

export const errorHandler = function(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack)
  const status = err instanceof AppError? err.status : 500
  const description = http.STATUS_CODES[status]
  const msg = err instanceof AppError? err.msg : 'Unknown error occurred'  
  res.status(status).json({    
    description, msg
  })
}
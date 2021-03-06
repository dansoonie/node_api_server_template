import * as jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import app from '../app'
import { AppError } from '../error'

/**
 *
 * @param {RequestWithUser} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 * @swagger
 *  components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-access-token
 */
export function check(req: Request, res: Response, next: NextFunction): void {
  const authorization: any = req.headers['authorization']

  if (authorization) {
    const token: string = authorization.split(' ')[1]
    if (token) {
      try {
        const user: object | string = jwt.verify(token, app.get('secret'))
        req.user = user
        return next()
      } catch (err) {
        // jsonwebtoken verify errors
        // https://www.npmjs.com/package/jsonwebtoken#errors--codes
        if (err instanceof jwt.TokenExpiredError) {
          next(new AppError(401, 'Token expired'))          
        } else if (err instanceof jwt.JsonWebTokenError ||
                   err instanceof jwt.NotBeforeError) {
          next(new AppError(401, 'Invalid token'))
        } else {
          next(new AppError(500, 'Unknown error occurred while validating token', err, false))
        }
      }
    }
  } else {
    next(new AppError(401, 'No token provided'))    
  }
}
jwt.TokenExpiredError

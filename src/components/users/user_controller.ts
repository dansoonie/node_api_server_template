import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import UserService from './user_service'
import { AppError } from '../../error'
import app from '../../app'

export const UserController = {
  /**
   * @export
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   */
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { origin, originId, password } = req.body
      // TODO: Do better check on signup parameters
      if (origin === undefined || originId === undefined || password === undefined) {
        // Bad Request
        return next(new AppError(400, 'Missing or invalid signup information'))
      }
      const user = await UserService.findByOriginId(origin, originId)
      if (user) {
        // Conflict
        return next(new AppError(409, 'Already a user with signup information'))
      } else {
        await UserService.createUser(origin, originId, password)
        // Ok
        res.status(200).json({
          msg: 'Sign up successful'
        })
      }
    } catch (err) {
      next(new AppError(500, 'Unknown error occurred during signup'))
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { origin, originId, password } = req.body
      if (origin === undefined || originId === undefined || password === undefined) {
        // Bad Request
        return next(new AppError(400, 'Missing or invalid signup information'))
      }
      const user = await UserService.findByOriginId(origin, originId)
      if (user) {
        const token: string = jwt.sign({
          origin,
          originId,
        }, app.get('secret'), {
          expiresIn: '60m'
        })
        return res.status(200).json({
          origin,
          originId,
          token,
          msg: 'Successfully logged in'
        })
      } else {
        next(new AppError(400, 'Unknown user'))
      }
    } catch (err) {
      next(new AppError(500, 'Unknown error occurred during login'))
    }
  },

  logout(req: Request, res: Response, next: NextFunction) {

  }
}


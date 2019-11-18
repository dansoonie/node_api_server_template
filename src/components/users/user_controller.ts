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
        next(new AppError(400, 'Missing or invalid signup information'))
        return
      }

      const user = await UserService.findByOriginId(origin, originId)
      if (user) {
        // Conflict
        next(new AppError(409, 'Already a user with requested signup information'))
      } else {
        await UserService.createUser(origin, originId, password)
        // Ok
        res.status(200).json({
          msg: 'Sign up successful'
        })
      }
    } catch (err) {
      next(AppError.wrap(500, 'Uknown error occurred during signup', err))
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { origin, originId, password } = req.body
      if (origin === undefined || originId === undefined || password === undefined) {
        // Bad Request
        return next(new AppError(400, 'Missing or invalid signup infromation'))
      }

      const user = await UserService.findByOriginId(origin, originId)
      if (!user) {
        return next(new AppError(400, 'Unknown user'))
      }

      if (await UserService.verifyUser(user, password)) {
        const token: string = jwt.sign({
          origin,
          originId,
        }, app.get('secret'), {
          expiresIn: '60m'
        })
        res.status(200).json({
          origin,
          originId,
          token,
          msg: 'Successfully logged in'
        })
      } else {
        next(new AppError(401, 'Incorrect login information'))
      }
    } catch (err) {
      next(AppError.wrap(500, 'Unknown error occurred during login', err))
    }
  },

  logout(req: Request, res: Response, next: NextFunction) {

  }
}


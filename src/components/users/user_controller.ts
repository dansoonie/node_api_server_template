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
      throw new Error('test')
      const { origin, originId, password } = req.body
      // TODO: Do better check on signup parameters
      if (origin === undefined || originId === undefined || password === undefined) {
        // Bad Request
        res.status(400).json({
          msg: 'Missing or invalid signup information'
        })
        return
      }

      const user = await UserService.findByOriginId(origin, originId)
      if (user) {
        // Conflict
        res.status(409).json({
          msg: 'Already a user with signup information'
        })
      } else {
        await UserService.createUser(origin, originId, password)
        // Ok
        res.status(200).json({
          msg: 'Sign up successful'
        })
      }
    } catch (err) {
      next(new AppError(500, 'Uknown error occurred during signup', err))
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { origin, originId, password } = req.body
      if (origin === undefined || originId === undefined || password === undefined) {
        // Bad Request
        res.status(400).json({
          msg: 'Missing or invalid signup information'
        })
        return
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
        res.status(400).json({
          msg: 'Unknown user'
        })
      }
    } catch (err) {
      next(new AppError(500, 'Unknown error occurred during login'))
    }
  },

  logout(req: Request, res: Response, next: NextFunction) {

  }
}


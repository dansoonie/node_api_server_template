import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import UserService from './user_service'
import { AppError } from '../../error'
import { IUserModel } from './user_model'


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
        return next(new AppError(404, 'User not found'))
      }

      if (await UserService.verifyUser(user, password)) {
        const token = UserService.issueToken(user)
        res.status(200).json({
          _id: user._id.toString(),
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

  },

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userObjectId = req.params._id
      const currentUser = req.user as IUserModel
      // User can only see their own user information
      if (currentUser._id !== userObjectId) {
        next(new AppError(401, 'Not authorized'))
        return
      }
      const user: IUserModel | null = await UserService.findByObjectId(userObjectId)
      if (user) {
        return res.status(200).json({
          origin: user.origin,
          originId: user.originId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        })
      } else {
        next(new AppError(404, 'User not found'))
      }
    } catch (err) {
      next(AppError.wrap(500, 'Unknown error occurred while getting user information', err))
    }
  }
}


import UserService from './user_service'
import HttpError from '../../http_error'

import { NextFunction, Request, Response } from 'express'

export const UserController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { origin, originId, password } = req.body
      await UserService.createUser(origin, originId, password)
      res.status(200).json({
        msg: 'Sign up successful'
      })
    } catch (err) {
      if (err.code === 500) {
        return next(new HttpError(err.message.status, err.message));
      }
      res.status(400).json({    
        msg: err.message
      });
    }
  },

  login(req: Request, res: Response, next: NextFunction) {

  },

  logout(req: Request, res: Response, next: NextFunction) {

  }
}


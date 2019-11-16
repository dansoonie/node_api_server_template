import UserModel, { IUserModel } from './user_model'
import { Types } from 'mongoose'
import { createSecureServer } from 'http2'

interface IUserService {
  createUser(origin: string, originId: string, password: string): Promise<IUserModel | null>
  findByObjectId(_id: string | Types.ObjectId): Promise<IUserModel | null>
  findByOriginId(origin: string, originId: string) : Promise<IUserModel | null>
}

const UserService: IUserService = {
  async createUser(origin: string, originId: string, password: string): Promise<IUserModel | null> {
    try {
      const userInfo: IUserModel = new UserModel({
        origin,
        originId,
        verifiedEmail: false
      })
      switch (origin) {
        case 'native':
          userInfo.password = password
          userInfo.email = originId
          break
      }
      const user: IUserModel | null = await UserModel.create(userInfo)
      return user
    } catch (err) {
      throw new Error(err)
    }
  },

  async findByObjectId(_id: string | Types.ObjectId): Promise<IUserModel | null> {
    try {
      const user: IUserModel | null = await UserModel.findById(_id)
      return user
    } catch (err) {
      throw new Error(err)
    }
  },

  async findByOriginId(origin: string, originId: string): Promise<IUserModel | null> {
    try {
      const user: IUserModel | null = await UserModel.findOne({
        origin,
        originId
      })
      return user
    } catch (err) {
      throw new Error(err)
    }
  }
}

export default UserService
import UserModel, { IUserModel } from './user_model'
import { Types } from 'mongoose'
import { AppError } from '../../error'

interface IUserService {
  createUser(origin: string, originId: string, password: string): Promise<IUserModel | null>
  verifyUser(user: IUserModel, password: string): Promise<boolean>
  findByObjectId(_id: string | Types.ObjectId): Promise<IUserModel | null>
  findByOriginId(origin: string, originId: string) : Promise<IUserModel | null>
}

const UserService: IUserService = {

  async createUser(origin: string, originId: string, password: string): Promise<IUserModel | null> {
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
      case 'facebook':
        // Not imiplemented
        throw new AppError(501, 'Signup through social login not supported at the moment')
      default:
        // Bad request
        throw new AppError(400, 'Signup origin invalid')
    }
    const user: IUserModel | null = await UserModel.create(userInfo)
    return user
  },

  /**
   * @param {IUserModel} [user] user information
   * @param {string} [password]
   * @returns {Promise <boolean>}
   * @memberof UserService
   */
  verifyUser(user: IUserModel, password: string): Promise<boolean> {
    if (user) {
      if (user.origin === 'native') {
        return user.comparePassword(password)
      } else {
        throw new AppError(501, 'Users signed up with social login cannot be verified at the moment')
      }
    } else {
      return Promise.resolve(false)
    }
  },

  async findByObjectId(_id: string | Types.ObjectId): Promise<IUserModel | null> {
    const user: IUserModel | null = await UserModel.findById(_id)
    return user
  },

  async findByOriginId(origin: string, originId: string): Promise<IUserModel | null> {
    const user: IUserModel | null = await UserModel.findOne({
      origin,
      originId
    })
    return user
  }
}

export default UserService
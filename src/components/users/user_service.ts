import UserModel, { IUserModel } from './user_model'
import { Types } from 'mongoose'
import { createSecureServer } from 'http2'

interface IUserService {
  createUser(origin: string, originId: string, password: string): Promise<IUserModel | null>
  loginUser(origin: string, originId: string, password: string): Promise<IUserModel | null>
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

  /**
   * @param {string} origin
   * @param {string} originId
   * @param {string} password
   * @returns {Promise <IUserModel | null>}
   * @memberof UserService
   */
  async loginUser(origin: string, originId: string, password: string): Promise<IUserModel | null> {
    try {
      const validate: Joi.ValidationResult<IUserModel> = AuthValidation.getUser(body);

      if (validate.error) {
        throw new Error(validate.error.message);
      }

      const user: IUserModel | null = await UserModel.findOne({
        email: body.email
      });

      const isMatched: boolean = user !== null && await user.comparePassword(body.password);

      if (isMatched) {
        return user;
      }

      throw new Error('Invalid password or email');

    } catch (error) {
      throw new Error(error);
    }
  }

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
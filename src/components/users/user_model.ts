import * as bcrypt from 'bcrypt'
import * as connections from '../../connection'
import { Document, Schema } from 'mongoose'
import { NextFunction } from 'express'

/**
 * Native user signup
 * - on post request: send body as
 *   { origin: 'native', originId: <email_address>, password: <user_password> }
 *
 * - handle request: insert following to db
 *   { origin: 'native', originId: <email_address>, password: <user_password>, email: <email_address>, emailVerified: false  }
 *
 * - wait for email verification
 *
 * - allow login after email verified
 *
 * Social login signup
 * - on post request: send body as
 *   { origin: <social_login_service>, originId: <social_login_id>, accessToken: <social_login_access_token }
 *
 * - handle request: check validity of access token and insert following to db
 *   { origin: <social_login_service>, originId: <social_login_id> }
 */

/**
 * @export
 * @interface IUserModel
 * @extends {Document}
 */
export interface IUserModel extends Document {
  // Essentials
  _id: string
  origin: string      // native(this server), facebook, twitter, kakao, etc.
  originId: string    // id from account origin
  password?: string
  // primary information
  firstName?: string
  lastName?: string
  email?: string
  verifiedEmail: boolean
  comparePassword: (password: string) => Promise<boolean>
}

export type AuthToken = {
  accessToken: string,
  kind: string
}

const UserSchema: Schema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  origin: {
    type: String,
    required: true,
    default: 'native'
  },
  originId: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  verifiedEmail: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  collection: 'users',
  versionKey: false
}).pre('save', async function (next: NextFunction): Promise<void> {
  const user: any = this // tslint:disable-line

  if (!user.isModified('password')) {
    return next()
  }

  try {
    const salt: string = await bcrypt.genSalt(10)
    const hash: string = await bcrypt.hash(user.password, salt)
    user.password = hash
    next()
  } catch (error) {
    return next(error)
  }
})

/**
 * Method for comparing passwords
 */
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    const match: boolean = await bcrypt.compare(candidatePassword, this.password)
    return match
  } catch (error) {
    return error
  }
}

UserSchema.index({
  origin: 1,
  originId: 1
}, {
  unique: true
})

export default connections.db.model<IUserModel>('UserModel', UserSchema)

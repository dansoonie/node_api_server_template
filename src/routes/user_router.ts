import { Router } from 'express'

import { UserController } from '../components/users/user_controller'
const router: Router = Router()

/**
 * POST method route
 * @example http://localhost:PORT/api/v1/users/signup
 * @swagger
 * /api/v1/users/signup:
 *  post:
 *    description: sign up user
 *    tags: ["users"]
 *    requestBody:
 *      description: sign up body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserSchema'
 *          example:
 *            origin: 'native'
 *            originId: 'test.user@mail.com'
 *            password: 'password'
 *    responses:
 *      200:
 *        description: user successfuly signed up
 *        content:
 *          appication/json:
 *            example:
 *              status: 200
 *              msg: 'Successfully signed up user'
 *      409:
 *        description: Signup information already exists
 *        content:
 *          application/json:
 *            example:
 *              status: 409 
 *              msg: 'Already a user with signup information'
 *      400:
 *        description: Signup information missing
 *        content:
 *          application/json:
 *            example:
 *              status: 400
 *              msg: 'Missing or invalid signup information'
 */
router.post('/signup', UserController.signup)

/**
 * POST method route
 * @example http://localhost:PORT/api/v1/users/login
 * @swagger
 * /api/v1/users/login:
 *  post:
 *    description: Login user
 *    tags: ["users"]
 *    requestBody:
 *      description: Login body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserSchema'
 *          example:
 *            origin: 'native'
 *            originId: 'test.user@mail.com'
 *            password: 'password'
 *    responses:
 *      200:
 *        description: user successfuly signed up
 *        content:
 *          appication/json:
 *            example:
 *              status: 200
 *              msg: 'Successfully signed up user'
 *      409:
 *        description: Signup information already exists
 *        content:
 *          application/json:
 *            example:
 *              status: 409 
 *              msg: 'Already a user with signup information'
 *      400:
 *        description: Signup information missing
 *        content:
 *          application/json:
 *            example:
 *              status: 400
 *              msg: 'Missing or invalid signup information'
 */
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
export default router
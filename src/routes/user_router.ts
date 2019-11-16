import { Router } from 'express'

import { UserController } from '../components/users/user_controller'
const router: Router = Router()

router.post('/signup', UserController.signup)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
export default router
import Router from 'express'
import UserController from '../controllers/userController.js'
import authMiddleware from '../middlewares/checkAuth.js'
import checkAuth from "../middlewares/checkAuth.js"
import checkRole from "../middlewares/checkRole.js"

const router = new Router()

router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.post('/logout', checkAuth, UserController.logout)
router.get('/refresh', UserController.refresh)
router.get('/users', checkRole, UserController.getUsers)
router.get('/:id', UserController.getOne)
router.put('/changeRole/:id', checkRole, UserController.changeRole)

export default router


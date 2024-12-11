import Router from 'express'
import UserController from '../controllers/userController.js'
import authMiddleware from '../middlewares/checkAuth.js'

const router = new Router()

router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.get('/refresh', UserController.refresh)
router.get('/users', authMiddleware, UserController.getUsers)
router.get('/:id', UserController.getOne)
router.put('/changeRole/:id', UserController.changeRole)

export default router


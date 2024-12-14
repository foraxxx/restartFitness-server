import Router from 'express'
import UserMembershipsController from '../controllers/userMembershipsController.js'
import checkAuth from "../middlewares/checkAuth.js"

const router = Router()

router.post('/:id', checkAuth, UserMembershipsController.create)
router.get('/', checkAuth, UserMembershipsController.getAllUserMemberships)

export default router
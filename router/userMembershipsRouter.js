import Router from 'express'
import UserMembershipsController from '../controllers/userMembershipsController.js'

const router = Router()

router.post('/:id', UserMembershipsController.create)

export default router
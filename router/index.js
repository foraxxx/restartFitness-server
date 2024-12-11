import Router from 'express'
import userRouter from './userRouter.js'
import roleRouter from './roleRouter.js'
import membershipRouter from "./membershipRouter.js"
import trainerRouter from "./trainerRouter.js"


const router = new Router()

router.use('/user', userRouter)
router.use('/role', roleRouter)
router.use('/memberships', membershipRouter)
router.use('/trainers', trainerRouter)

export default router
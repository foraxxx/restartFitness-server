import Router from 'express'
import userRouter from './userRouter.js'
import roleRouter from './roleRouter.js'
import membershipRouter from "./membershipRouter.js"

const router = new Router()

router.use('/user', userRouter)
router.use('/role', roleRouter)
router.use('/memberships', membershipRouter)

export default router
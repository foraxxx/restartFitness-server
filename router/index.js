import Router from 'express'
import userRouter from './userRouter.js'
import roleRouter from './roleRouter.js'

const router = new Router()

router.use('/user', userRouter)
router.use('/role', roleRouter)

export default router
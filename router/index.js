import Router from 'express'
import userRouter from './userRouter.js'
import roleRouter from './roleRouter.js'
import membershipRouter from "./membershipRouter.js"
import trainerRouter from "./trainerRouter.js"
import userMembershipsRouter from "./userMembershipsRouter.js"
import reviewsRouter from "./reviewsRouter.js"
import checkAuth from "../middlewares/checkAuth.js"

const router = new Router()

router.use('/user', userRouter)
router.use('/role', roleRouter)
router.use('/memberships', membershipRouter)
router.use('/usermemberships', checkAuth, userMembershipsRouter)
router.use('/trainers', trainerRouter)
router.use('/reviews', reviewsRouter)

export default router
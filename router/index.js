import Router from 'express'
import userRouter from './userRouter.js'
import roleRouter from './roleRouter.js'
import membershipRouter from "./membershipRouter.js"
import trainerRouter from "./trainerRouter.js"
import userMembershipsRouter from "./userMembershipsRouter.js"
import reviewsRouter from "./reviewsRouter.js"
import checkAuth from "../middlewares/checkAuth.js"
import newsRouter from "./newsRouter.js"
import paymentRouter from "./paymentRouter.js"
import visitRouter from "./visitRouter.js"
import statusRouter from "./statusRouter.js"
import typesRouter from "./typesRouter.js"
import analyticRouter from "./analyticRouter.js"

const router = new Router()

router.use('/user', userRouter)
router.use('/role', roleRouter)
router.use('/memberships', membershipRouter)
router.use('/usermemberships', checkAuth, userMembershipsRouter)
router.use('/trainers', trainerRouter)
router.use('/reviews', reviewsRouter)
router.use('/news', newsRouter)
router.use('/payments', checkAuth, paymentRouter)
router.use('/visit', checkAuth, visitRouter)
router.use('/reviews', checkAuth, reviewsRouter)
router.use('/statuses', statusRouter)
router.use('/types', typesRouter)
router.use('/analytic', analyticRouter)

export default router
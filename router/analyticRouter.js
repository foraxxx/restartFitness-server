import Router from 'express'
import analyticController from "../controllers/analyticsController.js"
import checkRole from "../middlewares/checkRole.js"

const router = Router()

router.get('/', analyticController.getDashboardData);

export default router
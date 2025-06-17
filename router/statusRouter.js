import Router from 'express'
import checkRole from "../middlewares/checkRole.js"
import statusController from "../controllers/statusController.js"

const router = Router()

router.get('/memberships', statusController.getAllForMemberships)

export default router
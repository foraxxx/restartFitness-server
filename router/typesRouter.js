import Router from 'express'
import checkRole from "../middlewares/checkRole.js"
import typesController from "../controllers/typesController.js"

const router = Router()

router.get('/all', typesController.getAllForMemberships)

export default router
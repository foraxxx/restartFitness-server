import Router from 'express'
import reviewsController from "../controllers/reviewsController.js"
import checkAuth from "../middlewares/checkAuth.js"

const router = Router()

router.get('/', reviewsController.getAll)
router.post('/', checkAuth, reviewsController.create)

export default router
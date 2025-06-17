import Router from 'express'
import reviewsController from "../controllers/reviewsController.js"
import checkAuth from "../middlewares/checkAuth.js"

const router = Router()

router.get('/', reviewsController.getAll)
router.post('/', checkAuth, reviewsController.create)
router.put('/:id', checkAuth, reviewsController.update);
router.delete('/:id', checkAuth, reviewsController.delete);

export default router
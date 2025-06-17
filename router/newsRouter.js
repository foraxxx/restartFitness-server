import Router from 'express'
import newsController from "../controllers/newsController.js"
import checkRole from "../middlewares/checkRole.js"

const router = Router()

router.get('/:status', newsController.getByStatus);
router.post('/', newsController.create)
router.put('/:id', newsController.update);
router.delete('/:id', newsController.delete);

export default router
import Router from 'express'
import roleController from "../controllers/roleController.js"
import checkRole from "../middlewares/checkRole.js"

const router = Router()

router.post('/', checkRole, roleController.create)
router.get('/', checkRole, roleController.getAll)
router.delete('/:id', checkRole, roleController.delete)

export default router
import Router from 'express'
import roleController from "../controllers/roleController.js"

const router = Router()

router.post('/', roleController.create)
router.get('/', roleController.getAll)
router.delete('/:id', roleController.delete)

export default router
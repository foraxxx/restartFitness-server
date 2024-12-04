import Router from 'express'
import roleController from "../controllers/roleController.js"

const router = Router()

router.post('/', roleController.create)
router.get('/', roleController.getAllRoles)
router.delete('/:id', roleController.delete)

export default router
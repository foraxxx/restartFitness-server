import Router from 'express'
import membershipController from "../controllers/membershipController.js"

const router = Router()

router.get('/', membershipController.getAll)
router.get('/:id', membershipController.getOne)
router.post('/', membershipController.createOne)
router.put('/:id', membershipController.updateOne)
router.delete('/:id', membershipController.deleteOne)

export default router
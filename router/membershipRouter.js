import Router from 'express'
import membershipController from "../controllers/membershipController.js"
import checkRole from "../middlewares/checkRole.js"

const router = Router()

router.get('/', membershipController.getAll)
router.get('/active', membershipController.getAllActive)
router.get('/:id', membershipController.getOne)
router.post('/', checkRole, membershipController.createOne)
router.put('/:id', checkRole, membershipController.updateOne)
router.delete('/:id', checkRole, membershipController.deleteOne)

export default router
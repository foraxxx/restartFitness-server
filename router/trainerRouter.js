import Router from 'express'
import TrainerController from "../controllers/trainerController.js"
import checkRole from "../middlewares/checkRole.js"

const router = Router()

router.get('/', TrainerController.getAll)
router.get('/:id', TrainerController.getOne)
router.post('/', checkRole, TrainerController.createOne)

export default router
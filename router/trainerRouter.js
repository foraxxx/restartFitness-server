import Router from 'express'
import TrainerController from "../controllers/trainerController.js"

const router = Router()

router.get('/', TrainerController.getAll)
router.get('/:id', TrainerController.getOne)
router.post('/', TrainerController.createOne)

export default router
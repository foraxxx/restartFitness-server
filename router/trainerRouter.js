import Router from 'express'

const router = Router()

router.get('/', TrainerController.getAll)
router.get('/:id', TrainerController.getOne)
router.post('/', TrainerController.createOne)

export default router
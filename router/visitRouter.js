import Router from 'express'
import VisitController from '../controllers/visitController.js'


const router = new Router()

router.post('/create', VisitController.create)


export default router


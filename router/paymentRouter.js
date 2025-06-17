import Router from 'express'
import paymentController from "../controllers/paymentController.js"
import checkRole from "../middlewares/checkRole.js"
import checkAuth from "../middlewares/checkAuth.js"
import express from "express"

const router = Router()

router.post('/create', paymentController.create)
// router.post('/notification', express.raw({ type: 'application/json' }), paymentController.webhook);
// router.post('/notification', paymentController.webhook);,


export default router
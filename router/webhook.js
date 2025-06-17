import express from "express";
import paymentController from "../controllers/paymentController.js";

const router = express.Router();

router.post('/', express.raw({ type: 'application/json' }), paymentController.webhook);

export default router;
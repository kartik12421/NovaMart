import { Router } from "express";
import { createCheckout } from "../../../../../novamart/northwind-store/backend/src/controllers/checkoutController.js";

const router = Router();

router.post("/", createCheckout);

export default router;

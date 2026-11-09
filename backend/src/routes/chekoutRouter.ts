import { Router } from "express";
import { confirmCheckout, createCheckout } from "../controllers/checkoutController.js";

const router = Router();

router.post("/", createCheckout);
router.get("/:id/status", confirmCheckout);

export default router;

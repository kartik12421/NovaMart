import { Router } from "express";
import { getCategories, getProductBySlug, listProducts } from "../../../../../novamart/northwind-store/backend/src/controllers/productController.js";

const router = Router();

router.get("/", listProducts);
router.get("/categories", getCategories);
router.get("/:slug", getProductBySlug);

export default router;

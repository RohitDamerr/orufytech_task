import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  togglePublish
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protect);

router.post("/", createProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/publish", togglePublish);

export default router;

import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
import protect from "../middlewares/protect.js";
import requireVerifiedSeller from "../middlewares/requireVerifiedSeller.js";

const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", protect, requireVerifiedSeller, createProduct);
productRouter.put("/:id", protect, requireVerifiedSeller, updateProduct);
productRouter.delete("/:id", protect, requireVerifiedSeller, deleteProduct);

export default productRouter;

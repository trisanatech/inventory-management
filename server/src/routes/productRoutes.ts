import { Router } from "express";
import {
  createCategory,
  createProduct,
  createProductVariant,
  updateCategory,
  deleteCategory,
 
  // deleteProduct,
  getCategories,
  getProducts,
  getProductVariants
  //updateProduct,
} from "../controllers/productController";

const router = Router();

router.get("/product/categories", getCategories);
router.post("/product/categories", createCategory);
router.put("/product/categories/:id", updateCategory);
router.delete("/product/categories/:id", deleteCategory);
router.get("/", getProducts);
router.get("/", getProductVariants);
router.post("/", createProduct);
router.post("/", createProductVariant);
//router.post("/:id", updateProduct);
//router.post("/:id", deleteProduct);

export default router;

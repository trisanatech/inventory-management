import { Router } from "express";
import {
  createCategory,
  createProduct,
  createProductVariant,
 
  // deleteProduct,
  getCategories,
  getProducts,
  getProductVariants
  //updateProduct,
} from "../controllers/productController";

const router = Router();

router.get("/", getCategories);
router.get("/", getProducts);
router.get("/", getProductVariants);
router.post("/", createCategory);
router.post("/", createProduct);
router.post("/", createProductVariant);
//router.post("/:id", updateProduct);
//router.post("/:id", deleteProduct);

export default router;

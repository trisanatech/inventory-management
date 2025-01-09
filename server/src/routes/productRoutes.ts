import { Router } from "express";
import {
  // createProduct,
 // deleteProduct,
  getProducts,
  //updateProduct,
} from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
//router.post("/", createProduct);
//router.post("/:id", updateProduct);
//router.post("/:id", deleteProduct);

export default router;

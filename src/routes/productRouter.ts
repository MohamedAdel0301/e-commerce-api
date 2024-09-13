import express from "express";
import * as Controllers from "../controllers/productController";
import {
  authenticateUser,
  authorizePermission,
} from "../middleware/authentication";

const productRouter = express.Router();

productRouter
  .route("/")
  .post(
    authenticateUser,
    authorizePermission("admin"),
    Controllers.createProduct
  )
  .get(Controllers.getAllProducts);

productRouter
  .route("/:id")
  .get(Controllers.getSingleProduct)
  .patch(
    authenticateUser,
    authorizePermission("admin"),
    Controllers.updateProduct
  )
  .delete(
    authenticateUser,
    authorizePermission("admin"),
    Controllers.deleteProduct
  );

productRouter.post("/uploadImage", authenticateUser, Controllers.uploadImage);

export default productRouter;

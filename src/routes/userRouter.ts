import {
  authenticateUser,
  authorizePermission,
} from "./../middleware/authentication";
import express from "express";
import * as Controllers from "../controllers/userController";

const userRouter = express.Router();

userRouter.get(
  "/",
  authenticateUser,
  authorizePermission("admin"),
  Controllers.getAllUsers
);
userRouter.get(
  "/:id",
  authenticateUser,
  authorizePermission("admin"),
  Controllers.getUser
);
userRouter.get("/whoami", authenticateUser, Controllers.getCurrentUser);
userRouter.patch("/update", Controllers.updateUser);
userRouter.patch("/changepass", Controllers.updateUserPassword);

export default userRouter;

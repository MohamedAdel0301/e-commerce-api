import * as Controllers from "../controllers/authController";
import express from "express";

export const authRouter = express.Router();

authRouter.post("/register", Controllers.register);
authRouter.post("/login", Controllers.login);
authRouter.post("/logout", Controllers.logout);

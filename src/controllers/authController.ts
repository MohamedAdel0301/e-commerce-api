import { Request, Response } from "express";
import { User } from "../models/User";
import { StatusCodes } from "http-status-codes";
import { RegisterSchema } from "../types/zod-types";
import { UnauthenticatedError } from "../errors/unauthenticated-error";
import { CustomErrors } from "../errors";
import { createJWT } from "../utils/jwt-utils";
import { JWT_TIME_IN_MS } from "../constants";

export const register = async (req: Request, res: Response) => {
  const validation = RegisterSchema.safeParse(req.body);

  //validate incoming request
  if (!validation.success) {
    throw new UnauthenticatedError("Invalid credentials format");
  }
  const { name, email, password } = validation.data;

  //check for uniqueness
  const user = await User.findOne({ email });
  if (user) {
    throw new CustomErrors.BadRequestError(
      "A user with the specified email already exists"
    );
  }
  const newUser = await User.create({ name, email, password });
  const tokenContent = { name: newUser.name, userId: newUser._id };
  const token = createJWT(tokenContent);

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + JWT_TIME_IN_MS),
  });
  res.status(StatusCodes.CREATED).json({ user: tokenContent });
};
export const login = async (req: Request, res: Response) => {};
export const logout = async (req: Request, res: Response) => {
  res.json({
    logout: "success",
  });
};

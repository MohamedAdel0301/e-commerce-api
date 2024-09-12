import { Request, Response } from "express";
import { User } from "../models/User";
import { StatusCodes } from "http-status-codes";
import { LoginSchema, RegisterSchema } from "../types/zod-types";
import { CustomErrors } from "../errors";
import { attachCookies } from "../utils/jwt-utils";
import { Types } from "mongoose";
import { Role } from "../types/types";
import { createTokenUser } from "../utils/createTokenUser";

export const register = async (req: Request, res: Response) => {
  //validate incoming request
  const validation = RegisterSchema.safeParse(req.body);
  if (!validation.success) {
    throw new CustomErrors.BadRequestError("Invalid credentials format");
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

  const tokenContent = createTokenUser({
    ...newUser,
    _id: newUser._id as Types.ObjectId,
  });

  attachCookies({ res, payload: tokenContent }); //access res.cookie

  res.status(StatusCodes.CREATED).json({ user: tokenContent });
};

export const login = async (req: Request, res: Response) => {
  const validation = LoginSchema.safeParse(req.body);
  if (!validation.success) {
    throw new CustomErrors.BadRequestError("Invalid credentials format");
  }
  const { email, password } = validation.data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomErrors.UnauthenticatedError("Invalid credentials");
  }
  //check password
  const isMatchingPasswords = await user.comparePassword(password);
  if (!isMatchingPasswords) {
    throw new CustomErrors.UnauthenticatedError("Invalid credentials");
  }

  const tokenContent = createTokenUser({
    ...user,
    _id: user._id as Types.ObjectId,
  });

  attachCookies({ res, payload: tokenContent });
  res.status(StatusCodes.OK).json({ user: tokenContent });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
};

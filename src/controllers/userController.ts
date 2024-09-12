import { attachCookies } from "./../utils/jwt-utils";
import { Request, Response } from "express";
import { User } from "../models/User";
import { StatusCodes } from "http-status-codes";
import { CustomErrors } from "../errors";
import mongoose, { Types } from "mongoose";
import { UpdatePasswordSchema, UpdateUserSchema } from "../types/zod-types";
import { createTokenUser } from "../utils/createTokenUser";
import { getUserPermission } from "../utils/utils";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({}).select("-password");
  return res.status(StatusCodes.OK).json({ users });
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const _id = new mongoose.Types.ObjectId(id);
  const user = await User.findOne({ _id }).select("-password");
  if (!user) {
    throw new CustomErrors.NotFoundError("The specified user was not found");
  }
  getUserPermission(
    { userId: user._id as Types.ObjectId, role: user.role },
    req.user!?.userId
  );
  return res.status(StatusCodes.OK).json({ user });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUser = async (req: Request, res: Response) => {
  const validation = UpdateUserSchema.safeParse(req.body);
  if (!validation.success) {
    throw new CustomErrors.BadRequestError("Invalid data format");
  }
  const { email, name } = validation.data;

  if (!email || !name) {
    throw new CustomErrors.BadRequestError("Fields are not provided");
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user?.userId },
    { email, name },
    { new: true, runValidators: true }
  );
  const tokenContent = createTokenUser({
    ...user!,
    _id: user!._id as Types.ObjectId,
  });
  attachCookies({ res, payload: tokenContent });
  res.status(StatusCodes.OK).json({ user: tokenContent });
};

export const updateUserPassword = async (req: Request, res: Response) => {
  const validation = UpdatePasswordSchema.safeParse(req.body);
  if (!validation.success) {
    throw new CustomErrors.BadRequestError("Invalid data entered");
  }
  const { oldPassword, newPassword } = validation.data;
  const user = await User.findOne({ _id: req.user?.userId });

  if (!user) {
    throw new CustomErrors.NotFoundError("User was not found");
  }

  const isMatchingPasswords = await user.comparePassword(oldPassword);
  if (!isMatchingPasswords) {
    throw new CustomErrors.UnauthenticatedError("Incorrect password");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password saved successfully" });
};

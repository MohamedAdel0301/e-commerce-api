import { JWT_TIME_IN_MS } from "./../constants/index";
import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/unauthenticated-error";
import { Types } from "mongoose";
import { Response } from "express";

type TokenPayload = {
  name: string;
  userId: Types.ObjectId;
};

export const isTokenValid = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new UnauthenticatedError("Failed to authenticate request");
  }
};

export const createJWT = ({ payload }: { payload: TokenPayload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_LIFETIME!,
  });
  return token;
};

export const attachCookies = ({
  res,
  payload,
}: {
  res: Response;
  payload: TokenPayload;
}) => {
  const token = createJWT({ payload: payload });
  res.cookie("token", token, {
    expires: new Date(Date.now() + JWT_TIME_IN_MS),
    httpOnly: true,
    signed:true,
    secure: process.env.NODE_ENV === "production"
  });
};
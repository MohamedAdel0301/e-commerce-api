import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/unauthenticated-error";
import { Types } from "mongoose";

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

export const createJWT = (payload: TokenPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_LIFETIME!,
  });
  return token;
};

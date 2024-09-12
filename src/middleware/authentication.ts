import { NextFunction, Request, Response } from "express";
import { CustomErrors } from "../errors";
import { isTokenValid } from "../utils/jwt-utils";
import { Role } from "../types/types";
import { Types } from "mongoose";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtToken: string = req.signedCookies.token;
  if (!jwtToken) {
    throw new CustomErrors.UnauthenticatedError("Invalid request");
  }
  try {
    const { name, userId, role } = isTokenValid(jwtToken);
    req.user = { name, userId, role };
    next();
  } catch (err) {
    throw new CustomErrors.UnauthenticatedError("Authentication has failed");
  }
};

export const authorizePermission = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user && !roles.includes(req.user?.role)) {
      throw new CustomErrors.UnauthorizedError("Authorization failed");
    }
    next();
  };
};

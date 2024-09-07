import { CustomErrors } from "../errors";
import { Request, Response, NextFunction } from "express";
import isTokenValid from "../utils";

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  // check cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new CustomErrors.UnauthenticatedError("Authentication invalid");
  }
  try {
    const payload = isTokenValid(token);

    req.user = {
      userId: payload.user.userId,
      role: payload.user.role,
    };

    next();
  } catch (error) {
    throw new CustomErrors.UnauthenticatedError("Authentication invalid");
  }
};

const authorizeRoles = (...roles: String[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomErrors.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };

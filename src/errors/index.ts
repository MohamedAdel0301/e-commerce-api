import { CustomAPIError } from "./custom-api";
import { UnauthenticatedError } from "./unauthenticated-error";
import { NotFoundError } from "./not-found";
import { BadRequestError } from "./bad-request";

export const CustomErrors = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
};

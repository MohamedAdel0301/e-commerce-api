import { Types } from "mongoose";
import { Role } from "../types/types";
import { CustomErrors } from "../errors";

export const getUserPermission = (
  requester: { userId: Types.ObjectId; role: Role },
  requestedId: Types.ObjectId
) => {
  if (requester.role === "admin") return;
  if (requester.userId.toString() === requestedId.toString()) return;
  throw new CustomErrors.UnauthorizedError(
    "Not authorized to access this resource"
  );
};

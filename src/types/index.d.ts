import { Types } from "mongoose";
import { Role } from ".";

declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        userId: Types.ObjectId;
        role: Role;
      };
    }
  }
}

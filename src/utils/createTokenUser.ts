import { UserType } from "../models/User";
import { Types } from "mongoose";
import { Role } from "../types/types";

type TCreateTokenUSer = {
  _id: Types.ObjectId;
  name: string;
  role: Role;
};
export const createTokenUser = ({ _id, name, role }: TCreateTokenUSer) => {
  return {
    name: name,
    userId: _id,
    role,
  };
};

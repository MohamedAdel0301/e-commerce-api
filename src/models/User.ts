import mongoose, { Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: [true, "A name must be provided"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "An email must be provided"],
    validator: {
      validate: validator.isEmail,
      message: "Enter a valid email",
    },
    minLength: 3,
    maxLength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password: string) {
  const isMatching = await bcrypt.compare(password, this.password);
  return isMatching;
};

export const User = mongoose.model("User", UserSchema);

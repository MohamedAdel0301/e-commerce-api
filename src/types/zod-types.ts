import z from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name is too short" })
    .max(50, { message: "Name is too long" }),
  email: z
    .string()
    .email()
    .min(3, { message: "Email is too short" })
    .max(50, { message: "Email is too long" }),
  password: z.string().min(3).max(50),
});

export const LoginSchema = RegisterSchema.omit({ name: true });
export const UpdateUserSchema = RegisterSchema.omit({ password: true });

export const UpdatePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(3, { message: "Name is too short" })
    .max(50, { message: "Name is too long" }),
  newPassword: z
    .string()
    .min(3, { message: "Name is too short" })
    .max(50, { message: "Name is too long" }),
});

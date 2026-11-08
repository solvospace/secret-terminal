import { z } from "zod";

const passwordRegex = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[!?<>@#$%]/, "Must contain a special character");

const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address!!"),
    password: passwordRegex,
});

const signInSchema = z.object({
    email: z.email("Invalid email address!!"),
    password: passwordRegex,
});

export { signUpSchema, signInSchema };

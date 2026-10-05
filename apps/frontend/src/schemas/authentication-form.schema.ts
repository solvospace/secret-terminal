"use client";

import { z } from "zod";

const passwordCriteria = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[!?<>@#$%]/, "Must contain a special character");

const signInSchema = z.object({
    email: z.email("Invalid email address"),
    password: passwordCriteria,
});

const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: passwordCriteria,
});

const forgotPasswordSchema = z.object({
    email: z.email("Invalid email address"),
});

const codeVerificationSchema = z.object({
    email: z.email("Invalid email address"),
    code: z.string().length(6, "Code must be 6 characters"),
});

const changePasswordSchema = z.object({
    password: passwordCriteria,
});

const authenticationFormSchemaMap: Record<string, object> = {
    signIn: signInSchema,
    signUp: signUpSchema,
    forgotPassword: forgotPasswordSchema,
    verifyResetCode: codeVerificationSchema,
    changePassword: changePasswordSchema,
    verifyAccount: codeVerificationSchema,
};

export default authenticationFormSchemaMap;

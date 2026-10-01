import { Router } from "express";
import {
    signUp,
    signIn,
    signOut,
    refreshToken,
    forgotPassword,
    verifyResetCode,
    changePassword,
} from "./auth.controller.js";
import { signInSchema, signUpSchema } from "./auth.validation.js";
import captchaVerification from "../../middlewares/captcha.middleware.js";
import schemaVerification from "../../middlewares/schema.middleware.js";
import tokenVerification from "../../middlewares/token.middleware.js";
import cpTokenVerification from "../../middlewares/cp-token.middleware.js";

const authRoutes = Router();

authRoutes.post("/sign-up", captchaVerification, schemaVerification(signUpSchema), signUp);
authRoutes.post("/sign-in", captchaVerification, schemaVerification(signInSchema), signIn);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/verify-reset-code", verifyResetCode);
authRoutes.patch("/change-password", cpTokenVerification, changePassword);
authRoutes.post("/sign-out", tokenVerification, signOut);

export default authRoutes;

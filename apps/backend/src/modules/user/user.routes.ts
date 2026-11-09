import renewToken from "../../middlewares/renew-token.middleware.js";
import tokenVerification from "../../middlewares/token.middleware.js";
import { userDetails } from "./user.controller.js";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/me", tokenVerification, renewToken, userDetails);

export default userRoutes;

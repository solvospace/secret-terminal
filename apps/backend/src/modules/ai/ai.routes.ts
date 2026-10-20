import { Router } from "express";
import { produce } from "../ai/ai.controller.js";

const aiRoutes = Router();

aiRoutes.post("/generate-text", produce);

export default aiRoutes;

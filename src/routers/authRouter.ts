import { Router } from "express";
import { logIn, logOut, me, signUp } from "../controllers/authController.js";
import protect from "../middlewares/protect.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/log-in", logIn);
authRouter.post("/log-out", protect, logOut);
authRouter.get("/me", protect, me);

export default authRouter;

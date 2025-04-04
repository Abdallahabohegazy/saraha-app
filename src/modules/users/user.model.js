import { Router } from "express";
import { confirmEmail, getProfile, signIn, signUp } from "./user.service.js";
import { authentication } from "../../middleware/auth.js";

const userRouter = Router();

userRouter.post("/signup" ,signUp)
userRouter.post("/signin" ,signIn)
userRouter.get("/confirmEmail/:token" ,confirmEmail)
userRouter.get("/profile" , authentication , getProfile)

export default userRouter; 
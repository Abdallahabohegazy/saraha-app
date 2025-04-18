import { Router } from "express";
import { confirmEmail,  freezeAccount,  getProfile, shareProfile, signIn, signUp, updatePassword, updateProfile } from "./user.service.js";
import { authentication, authorization, roles } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import {  freezeAccountSchema, shareProfileSchema, signInSchema, signUpSchema, updatePasswordSchema, updateProfileSchema } from "./user.validatin.js";

const userRouter = Router();

userRouter.post("/signup", validation(signUpSchema) ,signUp)
userRouter.post("/signin" ,validation(signInSchema),signIn)
userRouter.get("/confirmEmail/:token" ,confirmEmail)
userRouter.get("/profile" , authentication , authorization(Object.values(roles)), getProfile)
userRouter.get('/profile/:id', validation(shareProfileSchema),shareProfile);
userRouter.patch("/update" , validation(updateProfileSchema) , authentication , updateProfile)
userRouter.patch("/update/password", validation(updatePasswordSchema), authentication, updatePassword);
userRouter.delete("/update/freezeAccount", validation(freezeAccountSchema), authentication, freezeAccount);


export default userRouter;

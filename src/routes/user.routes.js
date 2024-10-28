import { Router } from 'express';
import { registerUser, loginUser, updateUserData, getUser, getSingleUser } from "../controller/user.controllers.js"
import { validateUserSignup, validateUserLogin, checkUser, validateUpdateUser } from "../middleware/inputValidation.middleware.js"
import { verifyJwt } from '../middleware/verifyJwt.middleware.js';
import { checkUserPassword } from "../middleware/verifyPassword.middleware.js"

const userRouter = Router();

// signup user
userRouter.route("/signup").post(validateUserSignup, checkUser, registerUser);

// signin user
userRouter.route("/signin").post(validateUserLogin, loginUser);

// update user
userRouter.route("/").put(validateUpdateUser, verifyJwt, checkUserPassword, updateUserData);

// filtering user
userRouter.route("/bulk").get(verifyJwt, getUser);

// get user
userRouter.route("/").get(verifyJwt, getSingleUser)

export { userRouter };
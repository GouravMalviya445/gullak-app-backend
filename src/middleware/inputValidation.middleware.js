import createHttpError from "http-errors";
import z, { number, string } from "zod";
import { User } from "../models/user.models.js";


// user signup input schema
const userSignupSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    password: z.string().min(6, "password must 6 character long")
});

// user signIn input schema
const userLoginSchema = z.object({
    username: z.string(),
    password: z.string()
});

// user data update schema
const updateUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6, "password must 6 character long")
})

// transfer schema 
const transferSchema = z.object({
    to: z.string().min(12),
    amount: z.number()
})




const validateUserSignup = (req, res, next) => {
    const result = userSignupSchema.safeParse(req.body);
    if (!result.success) {
        return next(createHttpError(411, "invalid inputs!"));
    } else {
        next();
    }
}


const validateUserLogin = (req, res, next) => {
    const result = userLoginSchema.safeParse(req.body);
    if (!result.success) {
        return next(createHttpError(411, "invalid inputs!"));
    } else {
        next();
    }
}


const validateUpdateUser = (req, res, next) => {
    
    const { success } = updateUserSchema.safeParse(req.body);

    if (!success) {
        return next(createHttpError(411, "Invalid inputs!"))
    } else {
        return next();
    }
}


const validateTransfer = (req, res, next) => {
    const { success } = transferSchema.safeParse(req.body);
    if (!success) {
        return next(createHttpError(411, "Invalid inputs!"))
    } else {
        return next();
    }
}


// check user if it is exist in the database or not
const checkUser = async (req, res, next) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        
        if (!user) {
            next();
        } else {
            return next(createHttpError(411, "Email already taken / Incorrect inputs"));
        }
    } catch (err) {
        return next(createHttpError(500, "error while checking the user existence"));
    }
}


export {
    validateUserSignup,
    validateUserLogin,
    checkUser,
    validateUpdateUser,
    validateTransfer
}
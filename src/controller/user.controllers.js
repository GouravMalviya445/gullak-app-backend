import { User } from "../models/user.models.js";
import createHttpError from 'http-errors';
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import bcrypt from "bcrypt";
import { Account } from "../models/account.models.js";

// register user controller 
const registerUser = async (req, res, next) => {
    try {
        const { username, firstName, lastName, password } = req.body;

        const user = await User.create({
            username,
            firstName,
            lastName,
            password
        });

        // create an account
        const account = await Account.create({
            userId: user._id,
            ballance: Math.floor(Math.random() * 10000 + 1)
        })

        if (user && account) {
            try {
                const token = jwt.sign({ sub: user._id, username: user.username },
                    config.accessTokenSecret,
                    {expiresIn: config.accessTokenExpiry}
                );
                if (token) {
                    res.status(201).json({
                        accessToken: token
                    })
                }
            } catch (error) {
                return next(createHttpError(400, "error while creating jwt token"));
            }
        }

    } catch (err) {
        console.log("Error while register the user: ", err);
        return next(createHttpError(400, "Error while registering the user"));
    }
}


// login user controller
const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) return next(createHttpError(404, "404 user not found!"));

        const isMatched = await user.isPasswordCorrect(password);
        if (!isMatched) return next(createHttpError(400, "Incorrect Password"))

        try {
            // access token generation
            const token = jwt.sign({ sub: user._id, username }, config.accessTokenSecret, { expiresIn: config.accessTokenExpiry });

            res.status(200).json({ accessToken: token });

        } catch (err) {
            console.log("Error while generating jwt token: ", err);
            return next(createHttpError(400, "Error while generating jwt token"));
        }

    } catch (err) {
        console.log("Error while user login: ", err);
        return next(400, "Error while user login")
    }
}


// update user data controller
const updateUserData = async (req, res, next) => {
    try {
        let { newPassword, firstName, lastName } = req.body;

        newPassword = await bcrypt.hash(newPassword, 10);

        await User.findOneAndUpdate({ _id: req.userId }, {
            firstName,
            lastName,
            password: newPassword
        })

        res.status(200).json({
            message: "updated successfully"
        });

    } catch (err) {
        console.log(err)
        return next(createHttpError(400, "error while updating the user"));
    }
}

// get the user to send them money
const getUser = async (req, res, next) => {
    try {
        const filter = req.query.filter || "";

        if (!filter) {
            return res.status(200).json({ users: [] });
        };

        const regex = new RegExp(filter, 'i');


        const users = await User.find({
            $or: [{
                firstName: { $regex: regex }
            }, {
                lastName: { $regex: regex }
            }]
        });

        if (!users) {
            return next(createHttpError(404, "404 not found"));
        }

        res.status(200).json({
            users: users.map(user => ({
                userId: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            }))
        });
    } catch (err) {
        return next(createHttpError(400, "error while getting the users"))
    }
}

// get single user
const getSingleUser = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return next(createHttpError(404, "404 user not found"))
        } 

        res.status(200).json({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            userId: user._id
        });
    } catch (error) {
        return next(createHttpError(400, "Error while getting user"));
    }
}

export {
    registerUser,
    loginUser,
    updateUserData,
    getUser,
    getSingleUser
};

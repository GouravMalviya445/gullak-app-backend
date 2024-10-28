import { User } from "../models/user.models.js";
import createHttpError from "http-errors";

const checkUserPassword = async (req, res, next) => {
    try {
        const { oldPassword } = req.body;
        const user = await User.findById(req.userId);

        const isMatched = await user.isPasswordCorrect(oldPassword);

        if (!isMatched) {
            return next(createHttpError(401, "Unauthorized / incorrect password"));
        } else {
            next();
        }

    } catch (err) {
        return next(createHttpError(400, "Error while checking the password"))
    }
}

export { checkUserPassword };
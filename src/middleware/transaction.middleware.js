import createHttpError from "http-errors";
import { Account } from "../models/account.models.js";

const transactionMiddleware = async (req, res, next) => {
    const { to, amount } = req.body;

    if (amount <= 0) {
        return next(createHttpError(400, "invalid transaction amount"));
    }


    try {
        // sender
        const sender = await Account.findOne({ userId: req.userId });
            if (!sender || sender.ballance < amount) {
            return next(createHttpError(400, "insufficient balance or sender not found"));
        }

        // receiver
        const receiver = await Account.findOne({ userId: to });
        if (!receiver || receiver.ballance < amount) {
            return next(createHttpError(400, "insufficient balance or receiver not found"));
        }

        next();

    } catch (err) {
        console.log(err)
        return next(createHttpError(400, "error in transaction middleware"));
    }
}

export {
    transactionMiddleware
};
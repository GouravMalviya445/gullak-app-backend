import createHttpError from "http-errors";
import { Account } from "../models/account.models.js"
import mongoose from "mongoose";

const getBalance = async (req, res, next) => {
    try {
        const account = await Account.findOne({userId: req.userId});

        if (account) {
            res.status(200).json({ balance: account.ballance });
        }
    } catch (err) {
        return next(createHttpError(400, "error while getting balance"));
    }
}

const transaction = async (req, res, next) => {
    const { to, amount } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const sender = await Account.findOneAndUpdate({ userId: req.userId }, {
            $inc: { ballance: -amount }
        }).session(session);

        // save the changes 
        await sender.save();

        const receiver = await Account.findOneAndUpdate({ userId: to }, {
            $inc: { ballance: amount }
        }).session(session);

        await receiver.save();

        //  commit if all is good
        await session.commitTransaction();


        res.status(200).json({
            message: "transfer successful",
        }); 

    } catch (error) {
        // if there is any error occur then abort the transaction
        await session.abortTransaction();
        return next(createHttpError(400, "transaction failed"))
    } finally {
        // end the session
        await session.endSession();
    }

}

export {
    getBalance,
    transaction
}
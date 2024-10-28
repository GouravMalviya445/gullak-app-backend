import express from "express";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";
import { getBalance, transaction } from "../controller/account.controllers.js";
import { validateTransfer } from "../middleware/inputValidation.middleware.js";
import { transactionMiddleware } from "../middleware/transaction.middleware.js";


const accountRouter = express.Router();


accountRouter.route("/balance").get(verifyJwt, getBalance);
accountRouter.route("/transfer").post(validateTransfer, verifyJwt, transactionMiddleware, transaction);

export { accountRouter };
import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ballance: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Account = mongoose.model("Account", accountSchema);

export { Account };
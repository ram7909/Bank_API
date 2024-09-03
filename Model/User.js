import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: Number, require: true },
    PAN: { type: String, require: true },
    aadhar: { type: Number, require: true },
    accountType: { type: String, require: true },
    accountNumber: { type: Number, require: true },
    balance: { type: Number, default: 1000 },
    password: { type: String, require: true },
    createdAt: { type: Date, default: Date.now },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        require:true
    }]
})

export const User = mongoose.model("user", userSchema)
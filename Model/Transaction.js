import mongoose from "mongoose";

const transactionItems = new mongoose.Schema({
    name: { type: String, require: true },
    accountType: { type: String, require: true },
    amount: { type: Number, require: true },
    balance: { type:Number,require:true},
    method: { type: String, require: true },
    type:{type:String,enum:['deposit','withdraw'],require:true},
    password: { type: String, require: true },
    createdAt: { type: Date, default: Date.now }
})


const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    items: [transactionItems]
})

export const Transaction = mongoose.model("transaction", transactionSchema)
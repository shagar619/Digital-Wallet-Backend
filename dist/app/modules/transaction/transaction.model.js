"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const TransactionSchema = new mongoose_1.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(transaction_interface_1.TransactionType),
        required: true
    },
    fee: {
        type: Number,
        default: 0
    },
    reference: {
        type: String
    },
    status: {
        type: String,
        enum: ["COMPLETED", "FAILED"],
        default: "COMPLETED"
    },
}, { timestamps: true,
    versionKey: false });
exports.TransactionModel = (0, mongoose_1.model)("Transaction", TransactionSchema);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_model_1 = require("../wallet/wallet.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../user/user.model");
const transaction_model_1 = require("./transaction.model");
const uuid_1 = require("uuid");
const transaction_interface_1 = require("./transaction.interface");
// --- HELPERS ---
const findWalletByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.WalletModel.findOne({ user: userId });
    if (!wallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    if (wallet.status === "BLOCKED")
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Wallet is BLOCKED");
    return wallet;
});
const findUserByPhone = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findOne({ phone });
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found with this phone number");
    if (user.IsActive !== "ACTIVE")
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Target user is blocked");
    return user;
});
// --- SERVICES ---
// 1. Send Money (User to User)
const sendMoney = (senderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverPhone, amount } = payload;
    const fee = 5; // Flat fee logic (Example)
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const senderWallet = yield findWalletByUser(senderId);
        const receiverUser = yield findUserByPhone(receiverPhone);
        const receiverWallet = yield findWalletByUser(receiverUser._id.toString());
        if (senderWallet.user.toString() === receiverWallet.user.toString()) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot send money to yourself");
        }
        if (senderWallet.balance < amount + fee) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient Balance");
        }
        // Deduct from Sender
        senderWallet.balance -= (amount + fee);
        yield senderWallet.save({ session });
        // Add to Receiver
        receiverWallet.balance += amount;
        yield receiverWallet.save({ session });
        // Create Record
        const transaction = yield transaction_model_1.TransactionModel.create([{
                transactionId: (0, uuid_1.v4)(),
                senderId: senderId,
                receiverId: receiverUser._id,
                amount,
                type: transaction_interface_1.TransactionType.SEND_MONEY,
                fee,
                status: "COMPLETED"
            }], { session });
        // (Optional) Add Fee to Admin Wallet logic here
        yield session.commitTransaction();
        return transaction[0];
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// 2. Cash In (Agent Adds Money to User)
const cashIn = (agentId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userPhone, amount } = payload;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const agentWallet = yield findWalletByUser(agentId); // Agent needs balance to give cash
        const targetUser = yield findUserByPhone(userPhone);
        const targetWallet = yield findWalletByUser(targetUser._id.toString());
        if (agentWallet.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent Insufficient Balance");
        }
        // Move money Agent -> User
        agentWallet.balance -= amount;
        targetWallet.balance += amount;
        yield agentWallet.save({ session });
        yield targetWallet.save({ session });
        const transaction = yield transaction_model_1.TransactionModel.create([{
                transactionId: (0, uuid_1.v4)(),
                senderId: agentId, // Agent is sender
                receiverId: targetUser._id,
                amount,
                type: transaction_interface_1.TransactionType.CASH_IN,
                fee: 0, // Usually free for user
                status: "COMPLETED"
            }], { session });
        yield session.commitTransaction();
        return transaction[0];
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// 3. Admin Analytics
const getSystemStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalUsers = yield user_model_1.UserModel.countDocuments({ role: "USER" });
    const totalAgents = yield user_model_1.UserModel.countDocuments({ role: "AGENT" });
    // Aggregate total money in system
    const totalMoneyResult = yield wallet_model_1.WalletModel.aggregate([{ $group: { _id: null, total: { $sum: "$balance" } } }]);
    const totalMoney = ((_a = totalMoneyResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    // Recent 10 Transactions
    const recentTransactions = yield transaction_model_1.TransactionModel.find().sort({ createdAt: -1 }).limit(10).populate("senderId", "name email");
    return {
        totalUsers,
        totalAgents,
        totalMoney,
        recentTransactions
    };
});
// 4. Withdraw (User -> Agent)
const withdraw = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentPhone, amount } = payload;
    const WITHDRAWAL_FEE_PERCENT = 0.015; // 1.5% Fee
    const AGENT_COMMISSION_PERCENT = 0.01; // 1% Commission to Agent
    const ADMIN_REVENUE_PERCENT = 0.005; // 0.5% Revenue to Admin
    const totalFee = amount * WITHDRAWAL_FEE_PERCENT;
    const agentCommission = amount * AGENT_COMMISSION_PERCENT;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const adminRevenue = amount * ADMIN_REVENUE_PERCENT;
    const totalDeduction = amount + totalFee;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // 1. Fetch Wallets
        const userWallet = yield findWalletByUser(userId);
        const agentUser = yield findUserByPhone(agentPhone);
        // Validate Receiver is actually an Agent
        if (agentUser.role !== "AGENT") {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver must be a registered Agent");
        }
        const agentWallet = yield findWalletByUser(agentUser._id.toString());
        // 2. Check Balance
        if (userWallet.balance < totalDeduction) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient Balance for withdrawal + fee");
        }
        // 3. Perform Transfer
        // User loses (Amount + Fee)
        userWallet.balance -= totalDeduction;
        yield userWallet.save({ session });
        // Agent gains (Amount + Commission)
        agentWallet.balance += (amount + agentCommission);
        yield agentWallet.save({ session });
        // (Optional) Update Admin Wallet with `adminRevenue` here...
        // 4. Record Transaction
        const transaction = yield transaction_model_1.TransactionModel.create([{
                transactionId: (0, uuid_1.v4)(),
                senderId: userId,
                receiverId: agentUser._id,
                amount: amount,
                type: transaction_interface_1.TransactionType.WITHDRAW, // or CASH_OUT
                fee: totalFee,
                reference: `Commission: ${agentCommission}`,
                status: "COMPLETED"
            }], { session });
        yield session.commitTransaction();
        return {
            transaction: transaction[0],
            breakdown: {
                amount,
                fee: totalFee,
                newBalance: userWallet.balance
            }
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// 5. Get My Transactions (Enhanced with Filters)
const getMyTransactions = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, limit = 10 } = query;
    const filter = {
        $or: [{ senderId: userId }, { receiverId: userId }]
    };
    if (type) {
        filter.type = type; // e.g., ?type=SEND_MONEY
    }
    const transactions = yield transaction_model_1.TransactionModel.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .populate("senderId", "name phone")
        .populate("receiverId", "name phone");
    return transactions;
});
exports.TransactionServices = {
    sendMoney,
    cashIn,
    withdraw,
    getSystemStats,
    getMyTransactions
};

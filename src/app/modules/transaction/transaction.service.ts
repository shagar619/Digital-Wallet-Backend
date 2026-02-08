/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { WalletModel } from "../wallet/wallet.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { UserModel } from "../user/user.model";
import { TransactionModel } from "./transaction.model";
import { v4 as uuidv4 } from "uuid";
import { TransactionType } from "./transaction.interface";



// --- HELPERS ---
const findWalletByUser = async (userId: string) => {

     const wallet = await WalletModel.findOne({ user: userId });
     if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
     if (wallet.status === "BLOCKED") throw new AppError(httpStatus.FORBIDDEN, "Wallet is BLOCKED");
     return wallet;
};

const findUserByPhone = async (phone: string) => {

     const user = await UserModel.findOne({ phone });
     if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found with this phone number");
     if (user.IsActive !== "ACTIVE") throw new AppError(httpStatus.FORBIDDEN, "Target user is blocked");
     return user;
};






// --- SERVICES ---

// 1. Send Money (User to User)
const sendMoney = async (senderId: string, payload: { receiverPhone: string; amount: number }) => {

     const { receiverPhone, amount } = payload;
     const fee = 5; // Flat fee logic (Example)

     const session = await mongoose.startSession();
     try {

     session.startTransaction();

     const senderWallet = await findWalletByUser(senderId);
     const receiverUser = await findUserByPhone(receiverPhone);
     const receiverWallet = await findWalletByUser(receiverUser._id.toString());

     if (senderWallet.user.toString() === receiverWallet.user.toString()) {
     throw new AppError(httpStatus.BAD_REQUEST, "Cannot send money to yourself");
     }

     if (senderWallet.balance < amount + fee) {
     throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance");
     }

     // Deduct from Sender
     senderWallet.balance -= (amount + fee);
     await senderWallet.save({ session });

     // Add to Receiver
     receiverWallet.balance += amount;
     await receiverWallet.save({ session });

     // Create Record
     const transaction = await TransactionModel.create([{
          transactionId: uuidv4(),
          senderId: senderId,
          receiverId: receiverUser._id,
          amount,
          type: TransactionType.SEND_MONEY,
          fee,
          status: "COMPLETED"
     }], { session });

     // (Optional) Add Fee to Admin Wallet logic here

     await session.commitTransaction();
     return transaction[0];
     } catch (error) {
     await session.abortTransaction();
     throw error;
     } finally {
     session.endSession();
     }
};



// 2. Cash In (Agent Adds Money to User)
const cashIn = async (agentId: string, payload: { userPhone: string; amount: number }) => {

     const { userPhone, amount } = payload;

     const session = await mongoose.startSession();

     try {

     session.startTransaction();

     const agentWallet = await findWalletByUser(agentId); // Agent needs balance to give cash
     const targetUser = await findUserByPhone(userPhone);
     const targetWallet = await findWalletByUser(targetUser._id.toString());

     if (agentWallet.balance < amount) {
     throw new AppError(httpStatus.BAD_REQUEST, "Agent Insufficient Balance");
     }

     // Move money Agent -> User
     agentWallet.balance -= amount;
     targetWallet.balance += amount;

     await agentWallet.save({ session });
     await targetWallet.save({ session });

     const transaction = await TransactionModel.create([{
          transactionId: uuidv4(),
          senderId: agentId, // Agent is sender
          receiverId: targetUser._id,
          amount,
          type: TransactionType.CASH_IN,
          fee: 0, // Usually free for user
          status: "COMPLETED"
     }], { session });

     await session.commitTransaction();
     return transaction[0];
     } catch (error) {
     await session.abortTransaction();
     throw error;
     } finally {
     session.endSession();
     }
};



// 3. Admin Analytics
const getSystemStats = async () => {

     const totalUsers = await UserModel.countDocuments({ role: "USER" });
     const totalAgents = await UserModel.countDocuments({ role: "AGENT" });

     // Aggregate total money in system
     const totalMoneyResult = await WalletModel.aggregate([{ $group: { _id: null, total: { $sum: "$balance" } } }]);
     const totalMoney = totalMoneyResult[0]?.total || 0;

     // Recent 10 Transactions
     const recentTransactions = await TransactionModel.find().sort({ createdAt: -1 }).limit(10).populate("senderId", "name email");

     return {
          totalUsers,
          totalAgents,
          totalMoney,
          recentTransactions
     };
};




// 4. Withdraw (User -> Agent)
const withdraw = async (userId: string, payload: { agentPhone: string; amount: number }) => {

     const { agentPhone, amount } = payload;
     const WITHDRAWAL_FEE_PERCENT = 0.015; // 1.5% Fee
     const AGENT_COMMISSION_PERCENT = 0.01; // 1% Commission to Agent
     const ADMIN_REVENUE_PERCENT = 0.005; // 0.5% Revenue to Admin

     const totalFee = amount * WITHDRAWAL_FEE_PERCENT;
     const agentCommission = amount * AGENT_COMMISSION_PERCENT;
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const adminRevenue = amount * ADMIN_REVENUE_PERCENT;

     const totalDeduction = amount + totalFee;

     const session = await mongoose.startSession();

     try {

     session.startTransaction();

     // 1. Fetch Wallets
     const userWallet = await findWalletByUser(userId);
     const agentUser = await findUserByPhone(agentPhone);

     // Validate Receiver is actually an Agent
     if (agentUser.role !== "AGENT") {
     throw new AppError(httpStatus.BAD_REQUEST, "Receiver must be a registered Agent");
     }

     const agentWallet = await findWalletByUser(agentUser._id.toString());

     // 2. Check Balance
     if (userWallet.balance < totalDeduction) {
     throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance for withdrawal + fee");
     }

     // 3. Perform Transfer
     // User loses (Amount + Fee)
     userWallet.balance -= totalDeduction;
     await userWallet.save({ session });

     // Agent gains (Amount + Commission)
     agentWallet.balance += (amount + agentCommission); 
     await agentWallet.save({ session });

     // (Optional) Update Admin Wallet with `adminRevenue` here...

     // 4. Record Transaction
     const transaction = await TransactionModel.create([{
          transactionId: uuidv4(),
          senderId: userId,
          receiverId: agentUser._id,
          amount: amount,
          type: TransactionType.WITHDRAW, // or CASH_OUT
          fee: totalFee,
          reference: `Commission: ${agentCommission}`,
          status: "COMPLETED"
     }], { session });

     await session.commitTransaction();
     return {
          transaction: transaction[0],
          breakdown: {
               amount,
               fee: totalFee,
               newBalance: userWallet.balance
          }
     };

     } catch (error) {
     await session.abortTransaction();
     throw error;
     } finally {
     session.endSession();
     }
};



// 5. Get My Transactions (Enhanced with Filters)
const getMyTransactions = async (userId: string, query: Record<string, unknown>) => {

     const { type, limit = 10 } = query;

     const filter: any = { 
     $or: [{ senderId: userId }, { receiverId: userId }] 
     };

     if (type) {
     filter.type = type; // e.g., ?type=SEND_MONEY
     }

     const transactions = await TransactionModel.find(filter)
     .sort({ createdAt: -1 })
     .limit(Number(limit))
     .populate("senderId", "name phone")
     .populate("receiverId", "name phone");

     return transactions;
};





export const TransactionServices = {
     sendMoney,
     cashIn,
     withdraw,
     getSystemStats,
     getMyTransactions
};
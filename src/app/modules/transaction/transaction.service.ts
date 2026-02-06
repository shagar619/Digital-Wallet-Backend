// import { ITransactionCreateInput } from "./transaction.interface";
// import { TransactionModel } from "./transaction.model";


// const createTransaction = async (payload: ITransactionCreateInput) => {

//      const transactionPayload = { ...payload };
//      const transaction = await TransactionModel.create(transactionPayload);
//      return transaction;
// };



// const getAllTransactionByUserID = async (user_id: string) => {

//      const transactions = await TransactionModel.find({ user: user_id }).sort({
//           createdAt: -1,
//      });
//      const totalTransaction = await TransactionModel.countDocuments({ user: user_id });

//      return {
//           data: transactions,
//           meta: {
//                total: totalTransaction,
//      },
// };
// };




// const getAllTransaction = async () => {

//      const transactions = await TransactionModel.find({}).sort({
//           createdAt: -1,
//      });
//      const totalTransaction = await TransactionModel.countDocuments();

//      return {
//           data: transactions,
//           meta: {
//                total: totalTransaction,
//      },
// };
// };


// export const TransactionService = {
//      createTransaction,
//      getAllTransaction,
//      getAllTransactionByUserID,
// };


















// Updated
import mongoose from "mongoose";
import { WalletModel } from "../wallet/wallet.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { UserModel } from "../user/user.model";



// --- HELPERS ---
const findWalletByUser = async (userId: string) => {
  const wallet = await WalletModel.findOne({ user: userId });
  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  if (wallet.status === "BLOCKED") throw new AppError(httpStatus.FORBIDDEN, "Wallet is Frozen");
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
  const totalMoneyResult = await WalletModel.aggregate([
    { $group: { _id: null, total: { $sum: "$balance" } } }
  ]);
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

const getMyTransactions = async (userId: string) => {
  return await TransactionModel.find({
    $or: [{ senderId: userId }, { receiverId: userId }]
  }).sort({ createdAt: -1 });
};

export const TransactionServices = {
  sendMoney,
  cashIn,
  getSystemStats,
  getMyTransactions
};
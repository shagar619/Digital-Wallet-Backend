/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { UserModel } from "../user/user.model";
import { WalletModel } from "./wallet.model";
import httpStatus from "http-status-codes";




const getMyBalance = async (userId: string) => {

     const wallet = await WalletModel.findOne({ user: userId }).select("balance status");
     if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
     return wallet;
};



// Get All Wallets (Admin Only)
const getAllWallets = async (query: Record<string, unknown>) => {

     const { page = 1, limit = 10, searchTerm } = query;

     const pageNumber = Number(page);
     const limitNumber = Number(limit);
     const skip = (pageNumber - 1) * limitNumber;

     // Base filter
     const filter: any = {};

     // If searching, we need to find Users first because Wallet doesn't have name/email directly
     if (searchTerm) {
     const users = await UserModel.find({
     $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
          { phone: { $regex: searchTerm, $options: "i" } },
     ],
     }).select("_id");

     const userIds = users.map((u) => u._id);
     filter.user = { $in: userIds };
     }

     const result = await WalletModel.find(filter)
     .populate("user", "name email phone role") // Show user details
     .sort({ balance: -1 }) // Sort by highest balance
     .skip(skip)
     .limit(limitNumber);

     const total = await WalletModel.countDocuments(filter);

     return {
     meta: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPage: Math.ceil(total / limitNumber),
     },
     data: result,
     };
};



//  Update Wallet Status (Admin Only)
const updateWalletStatus = async (walletId: string, status: "ACTIVE" | "BLOCKED") => {

     const wallet = await WalletModel.findById(walletId);

     if (!wallet) {
     throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
     }

     wallet.status = status;
     await wallet.save();

     return wallet;
};







export const WalletServices = {
     getMyBalance,
     getAllWallets,
     updateWalletStatus
};
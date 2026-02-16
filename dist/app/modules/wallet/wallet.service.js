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
exports.WalletServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("./wallet.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getMyBalance = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.WalletModel.findOne({ user: userId }).select("balance status");
    if (!wallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    return wallet;
});
// Get All Wallets (Admin Only)
const getAllWallets = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, searchTerm } = query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    // Base filter
    const filter = {};
    // If searching, we need to find Users first because Wallet doesn't have name/email directly
    if (searchTerm) {
        const users = yield user_model_1.UserModel.find({
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { email: { $regex: searchTerm, $options: "i" } },
                { phone: { $regex: searchTerm, $options: "i" } },
            ],
        }).select("_id");
        const userIds = users.map((u) => u._id);
        filter.user = { $in: userIds };
    }
    const result = yield wallet_model_1.WalletModel.find(filter)
        .populate("user", "name email phone role") // Show user details
        .sort({ balance: -1 }) // Sort by highest balance
        .skip(skip)
        .limit(limitNumber);
    const total = yield wallet_model_1.WalletModel.countDocuments(filter);
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage: Math.ceil(total / limitNumber),
        },
        data: result,
    };
});
//  Update Wallet Status (Admin Only)
const updateWalletStatus = (walletId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.WalletModel.findById(walletId);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    wallet.status = status;
    yield wallet.save();
    return wallet;
});
exports.WalletServices = {
    getMyBalance,
    getAllWallets,
    updateWalletStatus
};

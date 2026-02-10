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
exports.WalletControllers = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const wallet_service_1 = require("./wallet.service");
const responseSender_1 = require("../../utils/responseSender");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getMyBalance = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield wallet_service_1.WalletServices.getMyBalance(user.userId);
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Balance retrieved",
        data: result,
    });
}));
const getAllWallets = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wallet_service_1.WalletServices.getAllWallets(req.query);
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All wallets retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const updateWalletStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const result = yield wallet_service_1.WalletServices.updateWalletStatus(id, status);
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: `Wallet status updated to ${status}`,
        data: result,
    });
}));
exports.WalletControllers = {
    getMyBalance,
    getAllWallets,
    updateWalletStatus
};

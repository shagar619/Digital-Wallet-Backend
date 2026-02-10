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
exports.TransactionControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const asyncHandler_1 = require("../../utils/asyncHandler");
const transaction_service_1 = require("./transaction.service");
const responseSender_1 = require("../../utils/responseSender");
const sendMoney = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield transaction_service_1.TransactionServices.sendMoney(user.userId, req.body);
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Money sent successfully",
        data: result,
    });
}));
const cashIn = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = req.user;
    const result = yield transaction_service_1.TransactionServices.cashIn(agent.userId, req.body);
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Cash In successful",
        data: result,
    });
}));
const withdraw = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield transaction_service_1.TransactionServices.withdraw(user.userId, req.body);
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Withdrawal successful",
        data: result,
    });
}));
const getMyTransactions = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // Update: Pass 'req.query' so filters (type, limit) work
    const result = yield transaction_service_1.TransactionServices.getMyTransactions(user.userId, req.query);
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "History retrieved successfully",
        data: result,
    });
}));
const getAdminAnalytics = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_service_1.TransactionServices.getSystemStats();
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Analytics retrieved",
        data: result,
    });
}));
exports.TransactionControllers = {
    sendMoney,
    cashIn,
    withdraw,
    getMyTransactions,
    getAdminAnalytics
};

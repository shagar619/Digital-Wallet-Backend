"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const transaction_validation_1 = require("./transaction.validation");
const transaction_controller_1 = require("./transaction.controller");
const router = (0, express_1.Router)();
// --- USER ROUTES ---
router.post("/send-money", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(transaction_validation_1.TransactionValidations.sendMoneySchema), transaction_controller_1.TransactionControllers.sendMoney);
router.get("/my-history", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT), // Both can view own history
transaction_controller_1.TransactionControllers.getMyTransactions);
router.post("/withdraw", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), // 🔒 Only Users can withdraw
(0, validateRequest_1.validateRequest)(transaction_validation_1.TransactionValidations.withdrawSchema), transaction_controller_1.TransactionControllers.withdraw);
// --- AGENT ROUTES ---
router.post("/cash-in", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), (0, validateRequest_1.validateRequest)(transaction_validation_1.TransactionValidations.cashInSchema), transaction_controller_1.TransactionControllers.cashIn);
// --- ADMIN ROUTES ---
router.get("/analytics", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), transaction_controller_1.TransactionControllers.getAdminAnalytics);
exports.TransactionRoutes = router;

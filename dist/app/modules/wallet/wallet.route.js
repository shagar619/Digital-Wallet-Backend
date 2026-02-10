"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const wallet_controller_1 = require("./wallet.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const wallet_validation_1 = require("./wallet.validation");
const router = (0, express_1.Router)();
// --- COMMON ROUTES ---
router.get("/my-balance", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT, user_interface_1.Role.ADMIN), // All roles have wallets
wallet_controller_1.WalletControllers.getMyBalance);
// --- ADMIN ROUTES ---
router.get("/all-wallets", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), // 🔒 Admin Only
wallet_controller_1.WalletControllers.getAllWallets);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), // 🔒 Admin Only
(0, validateRequest_1.validateRequest)(wallet_validation_1.WalletValidations.updateWalletStatusSchema), wallet_controller_1.WalletControllers.updateWalletStatus);
exports.WalletRoutes = router;

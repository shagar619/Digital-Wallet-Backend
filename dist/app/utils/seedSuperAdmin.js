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
exports.seedSuperAdmin = void 0;
/* eslint-disable no-console */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_1.UserModel.findOne({ email: "superAdmin@gmail.com" });
        if (isSuperAdminExist) {
            console.log("Super Admin already exists!");
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash("123456789", 10);
        const authProvider = {
            provider: "credentials",
            providerId: "superAdmin@gmail.com"
        };
        const payload = {
            name: "Super Admin",
            role: user_interface_1.Role.ADMIN,
            email: "superAdmin@gmail.com",
            password: hashedPassword,
            phone: "+8801608093455",
            address: "Dhaka",
            IsVerified: true,
            IsActive: user_interface_1.IsActive.ACTIVE,
            auths: [authProvider]
        };
        const superAdmin = yield user_model_1.UserModel.create(payload);
        console.log("Super Admin seeded successfully:", superAdmin.email);
    }
    catch (error) {
        console.log("Failed to seed Super Admin:", error);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;

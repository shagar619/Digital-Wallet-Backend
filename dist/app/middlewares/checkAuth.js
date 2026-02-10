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
exports.checkAuth = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const user_interface_1 = require("../modules/user/user.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../config/env");
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../modules/user/user.model");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get token from headers
        const accessToken = req.headers.authorization || req.cookies.accessToken;
        if (!accessToken) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized to access this route");
        }
        // Verify token
        const decoded = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        const isUserExist = yield user_model_1.UserModel.findOne({ email: decoded.email });
        if (!isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User does not exist");
        }
        if (isUserExist.IsActive === user_interface_1.IsActive.BLOCKED || isUserExist.IsActive === user_interface_1.IsActive.INACTIVE) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User is not allowed to access");
        }
        if (!isUserExist.IsVerified) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User is not verified");
        }
        if (!authRoles.includes(decoded.role)) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not allowed to access this route");
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;

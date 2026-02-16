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
exports.UserControllers = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const user_service_1 = require("./user.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const responseSender_1 = require("../../utils/responseSender");
const createUser = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.createUser(req.body);
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User created successfully!",
        data: result,
    });
}));
const updateUser = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const payload = req.body;
    const verifiedToken = req.user;
    const user = yield user_service_1.UserServices.updateUser(userId, payload, verifiedToken);
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Updated Successfully!",
        data: user,
    });
}));
const getAllUsers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Pass req.query directly to handle ?searchTerm=foo&page=1
    const result = yield user_service_1.UserServices.getAllUsers(req.query);
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Users Retrieved Successfully!",
        data: result.data,
        meta: result.meta, // Ensure meta is sent
    });
}));
const getAllAgents = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getAllAgents(req.query);
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Agents Retrieved Successfully!",
        data: result.data,
        meta: result.meta,
    });
}));
const getMyProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield user_service_1.UserServices.getMyProfile(decodedToken.userId);
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "My profile retrieved successfully!",
        data: result,
    });
}));
const deleteUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield user_service_1.UserServices.deleteUser(id);
    (0, responseSender_1.responseSender)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User deleted successfully",
        data: null,
    });
}));
exports.UserControllers = {
    createUser,
    updateUser,
    getAllUsers,
    getAllAgents,
    getMyProfile,
    deleteUser
};

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
exports.default = handler;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../app/config/env");
const app_1 = __importDefault(require("../app"));
// Prevent re-connecting on every function execution
let isConnected = false;
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!isConnected) {
                yield mongoose_1.default.connect(env_1.envVars.DB_URL);
                isConnected = true;
                console.log("Connected to MongoDB (Vercel Function)");
            }
            return (0, app_1.default)(req, res);
        }
        catch (error) {
            console.error("API Function Error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    });
}

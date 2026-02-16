"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const requiredEnvVariables = ["PORT", "DB_URL", "NODE_ENV", "BCRYPT_SALT_ROUND", "JWT_ACCESS_EXPIRES", "JWT_ACCESS_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", "EXPRESS_SESSION_SECRET", "GOOGLE_CLIENT_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CALLBACK_URL", "FRONTEND_URL"];
    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable! ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DB_URL: process.env.DB_URL,
        NODE_ENV: process.env.NODE_ENV,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
        ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        // ssl
        // SSL: {
        //      STORE_ID: process.env.SSL_STORE_ID as string,
        //      STORE_PASS: process.env.SSL_STORE_PASS as string,
        //      SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
        //      SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
        //      SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
        //      SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
        //      SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
        //      SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
        //      SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
        //      SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,
        //      SSL_IPN_URL: process.env.SSL_IPN_URL as string
        //      },
        // CLOUDINARY: {
        //      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
        //      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
        //      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
        //      },
        // EMAIL_SENDER: {
        //      SMTP_USER: process.env.SMTP_USER as string,
        //      SMTP_PASS: process.env.SMTP_PASS as string,
        //      SMTP_PORT: process.env.SMTP_PORT as string,
        //      SMTP_HOST: process.env.SMTP_HOST as string,
        //      SMTP_FROM: process.env.SMTP_FROM as string,
        // },
        // REDIS_HOST: process.env.REDIS_HOST as string,
        // REDIS_PORT: process.env.REDIS_PORT as string,
        // REDIS_USERNAME: process.env.REDIS_USERNAME as string,
        // REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    };
};
exports.envVars = loadEnvVariables();

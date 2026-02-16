"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionValidations = void 0;
const zod_1 = require("zod");
const sendMoneySchema = zod_1.z.object({
    receiverPhone: zod_1.z.string({ error: "Receiver phone is required" }),
    amount: zod_1.z.number().min(10, "Minimum amount is 10"),
    pin: zod_1.z.string().optional(), // In a real app, require PIN confirmation
});
const cashInSchema = zod_1.z.object({
    userPhone: zod_1.z.string({ error: "User phone is required" }),
    amount: zod_1.z.number().min(10, "Minimum amount is 10"),
});
const cashOutSchema = zod_1.z.object({
    amount: zod_1.z.number().min(10, "Minimum amount is 10"),
    agentPhone: zod_1.z.string({ error: "Agent phone is required" }),
    pin: zod_1.z.string(),
});
const withdrawSchema = zod_1.z.object({
    agentPhone: zod_1.z.string({ error: "Agent phone is required" }),
    amount: zod_1.z.number().min(50, "Minimum withdrawal amount is 50"), // Higher limit for cash out
    pin: zod_1.z.string().optional(), // Security PIN (Simulated)
});
exports.TransactionValidations = {
    sendMoneySchema,
    cashInSchema,
    cashOutSchema,
    withdrawSchema,
};

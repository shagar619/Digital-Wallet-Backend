"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletValidations = void 0;
const zod_1 = require("zod");
const updateWalletStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["ACTIVE", "BLOCKED"], {
        error: "Status is required (ACTIVE or FROZEN)",
    }),
});
exports.WalletValidations = {
    updateWalletStatusSchema,
};

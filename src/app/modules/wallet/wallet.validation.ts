// import { z } from "zod";

// export const WalletBalanceAddZodSchema = z.object({
//      user_id: z.string({ error: "User ID is required" }),
//      amount: z.number().nonnegative().default(0),
// });
// export const WalletBalanceWithdrawZodSchema = z.object({
//      agent_id: z.string({ error: "Agent ID is required" }),
//      amount: z.number().nonnegative().default(0),
// });
// export const WalletTransferZodSchema = z.object({
//      receiver_id: z.string({ error: "User ID is required" }),
//      amount: z.number().nonnegative().default(0),
// });










// Updated
import { z } from "zod";



const updateWalletStatusSchema = z.object({
     status: z.enum(["ACTIVE", "FROZEN"], {
     error: "Status is required (ACTIVE or FROZEN)",
     }),
});

export const WalletValidations = {
     updateWalletStatusSchema,
};
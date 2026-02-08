import { z } from "zod";


const updateWalletStatusSchema = z.object({
     status: z.enum(["ACTIVE", "BLOCKED"], {
     error: "Status is required (ACTIVE or FROZEN)",
     }),
});

export const WalletValidations = {
     updateWalletStatusSchema,
};
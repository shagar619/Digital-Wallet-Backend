import { z } from "zod";



const sendMoneySchema = z.object({
     receiverPhone: z.string({ error: "Receiver phone is required" }),
     amount: z.number().min(10, "Minimum amount is 10"),
     pin: z.string().optional(), // In a real app, require PIN confirmation
});

const cashInSchema = z.object({
     userPhone: z.string({ error: "User phone is required" }),
     amount: z.number().min(10, "Minimum amount is 10"),
});

const cashOutSchema = z.object({
     amount: z.number().min(10, "Minimum amount is 10"),
     agentPhone: z.string({ error: "Agent phone is required" }),
     pin: z.string(),
});


const withdrawSchema = z.object({
     agentPhone: z.string({ error: "Agent phone is required" }),
     amount: z.number().min(50, "Minimum withdrawal amount is 50"), // Higher limit for cash out
     pin: z.string().optional(), // Security PIN (Simulated)
});

export const TransactionValidations = {
     sendMoneySchema,
     cashInSchema,
     cashOutSchema,
     withdrawSchema,
};
// import { Types } from "mongoose";
// export enum TransactionType {
//      ADD = "ADD",
//      WITHDRAW = "WITHDRAW",
//      TRANSFER = "TRANSFER",
// }
// export enum TransactionStatus {
//      PENDING = "PENDING",
//      COMPLETED = "COMPLETED",
//      FAILED = "FAILED",
// }

// export interface ITransaction {
//      user: Types.ObjectId;
//      amount: number;
//      type: TransactionType;
//      status: TransactionStatus;
//      transaction_fee?:number;
// }

// export interface ITransactionCreateInput {
//      user: string;
//      agent: string;
//      amount: number;
//      type: TransactionType;
//      status: TransactionStatus;
//      transaction_fee?:number;
// }






// Updated
import { Types } from "mongoose";

export enum TransactionType {
     SEND_MONEY = "SEND_MONEY",
     CASH_IN = "CASH_IN",
     CASH_OUT = "CASH_OUT",
     DEPOSIT = "DEPOSIT",
     WITHDRAW = "WITHDRAW",
}

export interface ITransaction {
     transactionId: string;
     senderId: Types.ObjectId; // User ID
     receiverId?: Types.ObjectId; // User ID (Nullable for System transactions)
     amount: number;
     type: TransactionType;
     fee: number;
     reference?: string;
     status: "COMPLETED" | "FAILED";
     createdAt: Date;
}
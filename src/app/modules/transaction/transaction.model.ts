import { model, Schema } from "mongoose";
import { ITransaction, TransactionType } from "./transaction.interface";



const TransactionSchema = new Schema<ITransaction>(
{
     transactionId: { 
          type: String, 
          required: true, 
          unique: true 
     },
     senderId: { 
          type: Schema.Types.ObjectId, 
          ref: "User", 
          required: true 
     },
     receiverId: { 
          type: Schema.Types.ObjectId, 
          ref: "User" 
     },
     amount: { 
          type: Number, 
          required: true 
     },
     type: { 
          type: String, 
          enum: Object.values(TransactionType), 
          required: true 
     },
     fee: { 
          type: Number, 
          default: 0 
     },
     reference: { 
          type: String 
     },
     status: { 
          type: String, 
          enum: ["COMPLETED", "FAILED"], 
          default: "COMPLETED" 
     },
},
{    timestamps: true, 
     versionKey: false }
);

export const TransactionModel = model<ITransaction>("Transaction", TransactionSchema);
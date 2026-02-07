// import { Schema, model } from "mongoose";
// import {
//      ITransaction,
//      TransactionStatus,
//      TransactionType,
// } from "./transaction.interface";


// const transactionSchema = new Schema<ITransaction>(
// {
//      user: {
//           type: Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//      },
//      type: {
//           type: String,
//           enum: Object.values(TransactionType),
//           required: true,
//      },
//      amount: {
//           type: Number,
//           required: true,
//      },
//      transaction_fee: {
//           type: Number,
//           required: true,
//           default: 0,
//      },
//      status: {
//           type: String,
//           enum: Object.values(TransactionStatus),
//           default: TransactionStatus.PENDING,
//      },
// },
// {
//      timestamps: true,
//      versionKey: false,
// }
// );

// export const TransactionModel = model<ITransaction>(
//      "Transaction",
//      transactionSchema
// );















// Updated
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
import { Schema, model, Types } from "mongoose";
import { IWallet } from "./wallet.interface";

const WalletSchema = new Schema(
{
     user: { 
          type: Types.ObjectId, 
          ref: "User", required: 
          true, unique: true 
     },
     balance: { 
          type: Number, 
          default: 50 ,
          min: 0 // Prevent negative balance at DB level
     },
     status: { 
          type: String, 
          enum: ["ACTIVE", "BLOCKED"], 
          default: "ACTIVE" 
     },
},
{    timestamps: true, 
     versionKey: false 
}
);

export const WalletModel = model<IWallet>("Wallet", WalletSchema);
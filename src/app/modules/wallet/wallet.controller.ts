import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { asyncHandler } from "../../utils/asyncHandler";
import { responseSender } from "../../utils/responseSender";
import { JwtUserPayload } from "../../interfaces/JwtUserPayload.types";
import { WalletService } from "./wallet.service";



const getMylWallet = asyncHandler(async (req: Request, res: Response) => {

     const { _id: user_id } = req.user as JwtUserPayload;
     const result = await WalletService.getMylWallet(user_id);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Your Wallet Retrieved Successfully",
          data: result,
     });
});


const getAllWallet = asyncHandler(async (req: Request, res: Response) => {

     const result = await WalletService.getAllWallet();

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "All Transaction Retrieved Successfully",
          data: result,
});
});




const addMoney = asyncHandler(async (req: Request, res: Response) => {

     const { _id: agent_id } = req.user as JwtUserPayload;
     const { user_id, amount } = req.body;
     const result = await WalletService.addMoney(agent_id, user_id, amount);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Money added successfully",
          data: result,
});
});



const withdrawMoney = asyncHandler(async (req: Request, res: Response) => {

     const { _id: user_id } = req.user as JwtUserPayload;
     const { agent_id, amount } = req.body;
     const result = await WalletService.withdrawMoney(user_id, agent_id, amount);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Money withdraw successfully",
          data: result,
});
});




const transferMoney = asyncHandler(async (req: Request, res: Response) => {
     const { _id: sender_id } = req.user as JwtUserPayload;
     const { receiver_id, amount } = req.body;
     const result = await WalletService.transferMoney(
          sender_id,
          receiver_id,
          amount
);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Money transfer successfully",
          data: result,
});
});




const updateWallet = asyncHandler(async (req: Request, res: Response) => {

     const userId = req.params.id;
     const payload = req.body;
     const result = await WalletService.updateWallet(userId, payload);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Wallet Updated Successfully",
          data: result,
});
});




export const WalletControllers = {
     addMoney,
     withdrawMoney,
     getMylWallet,
     getAllWallet,
     transferMoney,
     updateWallet,
};
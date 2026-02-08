import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { JwtPayload } from "jsonwebtoken";
import { WalletServices } from "./wallet.service";
import { responseSender } from "../../utils/responseSender";
import httpStatus from "http-status-codes";




const getMyBalance = asyncHandler(async (req: Request, res: Response) => {

     const user = req.user as JwtPayload;
     const result = await WalletServices.getMyBalance(user.userId);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Balance retrieved",
          data: result,
     });
});



const getAllWallets = asyncHandler(async (req: Request, res: Response) => {

     const result = await WalletServices.getAllWallets(req.query);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "All wallets retrieved successfully",
          meta: result.meta,
          data: result.data,
     });
});



const updateWalletStatus = asyncHandler(async (req: Request, res: Response) => {

     const { id } = req.params;
     const { status } = req.body;

     const result = await WalletServices.updateWalletStatus(id, status);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: `Wallet status updated to ${status}`,
          data: result,
     });
});



export const WalletControllers = { 
     getMyBalance,
     getAllWallets,
     updateWalletStatus
};
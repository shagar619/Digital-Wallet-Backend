/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { TransactionService } from "./transaction.service";
import { JwtUserPayload } from "../../interfaces/JwtUserPayload.types";
import { asyncHandler } from "../../utils/asyncHandler";
import { responseSender } from "../../utils/responseSender";

const getAllTransactionByUserID = asyncHandler(async (req: Request, res: Response) => {

     const { userId: user_id } = req.user as JwtUserPayload;
     const result = await TransactionService.getAllTransactionByUserID(user_id);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "All Transaction Retrieved Successfully",
          data: result,
     });
}
);



const getAllTransaction = asyncHandler(async (req: Request, res: Response) => {

     const result = await TransactionService.getAllTransaction();

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "All Transaction Retrieved Successfully",
          data: result,
});
});

export const transactionControllers = {
     getAllTransaction,
     getAllTransactionByUserID
};
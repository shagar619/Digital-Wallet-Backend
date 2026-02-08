import httpStatus from "http-status-codes";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { TransactionServices } from "./transaction.service";
import { responseSender } from "../../utils/responseSender";



const sendMoney = asyncHandler(async (req: Request, res: Response) => {

     const user = req.user as JwtPayload;
     const result = await TransactionServices.sendMoney(user.userId, req.body);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Money sent successfully",
          data: result,
     });
});

const cashIn = asyncHandler(async (req: Request, res: Response) => {

     const agent = req.user as JwtPayload;
     const result = await TransactionServices.cashIn(agent.userId, req.body);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Cash In successful",
          data: result,
     });
});

const withdraw = asyncHandler(async (req: Request, res: Response) => {

     const user = req.user as JwtPayload;
     const result = await TransactionServices.withdraw(user.userId, req.body);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Withdrawal successful",
          data: result,
     });
});

const getMyTransactions = asyncHandler(async (req: Request, res: Response) => {

     const user = req.user as JwtPayload;

     // Update: Pass 'req.query' so filters (type, limit) work
     const result = await TransactionServices.getMyTransactions(user.userId, req.query);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "History retrieved successfully",
          data: result,
     });
});

const getAdminAnalytics = asyncHandler(async (req: Request, res: Response) => {

     const result = await TransactionServices.getSystemStats();

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Analytics retrieved",
          data: result,
     });
});

export const TransactionControllers = {
     sendMoney,
     cashIn,
     withdraw,
     getMyTransactions,
     getAdminAnalytics
};
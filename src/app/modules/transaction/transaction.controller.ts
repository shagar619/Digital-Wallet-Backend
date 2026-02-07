// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { NextFunction, Request, Response } from "express";
// import httpStatus from "http-status-codes";
// import { TransactionService } from "./transaction.service";
// import { JwtUserPayload } from "../../interfaces/JwtUserPayload.types";
// import { asyncHandler } from "../../utils/asyncHandler";
// import { responseSender } from "../../utils/responseSender";

// const getAllTransactionByUserID = asyncHandler(async (req: Request, res: Response) => {

//      const { _id: user_id } = req.user as JwtUserPayload;
//      const result = await TransactionService.getAllTransactionByUserID(user_id);

//      responseSender(res, {
//           success: true,
//           statusCode: httpStatus.OK,
//           message: "All Transaction Retrieved Successfully",
//           data: result,
//      });
// }
// );



// const getAllTransaction = asyncHandler(async (req: Request, res: Response) => {

//      const result = await TransactionService.getAllTransaction();

//      responseSender(res, {
//           success: true,
//           statusCode: httpStatus.OK,
//           message: "All Transaction Retrieved Successfully",
//           data: result,
// });
// });

// export const transactionControllers = {
//      getAllTransaction,
//      getAllTransactionByUserID
// };



















// Updated
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
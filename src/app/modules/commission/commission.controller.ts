import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtUserPayload } from "../../interfaces/JwtUserPayload.types";
import { CommissionService } from "./commission.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { responseSender } from "../../utils/responseSender";



const getAllCommissionByUserID = asyncHandler(async (req: Request, res: Response) => {

     const { _id: user_id } = req.user as JwtUserPayload;
     const result = await CommissionService.getAllCommissionByUserID(user_id);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "All Commission Retrieved Successfully",
          data: result,
     });
}
);



const getAllCommission = asyncHandler(async (req: Request, res: Response) => {

     const result = await CommissionService.getAllCommission();

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "All Commission Retrieved Successfully",
          data: result,
});
});

export const commissionControllers = {
     getAllCommissionByUserID,
     getAllCommission,
};
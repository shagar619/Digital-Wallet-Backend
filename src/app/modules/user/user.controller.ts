import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { UserServices } from "./user.service";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { responseSender } from "../../utils/responseSender";


     const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

     const result = await UserServices.createUser(req.body);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.CREATED,
          message: "User created successfully",
          data: result,
     });
}
);



     const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

     const userId = req.params.id;
     const payload = req.body;
     const verifiedToken = req.user;

     const user = await UserServices.updateUser(
          userId,
          payload,
          verifiedToken as JwtPayload
     );

     responseSender(res, {
          success: true,
          statusCode: httpStatus.CREATED,
          message: "User Updated Successfully",
          data: user,
     });
}
);

     const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

     const result = await UserServices.getAllUsers();

     responseSender(res, {
          success: true,
          statusCode: httpStatus.CREATED,
          message: "All Users Retrieved Successfully",
          data: result.data,
          meta: result.meta,
     });
}
);


     const getAllAgents = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

     const result = await UserServices.getAllAgents();
     responseSender(res, {
          success: true,
          statusCode: httpStatus.CREATED,
          message: "All Agents Retrieved Successfully",
          data: result.data,
          meta: result.meta,
     });
}
);

export const UserControllers = {
     createUser,
     updateUser,
     getAllUsers,
     getAllAgents,
};
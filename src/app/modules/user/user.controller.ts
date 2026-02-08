/* eslint-disable @typescript-eslint/no-unused-vars */
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
          message: "User created successfully!",
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
          statusCode: httpStatus.OK,
          message: "User Updated Successfully!",
          data: user,
     });
}
);



const getAllUsers = asyncHandler(async (req: Request, res: Response) => {

     // Pass req.query directly to handle ?searchTerm=foo&page=1
     const result = await UserServices.getAllUsers(req.query);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "All Users Retrieved Successfully!",
          data: result.data,
          meta: result.meta, // Ensure meta is sent
     });
});



const getAllAgents = asyncHandler(async (req: Request, res: Response) => {

     const result = await UserServices.getAllAgents(req.query);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "All Agents Retrieved Successfully!",
          data: result.data,
          meta: result.meta,
     });
});



const getMyProfile = asyncHandler(async (req: Request, res: Response) => {

     const decodedToken = req.user as JwtPayload;

     const result = await UserServices.getMyProfile(decodedToken.userId);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "My profile retrieved successfully!",
          data: result,
     });
});




const deleteUser = asyncHandler(async (req: Request, res: Response) => {

     const { id } = req.params;

     await UserServices.deleteUser(id);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "User deleted successfully",
          data: null,
     });
});



export const UserControllers = {
     createUser,
     updateUser,
     getAllUsers,
     getAllAgents,
     getMyProfile,
     deleteUser
};
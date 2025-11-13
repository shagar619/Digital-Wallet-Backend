import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { IsActive } from "../modules/user/user.interface";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { UserModel } from "../modules/user/user.model";


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

     try {

          // Get token from headers
          const accessToken = req.headers.authorization || req.cookies.accessToken;

          if(!accessToken) {
               throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to access this route");
          }

          // Verify token
          const decoded = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;


          const isUserExist = await UserModel.findOne({ email: decoded.email });

          if (!isUserExist) {
               throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
          }

          if(isUserExist.IsActive === IsActive.BLOCKED || isUserExist.IsActive === IsActive.INACTIVE) {
               throw new AppError(httpStatus.UNAUTHORIZED, "User is not allowed to access");
          }
          

          if (!isUserExist.IsVerified) {
               throw new AppError(httpStatus.UNAUTHORIZED, "User is not verified");
          }


          if(!authRoles.includes(decoded.role)) {
               throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to access this route");
          }

          req.user = decoded;
          next();

     } catch(error) {
          next(error);
     }
}
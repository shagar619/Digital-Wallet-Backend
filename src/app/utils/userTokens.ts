import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { UserModel } from "../modules/user/user.model";


export const createUserTokens = (user: Partial<IUser>) => {

     const jwtPayload = {
          userId: user._id,
          email: user.email,
          role: user.role
          }
     
          const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
     
          const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

          return {
               accessToken,
               refreshToken
          }
}


export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {

     const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

     const isUserExist = await UserModel.findOne({ email: verifiedRefreshToken.email });

     if (!isUserExist) {
          throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
     }

     if(isUserExist.IsActive === IsActive.BLOCKED || isUserExist.IsActive === IsActive.INACTIVE) {
          throw new AppError(httpStatus.UNAUTHORIZED, "User is not allowed to access");
     }

     const jwtPayload = {
          userId: isUserExist._id,
          email: isUserExist.email,
          role: isUserExist.role
     }

     const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);

     return accessToken;
}
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { responseSender } from "../../utils/responseSender";
import { createUserTokens } from "../../utils/userTokens";
import AppError from "../../errorHelpers/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import passport from "passport";
import httpStatus from "http-status-codes";
import { setAuthCookie } from "../../utils/setCookie";
import { AuthService } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";


// Manually handle login with email and password

const credentialsLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

     const loginInfo = await AuthService.credentialsLogin(req.body);


     res.cookie("accessToken", loginInfo.accessToken, {
     httpOnly: true,
     secure: false
     });

     res.cookie("refreshToken", loginInfo.refreshToken, {
     httpOnly: true,
     secure: false,
     });


     // OR,
     // setAuthCookie(res, loginInfo);


     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "User Logged In Successfully",
          data: loginInfo
     });
})




// const credentialsLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

//      passport.authenticate("local", async (err: any, user: any, info: any) => {

//           if (err) {
//                return next(new AppError(httpStatus.UNAUTHORIZED, err));
//           }

//           if (!user) {
//                return next(new AppError(httpStatus.UNAUTHORIZED, info.message || "Login failed"));
//           }

//           const  userTokens = await createUserTokens(user);


//           // delete user.toObject().password

//           // OR,
//           const { password: pass, ...rest } = user.toObject();

//           // Set cookies
//           setAuthCookie(res, userTokens);

//           responseSender(res, {
//                success: true,
//                statusCode: httpStatus.OK,
//                message: "User Logged In Successfully",
//                data: {
//                     accessToken: userTokens.accessToken,
//                     refreshToken: userTokens.refreshToken,
//                     user: rest
//                }
//           })
//      })(req, res, next);
// })




const getNewAccessToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
     
     const refreshToken = req.cookies.refreshToken;

     if(!refreshToken) {
          throw new AppError(httpStatus.UNAUTHORIZED, "Please provide refresh token");
     }

     const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string);

     // res.cookie("accessToken", tokenInfo.accessToken, {
     //     httpOnly: true,
     //     secure: false
     // })

     setAuthCookie(res, tokenInfo);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "New access token generated successfully",
          data: tokenInfo
     });

})




const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

     res.clearCookie("accessToken", {
          httpOnly: true,
          secure: false,
          sameSite: "lax"
     })

     res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: false,
          sameSite: "lax"
     })

     responseSender(res, {
          success: true,
          statusCode: httpStatus.ACCEPTED,
          message: "User logged out successfully!",
          data: null
     });

});



const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

     const decodedToken = req.user;

     await AuthService.resetPassword(req.body, decodedToken as JwtPayload);

     responseSender(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Password Changed Successfully",
          data: null,
     });
});



const googleCallbackController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

     let redirectTo = req.query.state ? req.query.state as string : "/";

     if (redirectTo.startsWith("/")) {
          redirectTo = redirectTo.slice(1);
     }

     const user = req.user;

     if (!user) {
          throw new AppError(httpStatus.UNAUTHORIZED, "Google authentication failed");
     }

     const tokenInfo = createUserTokens(user);

     setAuthCookie(res, tokenInfo);

     res.redirect(`${envVars.FRONTEND_URL || "http://localhost:5173"}/${redirectTo}`);

})







export const AuthControllers = {
     credentialsLogin,
     getNewAccessToken,
     logout,
     resetPassword,
     googleCallbackController
}
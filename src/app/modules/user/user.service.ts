/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { UserModel } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { WalletModel } from "../wallet/wallet.model";
import { JwtPayload } from "jsonwebtoken";
import { userSearchableFields } from "./user.constant";


const createUser = async (payload: Partial<IUser>) => {

     const { email, password, role = "USER", ...rest } = payload;

     if (!email || !password) {
          throw new AppError(
          httpStatus.BAD_REQUEST,
          "Email and password are required."
     );
}

     const isUserExist = await UserModel.findOne({ email });

     if (isUserExist) {
          throw new AppError(httpStatus.BAD_REQUEST, "User already exists!");
     }

     const hashedPassword = await bcryptjs.hash(
     password,
     Number(envVars.BCRYPT_SALT_ROUND) || 10
     );

     const authProvider: IAuthProvider = {
          provider: "credentials",
          providerId: email,
     };

     const user = await UserModel.create({
          email,
          password: hashedPassword,
          role,
          auths: [authProvider],
          IsActive: "ACTIVE",
          IsVerified: true,
          ...rest,
     });

     // Create wallet with initial balance 100BDT
     await WalletModel.create({
          user: user._id,
          balance: 100,
          status: "ACTIVE",
     });

     return user;
};




const updateUser = async (
     userId: string,
     payload: Partial<IUser>,
     decodedToken: JwtPayload) => {

     const ifUserExist = await UserModel.findById(userId);

     if (!ifUserExist) {
          throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
     }

     if (payload.role) {
          if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
          throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
     }

     if (payload.role === Role.ADMIN && decodedToken.role === Role.ADMIN) {
          throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
     }
     }

     if (payload.IsActive || payload.IsVerified) {
     if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
          throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
     }
     }

     if (payload.password) {
          payload.password = await bcryptjs.hash(
          payload.password,
          Number(envVars.BCRYPT_SALT_ROUND) || 10
     );
}

     const newUpdatedUser = await UserModel.findByIdAndUpdate(userId, payload, {
     new: true,
     runValidators: true,
     });

     return newUpdatedUser;
};








const getAllUsers = async (query: Record<string, unknown>) => {

     const { searchTerm, page = 1, limit = 10 } = query;

     const pageNumber = Number(page);
     const limitNumber = Number(limit);
     const skip = (pageNumber - 1) * limitNumber;

     const andConditions: any[] = [{ role: "USER" }]; // Base filter

     // Search Logic
     if (searchTerm) {
     andConditions.push({
     $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" }, // Case-insensitive regex
     })),
     });
}

     const whereConditions = { $and: andConditions };

     // Database Queries
     const result = await UserModel.find(whereConditions)
     .sort({ createdAt: -1 }) // Newest first
     .skip(skip)
     .limit(limitNumber);

     const total = await UserModel.countDocuments(whereConditions);

     return {
     meta: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPage: Math.ceil(total / limitNumber),
     },
     data: result,
     };
};




const getAllAgents = async (query: Record<string, unknown>) => {

     const { searchTerm, page = 1, limit = 10 } = query;

     const pageNumber = Number(page);
     const limitNumber = Number(limit);
     const skip = (pageNumber - 1) * limitNumber;

     const andConditions: any[] = [{ role: "AGENT" }]; // Base filter

     if (searchTerm) {
     andConditions.push({
     $or: userSearchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
     })),
     });
}

     const whereConditions = { $and: andConditions };

     const result = await UserModel.find(whereConditions)
     .sort({ createdAt: -1 })
     .skip(skip)
     .limit(limitNumber);

     const total = await UserModel.countDocuments(whereConditions);

     return {
     meta: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPage: Math.ceil(total / limitNumber),
     },
     data: result,
};
};




const getMyProfile = async (userId: string) => {

     const user = await UserModel.findById(userId).select("-password");

     if (!user) {
     throw new AppError(httpStatus.NOT_FOUND, "User not found");
     }

     return user;
};




const deleteUser = async (userId: string) => {

     const user = await UserModel.findById(userId);

     if (!user) {
     throw new AppError(httpStatus.NOT_FOUND, "User not found");
     }

     // Delete the User
     await UserModel.findByIdAndDelete(userId);

     // Delete associated Wallet (Data Integrity)
     await WalletModel.findOneAndDelete({ user: userId });

     return null;
};




export const UserServices = {
     createUser,
     updateUser,
     getAllUsers,
     getAllAgents,
     getMyProfile,
     deleteUser
};
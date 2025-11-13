import { Types } from "mongoose";

export enum Role {
     ADMIN = "ADMIN",
     USER = "USER",
     AGENT = "AGENT",
}

export interface IAuthProvider {
     provider: "google" | "credentials";
     providerId: string;
}

export enum IsActive {
     ACTIVE = "ACTIVE",
     INACTIVE = "INACTIVE",
     BLOCKED = "BLOCKED",
}

export interface IUser {
     _id?: Types.ObjectId;
     name: string;
     email: string;
     phone: string;
     address: string;
     password: string;
     profilePhoto?: string;
     shortBio?: string; 
     auths?: IAuthProvider[];
     IsActive: IsActive;
     IsVerified: boolean;
     role: Role;
}
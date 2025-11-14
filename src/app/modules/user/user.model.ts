import { Schema, model } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const AuthProviderSchema = new Schema<IAuthProvider>(
     {
     provider: {
          type: String,
          enum: ["google", "credentials"],
          required: true,
     },
     providerId: {
          type: String,
          required: true,
     },
},
{    _id: false,
     versionKey: false
}
);

const UserSchema = new Schema<IUser>(
{
     name: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     phone: { type: String, required: false, unique: true },
     address: { type: String, required: false },
     password: { type: String, required: true },
     profilePhoto: { type: String },
     shortBio: { type: String },
     auths: [AuthProviderSchema],
     IsActive: {
          type: String,
          enum: Object.values(IsActive),
          default: IsActive.ACTIVE,
     },
     role: {
          type: String,
          enum: Object.values(Role),
          default: Role.USER,
     },
     IsVerified: { type: Boolean, default: false },
     },
{
     timestamps: true,
     versionKey:false,
}
);

export const UserModel = model<IUser>("User", UserSchema);
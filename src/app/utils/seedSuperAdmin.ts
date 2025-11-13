import bcryptjs from "bcryptjs";
import { UserModel } from "../modules/user/user.model";
import { envVars } from "../config/env";
import { IAuthProvider, IsActive, IUser, Role } from "../modules/user/user.interface";

export const seedSuperAdmin = async () => {

     try {

     const isSuperAdminExist = await UserModel.findOne({ email: envVars.ADMIN_EMAIL });
          
     if (isSuperAdminExist) {
          console.log("Super Admin already exists!");
          return;
     }

     const hashedPassword = await bcryptjs.hash(envVars.ADMIN_PASSWORD, 10);

     const authProvider : IAuthProvider = {
          provider: "credentials",
          providerId: envVars.ADMIN_EMAIL
     }

     const payload: IUser = {
          name: "Super Admin",
          role: Role.ADMIN,
          email: envVars.ADMIN_EMAIL,
          password: hashedPassword,
          phone: "+8801608093455",
          address: "Dhaka",
          IsVerified: true,
          IsActive: IsActive.ACTIVE,
          auths: [authProvider]
     }

     const superAdmin = await UserModel.create(payload);
     // console.log("Super Admin seeded successfully:", superAdmin.email);

     } catch(error) {
          console.log("Failed to seed Super Admin:", error);
     }
}
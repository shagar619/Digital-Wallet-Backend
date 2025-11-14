/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { UserModel } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { envVars } from "./env";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";



passport.use(
     new LocalStrategy({
          usernameField: "email",
          passwordField: "password"
     }, async (email: string, password: string, done) => {
          try {

               const isUserExist = await UserModel.findOne({ email });

               if (!isUserExist) {
                    return done("User doesn't exist!");
               }

               // if (!isUserExist.IsVerified) {
               //      return done("User is not verified!");
               // }

               if (isUserExist.IsActive === IsActive.BLOCKED || isUserExist.IsActive === IsActive.INACTIVE) {
                    return done(`User is ${isUserExist.IsActive}`);
               }

               // if (isUserExist.isDeleted) {
               //      return done("User is deleted!")
               // }



               const isGoogleAuthenticated = isUserExist.auths?.some(auth => auth.provider === "google");

               if (isGoogleAuthenticated && !isUserExist.password) {
                    return done(null, false, { message: "Please login using Google OAuth" });
               }

               const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string || "");

               if (!isPasswordMatched) {
                    return done(null, false, { message: "Invalid email or password" });
               }

               return done(null, isUserExist);

          } catch (error) {
               done(error)
          }
     } 
)
)





passport.use(
     new GoogleStrategy(
          {
               clientID: envVars.GOOGLE_CLIENT_ID,
               clientSecret: envVars.GOOGLE_CLIENT_SECRET,
               callbackURL: envVars.GOOGLE_CALLBACK_URL
          }, async(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
               try {
                    
                    const email = profile.emails?.[0].value;

                    if (!email) {
                         return done(null, false, { message: "No email found in Google profile" });
                    }

                    let user = await UserModel.findOne({ email });

                    if (user && !user.IsVerified) {
                         return done(null, false, { message: "User is not verified!" })
                    }

                    if (user && (user.IsActive === IsActive.BLOCKED || user.IsActive === IsActive.INACTIVE)) {
                         return done(`User is ${user.IsActive}`)
                    }

                    // if (user && user.isDeleted) {
                    //      return done(null, false, { message: "User is deleted!" })
                    // }

                    if (!user) {
                         user = await UserModel.create({
                              email,
                              name: profile.displayName,
                              profilePhoto: profile.photos?.[0].value,
                              role: Role.USER,
                              IsVerified: true,
                              IsActive: true,
                              auths: [{
                                   provider: "google",
                                   providerId: profile.id
                              }]
                         })
                    }

                    return done(null, user);


               } catch (error) {
                    return done(error);
               }
          }
     )
)



passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
     done(null, user._id);
});

passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
     try {
          const user = await UserModel.findById(id);
          done(null, user);
     } catch (error) {
          done(error);
     }
});
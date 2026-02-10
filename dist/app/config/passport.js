"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport_1 = __importDefault(require("passport"));
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const env_1 = require("./env");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password"
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isUserExist = yield user_model_1.UserModel.findOne({ email });
        if (!isUserExist) {
            return done("User doesn't exist!");
        }
        // if (!isUserExist.IsVerified) {
        //      return done("User is not verified!");
        // }
        if (isUserExist.IsActive === user_interface_1.IsActive.BLOCKED || isUserExist.IsActive === user_interface_1.IsActive.INACTIVE) {
            return done(`User is ${isUserExist.IsActive}`);
        }
        // if (isUserExist.isDeleted) {
        //      return done("User is deleted!")
        // }
        const isGoogleAuthenticated = (_a = isUserExist.auths) === null || _a === void 0 ? void 0 : _a.some(auth => auth.provider === "google");
        if (isGoogleAuthenticated && !isUserExist.password) {
            return done(null, false, { message: "Please login using Google OAuth" });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExist.password || "");
        if (!isPasswordMatched) {
            return done(null, false, { message: "Invalid email or password" });
        }
        return done(null, isUserExist);
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { message: "No email found in Google profile" });
        }
        let user = yield user_model_1.UserModel.findOne({ email });
        if (user && !user.IsVerified) {
            return done(null, false, { message: "User is not verified!" });
        }
        if (user && (user.IsActive === user_interface_1.IsActive.BLOCKED || user.IsActive === user_interface_1.IsActive.INACTIVE)) {
            return done(`User is ${user.IsActive}`);
        }
        // if (user && user.isDeleted) {
        //      return done(null, false, { message: "User is deleted!" })
        // }
        if (!user) {
            user = yield user_model_1.UserModel.create({
                email,
                name: profile.displayName,
                profilePhoto: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                role: user_interface_1.Role.USER,
                IsVerified: true,
                IsActive: true,
                auths: [{
                        provider: "google",
                        providerId: profile.id
                    }]
            });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.UserModel.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));

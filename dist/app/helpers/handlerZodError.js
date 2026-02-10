"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerZodError = void 0;
const handlerZodError = (err) => {
    const errorSources = [];
    err.issues.forEach((issue) => {
        errorSources.push({
            path: issue.path.join('.'),
            message: issue.message
        });
    });
    return {
        statusCode: 400,
        message: "Zod validation error",
        errorSources
    };
};
exports.handlerZodError = handlerZodError;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerValidationError = void 0;
const handlerValidationError = (err) => {
    const errorSources = [];
    const errors = Object.values(err.errors);
    errors.forEach((el) => errorSources.push({
        path: el.path,
        message: el.message
    }));
    return {
        statusCode: 400,
        message: "Validation error",
        errorSources
    };
};
exports.handlerValidationError = handlerValidationError;

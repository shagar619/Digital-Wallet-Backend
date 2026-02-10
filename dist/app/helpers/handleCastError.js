"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (err) => {
    return {
        statusCode: 400,
        message: `Invalid ${err.path}: ${err.value}`,
        errorSources: [
            {
                path: err.path,
                message: `Invalid ${err.path}: ${err.value}`
            }
        ]
    };
};
exports.handleCastError = handleCastError;

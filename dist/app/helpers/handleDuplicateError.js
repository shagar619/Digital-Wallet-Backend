"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerDuplicateError = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlerDuplicateError = (err) => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 409,
        message: matchedArray ? `Duplicate value for field: ${matchedArray[1]}` : "Duplicate field value",
        errorSources: matchedArray
            ? [
                {
                    path: matchedArray[1],
                    message: `Duplicate value for field: ${matchedArray[1]}`
                }
            ]
            : []
    };
};
exports.handlerDuplicateError = handlerDuplicateError;

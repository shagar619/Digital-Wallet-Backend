"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseSender = void 0;
const responseSender = (res, data) => {
    res.status(data.statusCode).json({
        statusCode: data.statusCode,
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data
    });
};
exports.responseSender = responseSender;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonSerializer = {
    contentType: "application/json",
    serialize: params => JSON.stringify(params),
};

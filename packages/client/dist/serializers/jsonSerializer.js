"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates a stringified array of all params. Can't handle files!
 */
exports.jsonSerializer = {
    contentType: "application/json",
    serialize: params => JSON.stringify(params),
};

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
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
exports.axiosXHR = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const onProgress = (callback) => (event) => callback(event.loaded / event.total);
    const config = {
        url: options.endpoint,
        method: "post",
        headers: {
            "X-RPC-Procedure": options.procedure,
            "Content-Type": options.contentType,
        },
        data: options.data,
        onDownloadProgress: onProgress(options.onDownloadProgress),
        onUploadProgress: onProgress(options.onUploadProgress),
    };
    try {
        const result = yield axios_1.default.request(config);
        return {
            type: "success",
            code: result.status,
            data: result.data,
        };
    }
    catch (e) {
        // error response
        if (e.response) {
            return {
                type: "fail",
                code: e.response.status,
                error: e.response.data,
            };
        }
        // something went totally wrong
        return {
            type: "fail",
            code: 500,
            error: e.message,
        };
    }
});

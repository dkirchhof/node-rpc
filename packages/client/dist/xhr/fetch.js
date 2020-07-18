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
const getData = (response) => {
    const contentType = response.headers.get("content-type");
    if (!contentType) {
        return;
    }
    if (contentType.includes("text/html")) {
        return response.text();
    }
    if (contentType.includes("application/json")) {
        return response.json();
    }
    throw new Error(`Content type "${contentType}" not implemented.`);
};
exports.fetchXHR = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const config = {
        method: "post",
        headers: {
            "Authorization": options.auth,
            "Content-Type": options.contentType,
            "X-RPC-Procedure": options.procedure.toString(),
        },
        body: options.data,
    };
    try {
        const result = yield fetch(options.endpoint, config);
        const data = yield getData(result);
        if (!result.ok) {
            throw {
                data,
                status: result.status,
            };
        }
        return {
            type: "success",
            code: result.status,
            data,
        };
    }
    catch (e) {
        if (e.data) {
            return {
                type: "fail",
                code: e.status,
                error: e.data,
            };
        }
        // something went totally wrong
        return {
            type: "fail",
            code: 400,
            error: e.message,
        };
    }
});

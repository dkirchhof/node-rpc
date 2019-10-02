"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class API {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.cachedMaybes = new Map();
        this.cachedResponses = new Map();
    }
    /**
     * @deprecated
     */
    call(options) {
        return async (procedure, ...params) => {
            const data = toFormData(params);
            const requestConfig = {
                url: this.endpoint,
                method: "post",
                headers: { "X-RPC-Procedure": procedure },
                data,
            };
            if (options && options.onProgress) {
                requestConfig.onUploadProgress = event => options.onProgress(event.loaded / event.total);
            }
            const response = await request(requestConfig);
            if (response.code < 400) {
                const result = {
                    type: "success",
                    code: response.code,
                    data: response.data,
                };
                return result;
            }
            else {
                const result = {
                    type: "fail",
                    code: response.code,
                    error: response.error,
                };
                return result;
            }
        };
    }
    /**
     * @deprecated
     */
    callCached(options) {
        return async (procedure, ...params) => {
            const hash = createHash(JSON.stringify({ procedure, params }));
            const fromCache = this.cachedResponses.get(hash);
            const now = new Date().getTime();
            if (!fromCache || now - fromCache.date > options.cacheTime) {
                const response = await this.call(options)(procedure, ...params);
                if (response.type === "success") {
                    this.cachedResponses.set(hash, { date: now, response });
                }
                return response;
            }
            else {
                return fromCache.response;
            }
        };
    }
    /**
     * @deprecated
     */
    callMaybe(options) {
        return async (procedure, ...params) => {
            const hash = createHash(JSON.stringify({ procedure, params }));
            const fromCache = this.cachedMaybes.get(hash);
            const now = new Date().getTime();
            if (!fromCache || now - fromCache.date > options.cacheTime) {
                const response = await this.call(options)(procedure, ...params);
                if (response.type === "success") {
                    this.cachedMaybes.set(hash, { date: now });
                }
                return response;
            }
            else {
                const response = {
                    type: "noCall",
                };
                return response;
            }
        };
    }
    createRequest(procedure, ...params) {
        const call = async (options) => {
            const data = toFormData(params);
            const requestConfig = {
                url: this.endpoint,
                method: "post",
                headers: { "X-RPC-Procedure": procedure },
                data,
            };
            if (options && options.onProgress) {
                requestConfig.onUploadProgress = event => options.onProgress(event.loaded / event.total);
            }
            const response = await request(requestConfig);
            if (response.code < 400) {
                const result = {
                    type: "success",
                    code: response.code,
                    data: response.data,
                };
                return result;
            }
            else {
                const result = {
                    type: "fail",
                    code: response.code,
                    error: response.error,
                };
                return result;
            }
        };
        const callCached = async (options) => {
            const hash = createHash(JSON.stringify({ procedure, params }));
            const fromCache = this.cachedResponses.get(hash);
            const now = new Date().getTime();
            if (!fromCache || now - fromCache.date > options.cacheTime) {
                const response = await call(options);
                if (response.type === "success") {
                    this.cachedResponses.set(hash, { date: now, response });
                }
                return response;
            }
            else {
                return fromCache.response;
            }
        };
        const callMaybe = async (options) => {
            const hash = createHash(JSON.stringify({ procedure, params }));
            const fromCache = this.cachedMaybes.get(hash);
            const now = new Date().getTime();
            if (!fromCache || now - fromCache.date > options.cacheTime) {
                const response = await call(options);
                if (response.type === "success") {
                    this.cachedMaybes.set(hash, { date: now });
                }
                return response;
            }
            else {
                const response = {
                    type: "noCall",
                };
                return response;
            }
        };
        return {
            call, callCached, callMaybe,
        };
    }
}
exports.API = API;
function toFormData(params) {
    const data = new FormData();
    const undefinedReplacer = (_, v) => v === undefined ? null : v;
    params.forEach((p, i) => {
        const key = i.toString();
        if (p instanceof FileList) {
            if (p.length === 0) {
                data.append(key, "null");
            }
            else {
                [...p].forEach(file => data.append(key, file));
            }
        }
        else if (p instanceof File) {
            data.append(key, p);
        }
        else {
            data.append(key, JSON.stringify(p, undefinedReplacer));
        }
    });
    return data;
}
async function request(config) {
    try {
        const result = await axios_1.default.request(config);
        return {
            code: result.status,
            data: result.data,
        };
    }
    catch (e) {
        if (e.response) {
            return {
                code: e.response.status,
                error: e.response.data,
            };
        }
        else {
            return {
                code: 500,
                error: e.message,
            };
        }
    }
}
function createHash(str) {
    let h = 5381;
    let i = str.length;
    while (i) {
        h = (h * 33) ^ str.charCodeAt(--i);
    }
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return h >>> 0;
}

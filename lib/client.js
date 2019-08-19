"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class API {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }
    call(procedure, ...params) {
        return new RPC(this.endpoint, procedure, params);
    }
}
exports.API = API;
class RPC {
    constructor(endpoint, procedure, params) {
        this.progressCallbacks = [];
        const data = toFormData(params);
        this.promise = axios_1.default.request({
            url: endpoint,
            method: "post",
            headers: { "X-RPC-Procedure": procedure },
            data,
            onUploadProgress: event => this.progressCallbacks.forEach(callback => callback(event.loaded / event.total)),
        });
    }
    onSuccess(callback) {
        this.promise
            .then((response) => callback(response.data))
            .catch(() => { });
        return this;
    }
    onFailure(callback) {
        this.promise.catch((error) => callback(error.response.data));
        return this;
    }
    onProgress(callback) {
        this.progressCallbacks.push(callback);
        return this;
    }
}
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

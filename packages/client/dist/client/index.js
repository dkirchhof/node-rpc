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
const hash_1 = require("../utils/hash");
const nullOp = () => { };
const noResponse = { type: "noResponse" };
function createCallFn(clientOptions, cache) {
    return (procedure, params) => {
        return (options = {}) => __awaiter(this, void 0, void 0, function* () {
            let hash = 0;
            // if request should use the cache, check if the response is already cached
            if (options.cache) {
                hash = hash_1.createHash(JSON.stringify({
                    procedure,
                    params,
                }));
                const cachedResponse = cache.get(hash);
                const now = new Date().getTime();
                if (cachedResponse && now - cachedResponse.date <= options.cache.time) {
                    return cachedResponse.response;
                }
            }
            // use a serializer to create the request body
            const data = clientOptions.serializer.serialize(params);
            const response = yield clientOptions.xhr({
                endpoint: clientOptions.endpoint,
                contentType: clientOptions.serializer.contentType,
                procedure,
                data,
                onDownloadProgress: options.onDownloadProgress || nullOp,
                onUploadProgress: options.onUploadProgress || nullOp,
            });
            // if request should use the cache, save a successfull request
            // according to the passed option, save the reponse
            if (options.cache) {
                if (response.type === "success") {
                    cache.set(hash, {
                        date: new Date().getTime(),
                        response: options.cache.saveResponse ? response : noResponse,
                    });
                }
            }
            return response;
        });
    };
}
function createClient(clientOptions) {
    const cache = new Map();
    const callFn = createCallFn(clientOptions, cache);
    return new Proxy({}, {
        get(_, procedure) {
            return function (...params) {
                const callable = {
                    call: callFn(procedure, params),
                };
                return callable;
            };
        },
    });
}
exports.createClient = createClient;
function createFallbackClient(clientOptions) {
    const cache = new Map();
    const callFn = createCallFn(clientOptions, cache);
    return {
        createRequest(procedure, ...params) {
            const callable = {
                call: callFn(procedure, params),
            };
            return callable;
        },
    };
}
exports.createFallbackClient = createFallbackClient;

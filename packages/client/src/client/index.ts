import { Cache } from "../types/cache";
import { Callables, ICallOptions, Callable } from "../types/callable";
import { IClientOptions } from "../types/client";
import { INoResponse, ISuccess } from "../types/response";
import { createHash } from "../utils/hash";

const nullOp = () => { };
const noResponse: INoResponse = { type: "noResponse" };

function createCallFn(clientOptions: IClientOptions, cache: Cache) {
    return (procedure: string | number | symbol, params: any[]) => {
        return async (options: ICallOptions = {}) => {
            let hash = 0;

            // if request should use the cache, check if the response is already cached
            if (options.cache) {
                hash = createHash(
                    JSON.stringify({
                        procedure,
                        params,
                    })
                );

                const cachedResponse = cache.get(hash);
                const now = new Date().getTime();

                if (cachedResponse && now - cachedResponse.date <= options.cache.time) {
                    return cachedResponse.response;
                }
            }

            // use a serializer to create the request body
            const data = clientOptions.serializer.serialize(params);

            const response = await clientOptions.xhr({
                endpoint: clientOptions.endpoint,
                auth: clientOptions.getAuth?.() || "",
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
        };
    };
}

export function createClient<API>(clientOptions: IClientOptions) {
    const cache = new Map<number, { date: number; response: ISuccess | INoResponse; }>();
    const callFn = createCallFn(clientOptions, cache);

    return new Proxy({}, {
        get(_, procedure) {
            return function (...params: any[]) {
                const callable: Callable<any> = {
                    call: callFn(procedure, params),
                };

                return callable;
            };
        },
    }) as Callables<API>;
}

export function createFallbackClient<API extends any>(clientOptions: IClientOptions) {
    const cache = new Map<number, { date: number; response: ISuccess | INoResponse; }>();
    const callFn = createCallFn(clientOptions, cache);

    return {
        createRequest<P extends keyof API>(procedure: P, ...params: Parameters<API[P]>) {
            const callable: Callable<ReturnType<API[P]>> = {
                call: callFn(procedure, params),
            };

            return callable;
        },
    };
}

import { Callables, Callable } from "../types/callable";
import { IClientOptions } from "../types/client";
export declare function createProxyClient<API>(clientOptions: IClientOptions): Callables<API>;
export declare function createClient<API extends any>(clientOptions: IClientOptions): {
    createRequest<P extends keyof API>(procedure: P, ...params: Parameters<API[P]>): Callable<ReturnType<API[P]>>;
};

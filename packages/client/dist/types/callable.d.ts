import { Response } from "./response";
import { ProgressCallback } from "./progressCallback";
export interface ICallOptions {
    onDownloadProgress?: ProgressCallback;
    onUploadProgress?: ProgressCallback;
    cache?: {
        time: number;
        saveResponse: boolean;
    };
}
export declare type Callable<T> = {
    call: (options?: ICallOptions) => Promise<Response<T>>;
};
declare type FunctionToCallable<F> = F extends (...params: infer P) => infer R ? (...params: P) => Callable<R> : never;
export declare type Callables<T> = {
    [p in keyof T]: FunctionToCallable<T[p]>;
};
export {};

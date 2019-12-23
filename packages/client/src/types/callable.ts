import { Response } from "./response";
import { ProgressCallback } from "./progressCallback";

export interface ICallOptions {
    onDownloadProgress?: ProgressCallback;
    onUploadProgress?: ProgressCallback;
    cache?: {
        time: number;
        saveResponse: boolean;
    }
}

export type Callable<T> = {
    call: (options?: ICallOptions) => Promise<Response<T>>;
}

type FunctionToCallable<F> = F extends (...params: infer P) => infer R
    ? (...params: P) => Callable<R>
    : never;

export type Callables<T> = {
    [p in keyof T]: FunctionToCallable<T[p]>;
};

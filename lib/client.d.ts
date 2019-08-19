export interface IAPI<T extends any> {
    call<K extends keyof T & string>(procedure: K, ...params: Parameters<T[K]>): RPC<ReturnType<T[K]>>;
}
export declare class API<T extends any> implements IAPI<T> {
    private readonly endpoint;
    constructor(endpoint: string);
    call<K extends keyof T & string>(procedure: K, ...params: Parameters<T[K]>): RPC<ReturnType<T[K]>>;
}
export interface IRPC<T> {
    onSuccess(callback: (result: T) => any): this;
    onFailure(callback: (error: string) => any): this;
    onProgress(callback: (progress: number) => any): this;
}
declare class RPC<T> implements IRPC<T> {
    private readonly progressCallbacks;
    private readonly promise;
    constructor(endpoint: string, procedure: string, params: any[]);
    onSuccess(callback: (result: T) => any): this;
    onFailure(callback: (error: string) => any): this;
    onProgress(callback: (progress: number) => any): this;
}
export {};

export declare function API<T extends any>(endpoint: string): <K extends keyof T & string>(procedure: K, ...params: Parameters<T[K]>) => RPC<ReturnType<T[K]>>;
declare class RPC<T> {
    private readonly progressCallbacks;
    private readonly promise;
    constructor(endpoint: string, procedure: string, params: any[]);
    onSuccess(callback: (result: T) => any): this;
    onFailure(callback: (error: string) => any): this;
    onProgress(callback: (progress: number) => any): this;
}
export {};

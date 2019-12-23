export declare type AsyncFunction<T> = T extends (...params: infer P) => infer R ? (...params: P) => R | Promise<R> : never;
export declare type Async<T> = {
    [K in keyof T]: AsyncFunction<T[K]>;
};

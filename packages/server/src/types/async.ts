export type AsyncFunction<T> = T extends (...params: infer P) => infer R ? (...params: P) => R | Promise<R>: never;
export type Async<T> = { [K in keyof T]: AsyncFunction<T[K]>; };

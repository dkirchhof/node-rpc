export type RPCFunction<T, Context> = T extends (...params: infer P) => infer R ? (...params: P) => (context: Context) => R | Promise<R> : never;
export type RPCFunctions<T, Context> = { [K in keyof T]: RPCFunction<T[K], Context>; };

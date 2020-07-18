import { IDeserializer } from "./deserializer";
export interface IServerOptions<Context> {
    api: {
        [key: string]: (...params: any[]) => (context: Context) => any;
    };
    deserializer: IDeserializer;
}

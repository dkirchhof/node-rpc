import { IDeserializer } from "./deserializer";

export interface IServerOptions {
    api: any;
    deserializer: IDeserializer;
}

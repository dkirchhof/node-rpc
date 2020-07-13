import { ISerializer } from "./serializer";
import { XHRFunction } from "./xhr";
export interface IClientOptions {
    endpoint: string;
    serializer: ISerializer;
    xhr: XHRFunction;
    getAuth?: () => string;
}

/// <reference types="node" />
import { IncomingMessage } from "http";
export interface IDeserializer {
    deserialize: (req: IncomingMessage) => Promise<{
        params: any[];
        filePaths: string[];
    }>;
}

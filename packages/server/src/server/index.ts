import { IncomingMessage } from "http";

import { IServerOptions } from "../types/server";
import { deleteFilesGracefully } from "../utils/deleteFilesGracefully";

export function createServer(options: IServerOptions) {
    return {
        handleAPIRequest: async (req: IncomingMessage) => {
            const procedureName = req.headers["x-rpc-procedure"] as any;
            const procedure = options.api[procedureName];

            const { params, filePaths } = await options.deserializer.deserialize(req);

            return Promise.resolve(procedure(...params))
                .finally(() => deleteFilesGracefully(filePaths));
        },
    };
}

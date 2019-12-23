import { json } from "co-body";

import { IDeserializer } from "../types/deserializer";

/**
 * Parses a json array with all params. Can't handle files!
 */
export const jsonDeserializer: IDeserializer = {
    deserialize: async req => {
        const params = await json(req);

        return {
            params,
            filePaths: [],
        };
    }
};

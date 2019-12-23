import { ISerializer } from "../types/serializer";

/**
 * Creates a stringified array of all params. Can't handle files!
 */
export const jsonSerializer: ISerializer = {
    contentType: "application/json",
    serialize: params => JSON.stringify(params),
};

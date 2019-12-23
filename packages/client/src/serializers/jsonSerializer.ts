import { ISerializer } from "../types/serializer";

export const jsonSerializer: ISerializer = {
    contentType: "application/json",
    serialize: params => JSON.stringify(params),
};

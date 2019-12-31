import { INoResponse, ISuccess } from "../types/response";

export type Cache = Map<number, { date: number; response: ISuccess | INoResponse; }>;

import { File, IncomingForm } from "formidable";
import { unlink } from "fs";
import { IncomingMessage } from "http";

type AsyncFunction<T> = T extends (...params: infer P) => infer R ? (...params: P) => R | Promise<R>: never;

export type Async<T> = { [K in keyof T]: AsyncFunction<T[K]>; };

export function API<T extends { [s: string]: (...params: any[]) => any; }>(api: T) {
    return async (req: IncomingMessage) => {
        const procedureName = req.headers["x-rpc-procedure"] as keyof T;
        const procedure = api[procedureName];
    
        const { data, filePaths } = await parseFormData(req);
        const params = toParams(data);

        return Promise.resolve(procedure(...params))
            .finally(() => deleteFilesGracefully(filePaths));
    };
}

function parseFormData(req: IncomingMessage) {
    return new Promise<{ data: Map<number, any[]>; filePaths: string[]; }>((resolve, reject) => {
        const data = new Map<number, any[]>();
        const filePaths: string[] = [];
        const form = new IncomingForm();
        
        form.keepExtensions = true;
        form.multiples = true;

        const addData = (field: string, value: string | File) => {
            const paramIndex = Number(field);
            const storedValues = data.get(paramIndex);
            const parsedValue = typeof value === "string" ? JSON.parse(value) : value;

            if(storedValues) {
                storedValues.push(parsedValue);
            } else {
                data.set(paramIndex, [parsedValue]);
            }

            if(typeof value === "object") {
                filePaths.push(value.path);
            }
        };

        form.on("field", addData);
        form.on("file", addData);

        form.on("end", () => resolve({ data, filePaths }));
        form.on("error", reject);

        form.parse(req);
    });
}

function toParams(data: Map<number, any[]>) {
    return [...data.keys()]
        .sort()
        .map(key => {
            const value = data.get(key)!;
            
            if(value.length === 1) {
                return value[0];
            } else {
                return value;
            }
        });
}

function deleteFilesGracefully(paths: string[]) {
    paths.forEach(path => unlink(path, () => { }));
}

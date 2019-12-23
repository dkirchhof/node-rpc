import { File, IncomingForm } from "formidable";

import { IDeserializer } from "../types/deserializer";

/**
 * Parses a form data request with param index as key and a json string or file / filelist as value 
 */
export const jsonFormDataDeserializer: IDeserializer = {
    deserialize: req => {
        return new Promise((resolve, reject) => {
            const data = new Map<number, any[]>();
            const filePaths: string[] = [];
            const form = new IncomingForm();

            form.keepExtensions = true;
            form.multiples = true;

            const addData = (field: string, value: string | File) => {
                const paramIndex = Number(field);
                const storedValues = data.get(paramIndex);
                const parsedValue = typeof value === "string" ? JSON.parse(value) : value;

                if (storedValues) {
                    storedValues.push(parsedValue);
                } else {
                    data.set(paramIndex, [parsedValue]);
                }

                if (typeof value === "object") {
                    filePaths.push(value.path);
                }
            };

            const toParams = (data: Map<number, any[]>) => {
                return [...data.keys()]
                    .sort()
                    .map(key => {
                        const value = data.get(key)!;

                        if (value.length === 1) {
                            return value[0];
                        } else {
                            return value;
                        }
                    });
            };

            form.on("field", addData);
            form.on("file", addData);
            form.on("error", reject);

            form.on("end", () => resolve({ 
                params: toParams(data), 
                filePaths,
            }));

            form.parse(req);
        });
    },
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formidable_1 = require("formidable");
/**
 * Parses a form data request with param index as key and a json string or file / filelist as value
 */
exports.jsonFormDataDeserializer = {
    deserialize: req => {
        return new Promise((resolve, reject) => {
            const data = new Map();
            const filePaths = [];
            const form = new formidable_1.IncomingForm();
            form.keepExtensions = true;
            form.multiples = true;
            const addData = (field, value) => {
                const paramIndex = Number(field);
                const storedValues = data.get(paramIndex);
                const parsedValue = typeof value === "string" ? JSON.parse(value) : value;
                if (storedValues) {
                    storedValues.push(parsedValue);
                }
                else {
                    data.set(paramIndex, [parsedValue]);
                }
                if (typeof value === "object") {
                    filePaths.push(value.path);
                }
            };
            const toParams = (data) => {
                return [...data.keys()]
                    .sort()
                    .map(key => {
                    const value = data.get(key);
                    if (value.length === 1) {
                        return value[0];
                    }
                    else {
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

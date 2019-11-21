"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formidable_1 = require("formidable");
const fs_1 = require("fs");
async function handleAPIRequest(req, api) {
    const procedureName = req.headers["x-rpc-procedure"];
    const procedure = api[procedureName];
    const { data, filePaths } = await parseFormData(req);
    const params = toParams(data);
    return Promise.resolve(procedure(...params))
        .finally(() => deleteFilesGracefully(filePaths));
}
exports.handleAPIRequest = handleAPIRequest;
function parseFormData(req) {
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
        form.on("field", addData);
        form.on("file", addData);
        form.on("end", () => resolve({ data, filePaths }));
        form.on("error", reject);
        form.parse(req);
    });
}
function toParams(data) {
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
}
function deleteFilesGracefully(paths) {
    paths.forEach(path => fs_1.unlink(path, () => { }));
}

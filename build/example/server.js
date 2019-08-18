"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const micro_1 = require("micro");
const micro_cors_1 = __importDefault(require("micro-cors"));
const server_1 = require("../server");
const apiHandler = server_1.API({
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    toUpperCase: (str) => str.toUpperCase(),
});
const handler = async (req, res) => {
    if (req.method === 'OPTIONS') {
        return micro_1.send(res, 200, 'ok!');
    }
    try {
        return await apiHandler(req);
    }
    catch (e) {
        return await micro_1.send(res, 500, e.message);
    }
};
module.exports = micro_cors_1.default({ allowHeaders: ["*"] })(handler);

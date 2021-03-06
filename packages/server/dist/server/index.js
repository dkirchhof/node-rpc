"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const deleteFilesGracefully_1 = require("../utils/deleteFilesGracefully");
function createServer(options) {
    return {
        handleAPIRequest: (req, context) => __awaiter(this, void 0, void 0, function* () {
            const procedureName = req.headers["x-rpc-procedure"];
            const procedure = options.api[procedureName];
            const { params, filePaths } = yield options.deserializer.deserialize(req);
            return Promise.resolve(procedure(...params)(context))
                .finally(() => deleteFilesGracefully_1.deleteFilesGracefully(filePaths));
        }),
    };
}
exports.createServer = createServer;

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
// src/index.ts
const h3_1 = require("h3");
function serverless(app) {
    return (event) => __awaiter(this, void 0, void 0, function* () {
        const handler = (0, h3_1.toPlainHandler)(app);
        const response = yield handler(Object.assign(Object.assign({}, event), { method: event.httpMethod }));
        const headersArray = response.headers;
        const headersObject = {};
        headersArray.forEach(([key, value]) => {
            if (key.toLowerCase() === 'set-cookie') {
                if (!headersObject['Set-Cookie']) {
                    headersObject['Set-Cookie'] = [];
                }
                headersObject['Set-Cookie'].push(value);
            }
            else {
                if (headersObject[key]) {
                    headersObject[key] += `, ${value}`;
                }
                else {
                    headersObject[key] = value;
                }
            }
        });
        // Ensure Set-Cookie headers are joined correctly
        if (headersObject['Set-Cookie']) {
            headersObject['Set-Cookie'] = headersObject['Set-Cookie'].map((cookie) => cookie);
        }
        return {
            statusCode: response.status,
            headers: headersObject,
            body: response.body,
        };
    });
}
exports.default = serverless;
module.exports = serverless; // Use CommonJS export

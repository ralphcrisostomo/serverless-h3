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
function buildUrlWithQueryParams(baseUrl, queryParams) {
    const queryString = Object.entries(queryParams)
        .map(([key, values]) => {
        // Check if values is an array, otherwise treat it as a single value
        if (Array.isArray(values)) {
            return values.map(value => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
        }
        else {
            return `${encodeURIComponent(key)}=${encodeURIComponent(values)}`;
        }
    })
        .join('&');
    // Append the query string to the base URL
    return queryString ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${queryString}` : baseUrl;
}
function serverless(app) {
    return (event) => __awaiter(this, void 0, void 0, function* () {
        if (event.multiValueQueryStringParameters) {
            event.path = buildUrlWithQueryParams(event.path, event.multiValueQueryStringParameters);
        }
        const handler = (0, h3_1.toPlainHandler)(app);
        const response = yield handler(Object.assign(Object.assign({}, event), { method: event.httpMethod }));
        const headersArray = response.headers;
        const headersObject = {};
        const multiValueHeadersObject = {};
        headersArray.forEach(([key, value]) => {
            if (key.toLowerCase() === 'set-cookie') {
                if (!multiValueHeadersObject['Set-Cookie']) {
                    multiValueHeadersObject['Set-Cookie'] = [];
                }
                multiValueHeadersObject['Set-Cookie'].push(value);
                console.log('Set-Cookie header added:', value);
            }
            else {
                if (headersObject[key]) {
                    headersObject[key] += `, ${value}`;
                }
                else {
                    headersObject[key] = value;
                }
                console.log(`${key} header added/updated:`, headersObject[key]);
            }
        });
        console.log('Final headers object:', headersObject);
        console.log('Final multiValueHeaders object:', multiValueHeadersObject);
        return {
            statusCode: response.status,
            headers: headersObject,
            multiValueHeaders: multiValueHeadersObject,
            body: response.body,
        };
    });
}
exports.default = serverless;
module.exports = serverless; // Use CommonJS export

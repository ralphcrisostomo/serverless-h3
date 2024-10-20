// src/index.ts
import { toPlainHandler } from "h3";

function buildUrlWithQueryParams(baseUrl: string, queryParams: Record<string, string | string[]>) {
    const queryString = Object.entries(queryParams)
        .map(([key, values]) => {
            // Check if values is an array, otherwise treat it as a single value
            if (Array.isArray(values)) {
                return values.map(value => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
            } else {
                return `${encodeURIComponent(key)}=${encodeURIComponent(values)}`;
            }
        })
        .join('&');

    // Append the query string to the base URL
    return queryString ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${queryString}` : baseUrl;
}

function serverless(app: any) {
    return async (event: any) => {
        if (event.multiValueQueryStringParameters) {
            event.path = buildUrlWithQueryParams(event.path, event.multiValueQueryStringParameters)
        }
        // Refs: H3 Response Schema
        //  - https://h3.unjs.io/adapters/plain
        const handler = toPlainHandler(app);
        const response = await handler({
            ...event,
            method: event.httpMethod,
            context: event.requestContext,
        });

        const headersArray = response.headers;
        const headersObject: any = {};
        const multiValueHeadersObject: any = {};

        headersArray.forEach(([key, value]: [string, string]) => {
            if (key.toLowerCase() === 'set-cookie') {
                if (!multiValueHeadersObject['Set-Cookie']) {
                    multiValueHeadersObject['Set-Cookie'] = [];
                }
                multiValueHeadersObject['Set-Cookie'].push(value);
                // console.log('Set-Cookie header added:', value);
            } else {
                if (headersObject[key]) {
                    headersObject[key] += `, ${value}`;
                } else {
                    headersObject[key] = value;
                }
                // console.log(`${key} header added/updated:`, headersObject[key]);
            }
        });


        // Refs: Lambda Response Schema
        //  - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
        return {
            statusCode: response.status,
            headers: headersObject,
            multiValueHeaders: multiValueHeadersObject,
            body: response.body,
        };
    };
}

export default serverless;
module.exports = serverless; // Use CommonJS export

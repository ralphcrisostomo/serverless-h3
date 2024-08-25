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
        const handler = toPlainHandler(app);
        const response = await handler({
            ...event,
            method: event.httpMethod,
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
                console.log('Set-Cookie header added:', value);
            } else {
                if (headersObject[key]) {
                    headersObject[key] += `, ${value}`;
                } else {
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
    };
}

export default serverless;
module.exports = serverless; // Use CommonJS export

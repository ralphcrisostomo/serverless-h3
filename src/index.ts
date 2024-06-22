// src/index.ts
import { toPlainHandler } from "h3";

function serverless(app: any) {
    return async (event: any) => {
        const handler = toPlainHandler(app);
        const response = await handler({
            ...event,
            method: event.httpMethod,
        });

        const headersArray = response.headers;
        const headersObject = headersArray.reduce((acc: any, [key, value]: [string, string]) => {
            const headerKey = key;
            if (acc[headerKey]) {
                acc[headerKey] += `, ${value}`;
            } else {
                acc[headerKey] = value;
            }
            return acc;
        }, {});

        return {
            statusCode: response.status,
            headers: headersObject,
            body: response.body,
        };
    };
}


export default serverless;
module.exports = serverless; // Use CommonJS export

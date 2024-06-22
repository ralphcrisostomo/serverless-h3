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
        const headersObject: any = {};

        headersArray.forEach(([key, value]: [string, string]) => {
            if (key.toLowerCase() === 'set-cookie') {
                if (!headersObject['Set-Cookie']) {
                    headersObject['Set-Cookie'] = [];
                }
                headersObject['Set-Cookie'].push(value);
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

        // Ensure Set-Cookie headers are joined correctly
        if (headersObject['Set-Cookie']) {
            headersObject['Set-Cookie'] = headersObject['Set-Cookie'].map((cookie: string) => cookie);
        }

        console.log('Final headers object:', headersObject);

        return {
            statusCode: response.status,
            headers: headersObject,
            body: response.body,
        };
    };
}

export default serverless;
module.exports = serverless; // Use CommonJS export

// index.ts
import { toPlainHandler } from "h3";

const toPascalCase = (str: string): string => {
    return str
        .toLowerCase()
        .replace(/(^\w|-\w)/g, (match) => match.toUpperCase().replace('-', ''));
};

export default function serverless(app: any) {
    return async (event: any) => {
        const handler = toPlainHandler(app);
        const response = await handler({
            ...event,
            method: event.httpMethod
        });

        const headersArray = response.headers;
        const headersObject = headersArray.reduce((acc: any, [key, value]: [string, string]) => {
            const pascalKey = toPascalCase(key);
            if (acc[pascalKey]) {
                acc[pascalKey] += `, ${value}`;
            } else {
                acc[pascalKey] = value;
            }
            return acc;
        }, {});

        return {
            statusCode: response.status,
            headers: headersObject,
            body: response.body
        };
    };
}

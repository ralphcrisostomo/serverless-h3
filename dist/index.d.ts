declare function serverless(app: any): (event: any) => Promise<{
    statusCode: number;
    headers: any;
    multiValueHeaders: any;
    body: unknown;
}>;
export default serverless;

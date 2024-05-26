declare function serverless(app: any): (event: any) => Promise<{
    statusCode: number;
    headers: any;
    body: unknown;
}>;
export default serverless;

# serverless-h3

A serverless wrapper for h3 applications, enabling seamless integration with serverless environments like AWS Lambda.

## Installation

To install the package using pnpm, npm or yarn, run the following command:

```bash
# PNPM
$ pnpm add serverless-h3

# NPM
$ npm install serverless-h3

# Yarn
$ yarn add serverless-h3
```

## Usage
### AWS Lambda Example

To use `serverless-h3` with AWS Lambda, follow these steps:

1. Create your `h3` application and wrap it with the `serverless-h3` wrapper.
2. Deploy your application to AWS Lambda using a deployment tool like the Serverless Framework, AWS SAM, or AWS CDK.

#### AWS Lambda Handler

Here's an example of how to set up your handler for AWS Lambda:

```javascript
// handler.js
const { createApp, defineEventHandler, readBody } = require('h3');
const serverless = require('serverless-h3');

const app = createApp();

app.use('/hello', defineEventHandler((event) => {
    // You can use your h3 methods here..
    const body = readBody(event);
    return {
        hello: 'world',
        body: body
    }
}));

export const handler = serverless(app);
```

### Contributing

If you have any suggestions, bug reports, or contributions, feel free to open an issue or submit a pull request on GitHub.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

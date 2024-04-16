# `secret`

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/jozan/secret/build.yml?branch=main&style=flat)
![NPM Downloads](https://img.shields.io/npm/d18m/%40latehours%2Fsecret?style=flat)
![GitHub License](https://img.shields.io/github/license/jozan/secret?style=flat)
![Static Badge](https://img.shields.io/badge/made%20with%20-%20husqvarna%20vacuum%20cleaner%20-%20made%20with%20husqvarna?style=flat&logo=husqvarna)

`secret` is a simple utility library for managing secrets in a TypeScript app.

the main purpose is to prevent accidental leaking of secrets into logs,
stdout, JSON.stringify calls, writes to files and so on by the developer.

the secret is still stored in memory unencrypted and can be read by a debugger
or by inspecting the memory of the process. this is not a security library.

behind the scenes the secret is stored in the secret object as a bytes array so
it's not plaintext. but keep in mind that this is more security by obscurity
than anything else.

## usage

> [!NOTE]
> the secret library is currently not published to npm.

```sh
npm install @latehours/secret
pnpm install @latehours/secret
bun add @latehours/secret
yarn add @latehours/secret
```

```typescript
import * as Secret from "@latehours/secret";

// conseal a string into a secret
const hidden = Secret.fromString("tussihovi");

console.log(hidden); // logs [REDACTED]

// convert the secret back to a string
const exposed = Secret.expose(hidden);
```

## aknowledgements

the idea for this library came from the rust cargo [`secrecy`](https://docs.rs/secrecy/latest/secrecy/).

the implementation is based on the following libraries:

- [`secret-value`](https://github.com/transcend-io/secret-value)
- [`effect/secret`](https://github.com/Effect-TS/effect/blob/main/packages/effect/src/internal/secret.ts)

this improves on the above libraries by hiding the raw value of the secret
(bytes array) from leaking when calling `console.log` or `utils.inspect` on the
secret object. additionally the raw value is not retrievable by object access.

## development

To install dev dependencies:

```bash
bun install
```

To run tests:

```bash
bun --watch test
```

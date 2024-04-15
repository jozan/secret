# `secret`

`secret` is a simple utility libraty for managing secrets in a TypeScript app.

the main purpose is to prevent accidenal leaking of secrets into logs,
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

## development

To install dev dependencies:

```bash
bun install
```

To run tests:

```bash
bun --watch test
```

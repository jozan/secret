# `secret` 🤫

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/jozan/secret/build.yml?branch=main&style=flat)
![Dependencies amount 0](https://img.shields.io/badge/dependencies%20-%200%20-%200?style=flat)
![NPM Downloads](https://img.shields.io/npm/dm/%40latehours%2Fsecret?style=flat)
![GitHub License](https://img.shields.io/github/license/jozan/secret?style=flat)
![Made with vacuum cleaner](https://img.shields.io/badge/made%20with%20-%20husqvarna%20vacuum%20cleaner%20-%20made%20with%20husqvarna?style=flat&logo=husqvarna)
[![package size](https://deno.bundlejs.com/?q=%40latehours/secret&badge=detailed&badge-style=flat&label=size)](https://bundlejs.com/?q=%40latehours/secret)

**`secret`** is a simple utility library for handling sensitive data in any
typescript app. no more accidentally leaking tokens or emails into logs!

is has **zero dependencies** and has fairly exhaustive test coverage.

### motivation

the main purpose is to prevent accidental leaking of secrets into logs,
stdout, JSON.stringify calls, writes to files and so on by the developer.
`secret` makes revealing the secret value explicit.

keep in mind that the secret is still stored in memory unencrypted and can be
read by a debugger or by inspecting the memory of the process. this is not a
security library. continue to use encryption for sensitive data at rest.

behind the scenes the secret is stored in the secret object as a bytes array so
it's not plaintext. but keep in mind that this is more security by obscurity
than anything else.

## usage

> [!NOTE]
> the secret library is currently not published to npm.

install the library using your package manager of choice:

```sh
npm install @latehours/secret
pnpm install @latehours/secret
bun add @latehours/secret
yarn add @latehours/secret
```

usage in your code:

```typescript
import * as Secret from "@latehours/secret";

// conceal a string into a secret
const hidden = Secret.fromString("tussihovi");

console.log(hidden); // logs [REDACTED]

// convert the secret back to a string
const exposed = Secret.expose(hidden);
```

when wrapping a value into a secret in `io-ts` or `zod` schema make sure to
clean up any intermediate secrets such as the unparsed input.

sending a secret over the network is not possible as the secret is not
serializable by design. use encryption for that or better yet, don't handle the
secret at all.

## aknowledgements

the idea for this library came from the rust cargo [`secrecy`](https://docs.rs/secrecy/latest/secrecy/).

the implementation is based on the following libraries:

- [`secret-value`](https://github.com/transcend-io/secret-value)
- [`effect/secret`](https://github.com/Effect-TS/effect/blob/main/packages/effect/src/internal/secret.ts)

this improves on the above libraries by hiding the raw value of the secret
(bytes array) from leaking when calling `console.log` or `utils.inspect` on the
secret object. also the raw value is not retrievable by object access.

## development

To install dev dependencies:

```bash
bun install
```

To run tests:

```bash
bun --watch test
```

when creating commits follow the [conventional commits](https://www.conventionalcommits.org)
format.

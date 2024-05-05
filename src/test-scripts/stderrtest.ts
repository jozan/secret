// THIS IS TEST FILE FOR STDERR
// REQUIRED BY: secret.test.ts
import * as Secret from "@latehours/secret";

const secret = Secret.fromString("tussihovi");
console.error(secret);

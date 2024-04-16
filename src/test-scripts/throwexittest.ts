// THIS IS TEST FILE FOR LEAKING SECRET ON THROW
// REQUIRED BY: secret.test.ts
import * as Secret from "../secret";

const secret = Secret.fromString("tussihovi");

throw new Error(secret as any);

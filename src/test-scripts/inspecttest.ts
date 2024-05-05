// THIS IS TEST FILE FOR UTILS.INSPECT
// REQUIRED BY: secret.test.ts
import * as Secret from "@latehours/secret";
import { inspect } from "util";

const secret = Secret.fromString("tussihovi");
console.log(inspect(secret));

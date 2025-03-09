import * as v from "@badrap/valita";
import * as SecretInternal from "@latehours/secret";

export const Secret = v.string().chain((str) => {
  try {
    return v.ok(SecretInternal.fromString(str));
  } catch {
    return v.err("Invalid input to secret");
  }
});

export type Secret = v.Infer<typeof Secret>;

import * as SecretInternal from "@latehours/secret";
import { z } from "zod";

export const Secret = z
  .string()
  .transform((str) => SecretInternal.fromString(str));

export type Secret = z.infer<typeof Secret>;

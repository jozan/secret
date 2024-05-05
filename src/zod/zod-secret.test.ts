import * as fc from "fast-check";
import { expect, describe, test } from "bun:test";
import * as SecretValue from "@latehours/secret";
import { Secret as SecretSchema } from "@latehours/zod/secret";
import { z } from "zod";

describe("secret encode/decode zod", () => {
  test("should encode a string to secret and back to original", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = SecretSchema.safeParse(input);

        if (secret.success) {
          expect(SecretValue.isSecret(secret.data)).toBe(true);
          const exposed = SecretValue.expose(secret.data);
          expect(exposed).toEqual(input);
        }
      })
    );
  });

  test("should encode struct values to secrets", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const struct = z.object({
          redacted: SecretSchema,
        });

        const result = struct.safeParse({ redacted: input });

        if (result.success) {
          expect(SecretValue.isSecret(result.data.redacted)).toBe(true);
          const exposed = SecretValue.expose(result.data.redacted);
          expect(exposed).toEqual(input);
        }
      })
    );
  });
});

import { describe, expect, test } from "bun:test";
import * as v from "@badrap/valita";
import * as Secret from "@latehours/secret";
import { Secret as SecretSchema } from "@latehours/valita/secret";
import * as fc from "fast-check";

describe("secret encode/decode valita", () => {
  test("should encode a string to secret and back to original", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = SecretSchema.try(input);

        if (secret.ok) {
          expect(Secret.isSecret(secret.value)).toBe(true);
          const exposed = Secret.expose(secret.value);
          expect(exposed).toEqual(input);
        }
      }),
    );
  });

  test("should encode struct values to secrets", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const struct = v.object({
          redacted: SecretSchema,
        });

        const result = struct.try({ redacted: input });

        if (result.ok) {
          expect(Secret.isSecret(result.value.redacted)).toBe(true);
          const exposed = Secret.expose(result.value.redacted);
          expect(exposed).toEqual(input);
        }
      }),
    );
  });
});

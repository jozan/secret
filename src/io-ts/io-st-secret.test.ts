import * as fc from "fast-check";
import { expect, describe, test } from "bun:test";
import * as SecretValue from "../secret";
import { SecretCodec, StringToSecret, SecretToExposedString } from "./secret";
import { pipe } from "fp-ts/function";
import { fold } from "fp-ts/Either";

describe("secret encode/decode io-ts codec", () => {
  test("should decode a string to secret", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        pipe(
          input,
          StringToSecret.decode,
          fold(
            () => {
              expect.unreachable("decoding should not fail");
            },
            (s) => {
              expect(SecretValue.isSecret(s)).toBe(true);
              expect(SecretValue.expose(s)).toEqual(input);
            }
          )
        );
      })
    );
  });

  test("should encode secret to exposed string", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = SecretValue.fromString(input);
        const encoded = SecretToExposedString.encode(secret);

        expect(encoded).toEqual(input);
      })
    );
  });

  test("should decode a string to secret and back to original", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        pipe(
          input,
          SecretCodec.decode,
          fold(
            () => {
              expect.unreachable("decoding should not fail");
            },
            (s) => {
              const encoded = SecretCodec.encode(s);
              expect(encoded).toEqual(input);
            }
          )
        );
      })
    );
  });
});

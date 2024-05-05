import * as SecretInternal from "@latehours/secret";
import { make, type Codec } from "io-ts/Codec";
import {
  string as Dstring,
  parse,
  success,
  failure,
  type Decoder,
  type TypeOf,
} from "io-ts/Decoder";
import { type Encoder as IOTSEncoder, type OutputOf } from "io-ts/Encoder";
import { pipe } from "fp-ts/function";

export const StringToSecret: Decoder<unknown, SecretInternal.Secret> = pipe(
  Dstring,
  parse((s) => {
    const secret = SecretInternal.fromString(s);
    return SecretInternal.isSecret(secret)
      ? success(secret)
      : failure(
          s,
          `cannot decode given value, should be parsable into a secret`
        );
  })
);

export type StringToSecret = TypeOf<typeof StringToSecret>;

export const SecretToExposedString: IOTSEncoder<string, SecretInternal.Secret> =
  {
    encode: SecretInternal.expose,
  };

export type SecretToExposedString = OutputOf<typeof SecretToExposedString>;

export const SecretCodec: Codec<unknown, string, SecretInternal.Secret> = make(
  StringToSecret,
  SecretToExposedString
);

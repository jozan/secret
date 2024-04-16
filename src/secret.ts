/** @internal */
const SymbolRaw = Symbol("rawValue");

/** @internal */
const SymbolSecretId = Symbol("SecretId");

export interface Secret {
  /** @internal */
  readonly [SymbolRaw]: Array<number>;
  equals(that: unknown): boolean;
}

/** @internal */
const proto = {
  [SymbolSecretId]: SymbolSecretId,

  equals(this: Secret, that: unknown): boolean {
    return (
      isSecret(that) &&
      this[SymbolRaw].length === that[SymbolRaw].length &&
      this[SymbolRaw].every((v, i) => v === that[SymbolRaw][i])
    );
  },
};

/** @internal */
function makeSecret(input: Array<number>): Secret {
  const secret = Object.create(proto);

  Object.defineProperty(secret, "toString", {
    enumerable: false,
    value() {
      return "[REDACTED]";
    },
  });

  Object.defineProperty(secret, "toJSON", {
    enumerable: false,
    value() {
      return "[REDACTED]";
    },
  });

  Object.defineProperty(secret, "valueOf", {
    enumerable: false,
    value() {
      return "[REDACTED]";
    },
  });

  Object.defineProperty(secret, Symbol.for("nodejs.util.inspect.custom"), {
    enumerable: false,
    value() {
      return "[REDACTED]";
    },
  });

  Object.defineProperty(secret, SymbolRaw, {
    enumerable: false,
    value: input,
  });

  return secret;
}

export const isSecret = (u: unknown): u is Secret =>
  typeof u === "object" &&
  u !== null &&
  SymbolSecretId in u &&
  u[SymbolSecretId] === SymbolSecretId;

export function fromString(input: string) {
  return makeSecret(input.split("").map((c) => c.charCodeAt(0)));
}

export function expose(secret: Secret) {
  return secret[SymbolRaw].map((c) => String.fromCharCode(c)).join("");
}

const SymbolRaw = Symbol("rawValue");

export interface Secret {
  /** @internal */
  readonly [SymbolRaw]: Array<number>;
}

function makeSecret(input: Array<number>): Secret {
  const secret = Object.create({});

  Object.defineProperty(secret, "toString", {
    enumerable: false,
    value: () => "[REDACTED]",
  });

  Object.defineProperty(secret, "toJSON", {
    enumerable: false,
    value: () => "[REDACTED]",
  });

  Object.defineProperty(secret, "valueOf", {
    enumerable: false,
    value: () => "[REDACTED]",
  });

  Object.defineProperty(secret, SymbolRaw, {
    enumerable: false,
    value: input,
  });

  Object.defineProperty(secret, Symbol.for("nodejs.util.inspect.custom"), {
    enumerable: false,
    value: () => "[REDACTED]",
  });

  return secret;
}

export function fromString(input: string) {
  return makeSecret(input.split("").map((c) => c.charCodeAt(0)));
}

export function expose(secret: Secret) {
  return secret[SymbolRaw].map((c) => String.fromCharCode(c)).join("");
}

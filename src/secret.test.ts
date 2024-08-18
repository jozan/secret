import * as fc from "fast-check";
import { expect, describe, test, beforeAll, afterAll } from "bun:test";
import os from "node:os";
import fs from "node:fs";
import crypto from "node:crypto";
import * as Secret from "@latehours/secret";

describe("secret encode/decode", () => {
  test("should encode a string to secret and back to original", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = Secret.fromString(input);
        const exposed = Secret.expose(secret);

        expect(exposed).toEqual(input);
      }),
    );
  });

  test("check if something is a secret", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = Secret.fromString(input);
        const isSecret = Secret.isSecret(secret);
        const notSecret = Secret.isSecret(input);

        expect(isSecret).toBe(true);
        expect(notSecret).toBe(false);
      }),
    );
  });

  test("secrets equal by value", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret1 = Secret.fromString(input);
        const secret2 = Secret.fromString(input);

        expect(secret1.equals(secret2)).toBe(true);
      }),
    );
  });

  test("secret should not expose any keys when Object.keys is called", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = Secret.fromString(input);
        const keys = Object.keys(secret);

        expect(keys).toEqual([]);
      }),
    );
  });

  test("secret should not expose hidden properties when Object.getOwnPropertyNames is called", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = Secret.fromString(input);
        const props = Object.getOwnPropertyNames(secret);

        expect(props).toEqual(["toString", "toJSON", "valueOf"]);
      }),
    );
  });

  test("secret should not expose raw data even if JSON.stringify is called", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = Secret.fromString(input);
        const obj = { secret };
        const stringified = JSON.stringify(obj);

        expect(stringified).toEqual('{"secret":"[REDACTED]"}');
      }),
    );
  });

  test("secret should not expose raw data even if JSON.stringify is called with replacer", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = Secret.fromString(input);
        const obj = { secret };
        const stringified = JSON.stringify(obj, (_key, value) => value);

        expect(stringified).toEqual('{"secret":"[REDACTED]"}');
      }),
    );
  });

  test("secret should not expose raw data even if JSON.stringify is called with replacer and space", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = Secret.fromString(input);
        const obj = { secret };
        const stringified = JSON.stringify(obj, (_key, value) => value, 2);

        expect(stringified).toEqual(
          `{
  "secret": "[REDACTED]"
}`,
        );
      }),
    );
  });

  test("secret should not expose raw data when it's stringified", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = Secret.fromString(input);

        const redacted1 = `${secret}`;
        expect(redacted1).toEqual("[REDACTED]");

        const redacted2 = "" + secret;
        expect(redacted2).toEqual("[REDACTED]");

        const redacted3 = secret.toString();
        expect(redacted3).toEqual("[REDACTED]");

        const redacted4 = secret.toLocaleString();
        expect(redacted4).toEqual("[REDACTED]");
      }),
    );
  });

  test("secret should not be exposed when its in Error", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = Secret.fromString(input);

        try {
          throw new Error(secret as any);
        } catch (e) {
          if (e instanceof Error) {
            expect(e.message).toEqual("[REDACTED]");
          } else {
            expect.unreachable();
          }
        }
      }),
    );
  });

  test("secret should not expose raw data when valueOf is called", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = Secret.fromString(input);
        const value = secret.valueOf();

        expect(value).toEqual("[REDACTED]");
      }),
    );
  });
});

class TmpFs {
  private filePath: string;

  constructor() {
    const tempDir = os.tmpdir();
    const rand = this.generateRandomString(16);
    this.filePath = `${tempDir}/secret_${rand}.txt`;
  }

  private getTempFilePath() {
    return this.filePath;
  }

  private generateRandomString(length: number) {
    const byteArray = new Uint8Array(length);

    crypto.getRandomValues(byteArray);

    let randomString = "";
    for (let byte of byteArray) {
      randomString += byte.toString(16).padStart(2, "0");
    }

    return randomString;
  }

  writeSync(data: any) {
    const tempFile = this.getTempFilePath();
    fs.writeFileSync(tempFile, data);
  }

  readSync() {
    const tempFile = this.getTempFilePath();
    return fs.readFileSync(tempFile, "utf8");
  }

  deleteSync() {
    const tempFile = this.getTempFilePath();
    fs.unlinkSync(tempFile);
  }

  touchSync() {
    const tempFile = this.getTempFilePath();
    fs.closeSync(fs.openSync(tempFile, "w"));
  }

  clearSync() {
    this.touchSync();
  }
}

describe("secret: output to file", () => {
  const tempFs = new TmpFs();

  beforeAll(() => {
    tempFs.touchSync();
  });

  afterAll(() => {
    tempFs.deleteSync();
  });

  test("secret should not be exposed when writing to a file", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        const secret = Secret.fromString(input);
        tempFs.writeSync(secret);
        const fileContent = tempFs.readSync();

        expect(fileContent).toEqual("[REDACTED]");
      }),
    );
  });
});

describe("secret: stdout & stderr", () => {
  test("secret should not be exposed when callig console.log", () => {
    const proc = Bun.spawnSync([
      "bun",
      "run",
      "./src/test-scripts/stdouttest.ts",
    ]);
    const stderr = proc.stderr.toString();
    expect(stderr).toEqual("");

    const stdout = proc.stdout.toString();
    expect(stdout).toEqual("[REDACTED]\n");
  });

  test("secret should not be exposed when inspecting and logging the output usign console.error", () => {
    const proc = Bun.spawnSync([
      "bun",
      "run",
      "./src/test-scripts/stderrtest.ts",
    ]);

    const stdout = proc.stdout.toString();
    expect(stdout).toEqual("");

    const stderr = proc.stderr.toString();
    expect(stderr).toEqual("[REDACTED]\n");
  });

  test("secret should not be exposed when inspecting and logging the output", () => {
    const proc = Bun.spawnSync([
      "bun",
      "run",
      "./src/test-scripts/inspecttest.ts",
    ]);

    const stderr = proc.stderr.toString();
    expect(stderr).toEqual("");

    const stdout = proc.stdout.toString();
    expect(stdout).toEqual("[REDACTED]\n");
  });

  test("secret should not be exposed when app throws and exists", () => {
    const proc = Bun.spawnSync([
      "bun",
      "run",
      "./src/test-scripts/throwexittest.ts",
    ]);

    const stdout = proc.stdout.toString();
    expect(stdout).toEqual("");

    const stderr = proc.stderr.toString();

    // find relevant line from stderr
    const lineStartsWithSpaces = "\\s{4,}.*\\n";
    const redactedPattern = "\\s*error:\\s+\\[REDACTED\\]\\s*\\n";
    const redactedErrorPattern = new RegExp(
      lineStartsWithSpaces + redactedPattern + lineStartsWithSpaces,
    );

    expect(stderr).toMatch(redactedErrorPattern);
  });
});

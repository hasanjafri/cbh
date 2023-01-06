const crypto = require("crypto");

const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });
  it("should return the partitionKey property of the event if it exists", () => {
    const event = { partitionKey: "sampleValue" };
    expect(deterministicPartitionKey(event)).toEqual("sampleValue");
  });

  it("should return a SHA3-512 hash of the event if partitionKey does not exist", () => {
    const event = { randomKey: "randomValue" };
    const hash = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");
    expect(deterministicPartitionKey(event)).toEqual(hash);
  });

  it("should return the trivial partition key if event is falsy", () => {
    console.log(deterministicPartitionKey(null))
    expect(deterministicPartitionKey(null)).toEqual("0");
    expect(deterministicPartitionKey(undefined)).toEqual("0");
  });

  it("should return a SHA3-512 hash of the candidate if its length is greater than the maximum partition key length", () => {
    const longString = "a".repeat(300);
    const hash = crypto.createHash("sha3-512").update(longString).digest("hex");
    expect(deterministicPartitionKey({ partitionKey: longString })).toEqual(hash);
  });
});
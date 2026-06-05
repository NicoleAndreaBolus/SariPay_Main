const { StrKey, Address } = require('@stellar/stellar-sdk');

const address = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";
console.log("Address:", address);
console.log("isValidContract:", StrKey.isValidContract(address));

try {
  const addr = Address.fromString(address);
  console.log("Success! Address parsed:", addr.toString());
} catch (err) {
  console.error("Failed to parse address:", err);
}

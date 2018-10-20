//DELETETHIS: whole file

const crypto = require("crypto");

const NUM_BYTES = 6; // 3 bytes = 4 base 64 characters

generate = () => {
  // Synchronous
  const buf = crypto.randomBytes(NUM_BYTES);
  return buf
    .toString("base64")
    .replace(/\//g, "_")
    .replace(/\+/g, "-");
};

module.exports.generate = generate;

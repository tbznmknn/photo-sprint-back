const crypto = require("crypto");

/**
 * Generate a salted and hashed password entry.
 * @param {string} clearTextPassword - The plain text password.
 * @return {object} An object containing the salt and hash.
 */
function makePasswordEntry(clearTextPassword) {
  // Generate an 8-byte random salt
  const salt = crypto.randomBytes(8).toString("hex");

  // Create a SHA-1 hash of the salt concatenated with the password
  const hash = crypto
    .createHash("sha1")
    .update(salt + clearTextPassword)
    .digest("hex");

  return { salt, hash };
}

/**
 * Check if a password matches the stored hash and salt.
 * @param {string} hash - The stored hash.
 * @param {string} salt - The stored salt.
 * @param {string} clearTextPassword - The input password to check.
 * @return {boolean} Whether the password matches.
 */
function doesPasswordMatch(hash, salt, clearTextPassword) {
  // Compute the hash from the salt and input password
  const computedHash = crypto
    .createHash("sha1")
    .update(salt + clearTextPassword)
    .digest("hex");

  return computedHash === hash;
}

// Export the functions
module.exports = { makePasswordEntry, doesPasswordMatch };

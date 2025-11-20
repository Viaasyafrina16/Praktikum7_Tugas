const crypto = require('crypto');

function generateApiKey() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = generateApiKey;

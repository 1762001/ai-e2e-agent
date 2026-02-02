const config = require('../config/agent.config');

function getAuthHeader() {
  return `${config.auth.tokenType} ${config.auth.accessToken}`;
}

module.exports = {
  getAuthHeader
};

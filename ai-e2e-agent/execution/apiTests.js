const axios = require('axios');
const TestResult = require('./testResult');
const config = require('../config/agent.config');

async function executeAPITest(test) {
  const result = new TestResult(test);

  try {
    const response = await axios({
      method: test.method || 'get',
      url: test.url,
      headers: {
        Authorization: `${config.auth.tokenType} ${config.auth.accessToken}`
      },
      validateStatus: () => true
    });

    if (response.status >= 500) {
      throw new Error(`Server error ${response.status}`);
    }

    result.pass();
  } catch (err) {
    result.fail(err.message, null);
  }

  return result;
}

module.exports = { executeAPITest };

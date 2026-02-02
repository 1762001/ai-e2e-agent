const { classifySeverity } = require('./severity');

function analyzeResults(results) {
  const bugs = [];

  for (const result of results) {
    if (result.status === 'FAIL') {
      bugs.push({
        id: result.id,
        description: result.description,
        type: result.type,
        target: result.target,
        severity: classifySeverity(result),
        error: result.error,
        screenshot: result.screenshot,
        timestamp: result.timestamp
      });
    }
  }

  return bugs;
}

module.exports = { analyzeResults };

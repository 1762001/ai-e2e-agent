function buildSummary(results, appName) {
  return {
    appName,
    total: results.length,
    passed: results.filter(r => r.status === 'PASS').length,
    failed: results.filter(r => r.status === 'FAIL').length
  };
}

module.exports = { buildSummary };

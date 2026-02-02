function classifySeverity(testResult) {
  if (testResult.status === 'PASS') return null;

  if (testResult.type === 'security') return 'CRITICAL';

  if (
    testResult.error &&
    (testResult.error.includes('500') ||
     testResult.error.includes('Server error'))
  ) {
    return 'HIGH';
  }

  if (testResult.type === 'edge' || testResult.type === 'negative') {
    return 'MEDIUM';
  }

  return 'LOW';
}

module.exports = { classifySeverity };

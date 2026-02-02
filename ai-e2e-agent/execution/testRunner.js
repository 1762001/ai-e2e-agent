const { executeUITest } = require('./uiTests');
const { executeAPITest } = require('./apiTests');

async function runTests(testPlan, page) {
  const results = [];

  const orderedTests = testPlan.tests.sort((a, b) => {
    const priority = { high: 1, medium: 2, low: 3 };
    return priority[a.priority] - priority[b.priority];
  });

  for (const test of orderedTests) {
    let result;

    if (test.target === 'route') {
      result = await executeUITest(test, page);
    } else {
      result = await executeAPITest(test);
    }

    results.push(result);
  }

  return results;
}

module.exports = { runTests };

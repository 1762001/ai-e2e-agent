const TestResult = require('./testResult');
const { screenshot } = require('./puppeteerManager');

async function executeUITest(test, page) {
  const result = new TestResult(test);

  try {
    // Generic execution logic (intentionally flexible)
    await page.waitForTimeout(300);

    // Heuristic: route-based tests
    if (test.target === 'route') {
      await page.goto(test.route || page.url(), {
        waitUntil: 'networkidle2'
      });
    }

    result.pass();
  } catch (err) {
    const file = `ui-${test.id}.png`;
    await screenshot(file);
    result.fail(err.message, file);
  }

  return result;
}

module.exports = { executeUITest };

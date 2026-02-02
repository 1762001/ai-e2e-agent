const TestResult = require('./testResult');
const { screenshot } = require('./puppeteerManager');

async function executeUITest(test, page) {
  const result = new TestResult(test);

  try {
    if (test.route) {
      // 🔥 Angular SPA navigation
      await page.evaluate((route) => {
        window.history.pushState({}, '', route);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, test.route);

      // Wait for Angular to stabilize
      await page.waitForTimeout(1000);

      await page.evaluate(() => {
        return new Promise(resolve => {
          if (window.getAllAngularTestabilities) {
            Promise.all(
              window.getAllAngularTestabilities().map(t => t.whenStable())
            ).then(resolve);
          } else {
            resolve();
          }
        });
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

const TestResult = require('./testResult');
const { screenshot } = require('./puppeteerManager');

async function executeUITest(test, page) {

  const result = new TestResult(test);

  try {

    // SPA navigation
    if (test.route) {

      await page.evaluate((route) => {

        window.history.pushState({}, '', route);
        window.dispatchEvent(
          new PopStateEvent('popstate')
        );

      }, test.route);

      await page.waitForTimeout(1200);
    }

    // Wait for Angular
    await page.evaluate(() => {

      return new Promise(resolve => {

        if (window.getAllAngularTestabilities) {

          Promise.all(
            window.getAllAngularTestabilities()
              .map(t => t.whenStable())
          ).then(resolve);

        } else resolve();

      });

    });

    // Detect UI errors
    const error =
      await page.$('.error,.alert-danger,.toast-error');

    if (error) {
      throw new Error('UI error detected');
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

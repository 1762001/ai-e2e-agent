const TestResult = require('./testResult');
const { screenshot } = require('./puppeteerManager');
const { findInteractiveElements } = require('./uiHeuristics');
const { generateSafeValue } = require('./inputGenerator');

async function executeUITest(test, page) {
  const result = new TestResult(test);

  try {
    /* =========================
       NAVIGATE
    ========================= */
    if (test.route) {
      await page.goto(test.route, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(1000);
    }

    /* =========================
       WAIT FOR ANGULAR
    ========================= */
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

    /* =========================
       DISCOVER UI ELEMENTS
    ========================= */
    const { inputs, buttons } = await findInteractiveElements(page);

    /* =========================
       FILL INPUTS
    ========================= */
    for (const input of inputs) {
      if (!input.name) continue;

      try {
        const selector = `[name="${input.name}"], #${input.name}`;
        await page.focus(selector);
        await page.keyboard.type(generateSafeValue(input), { delay: 20 });
      } catch (_) {
        // Ignore un-focusable inputs
      }
    }

    /* =========================
       CLICK PRIMARY BUTTONS
    ========================= */
    for (const btn of buttons) {
      if (btn.disabled) continue;
      if (!btn.text) continue;

      const lower = btn.text.toLowerCase();
      if (
        lower.includes('submit') ||
        lower.includes('save') ||
        lower.includes('next') ||
        lower.includes('continue')
      ) {
        await page.evaluate((text) => {
          const btn = Array.from(document.querySelectorAll('button'))
            .find(b => b.innerText.toLowerCase().includes(text));
          if (btn) btn.click();
        }, lower);

        await page.waitForTimeout(1000);
      }
    }

    /* =========================
       CAPTURE CONSOLE ERRORS
    ========================= */
    const consoleErrors = [];
    page.on('pageerror', err => consoleErrors.push(err.message));

    if (consoleErrors.length > 0) {
      throw new Error(`Console errors detected: ${consoleErrors.join(', ')}`);
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

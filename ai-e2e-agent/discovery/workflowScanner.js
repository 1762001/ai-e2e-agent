async function scanWorkflows(page) {

  const flows = [];

  await page.exposeFunction('logFlow', (data) => {
    flows.push(data);
  });

  await page.evaluate(() => {

    document.addEventListener('click', (e) => {

      const el = e.target.closest('button,a');

      if (!el) return;

      window.logFlow({
        type: 'click',
        text: el.innerText,
        id: el.id,
        class: el.className,
        route: location.pathname
      });
    });

    document.addEventListener('submit', (e) => {

      window.logFlow({
        type: 'submit',
        action: e.target.action,
        route: location.pathname
      });
    });

  });

  // Explore UI
  const elements = await page.$$('button,a');

  for (const el of elements) {
    try {
      await el.click({ delay: 80 });
      await page.waitForTimeout(700);
    } catch {}
  }

  return flows;
}

module.exports = { scanWorkflows };

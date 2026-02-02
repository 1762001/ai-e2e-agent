async function discoverUIRoutes(page) {
  const routes = new Set();

  // Track route changes
  await page.exposeFunction('onRouteChange', (url) => {
    routes.add(url);
  });

  await page.evaluate(() => {
    const pushState = history.pushState;
    history.pushState = function () {
      window.onRouteChange(location.href);
      return pushState.apply(history, arguments);
    };

    window.addEventListener('popstate', () => {
      window.onRouteChange(location.href);
    });
  });

  // Click navigable elements
  const clickableSelectors = [
    'a',
    '[routerLink]',
    'button'
  ];

  for (const selector of clickableSelectors) {
    const elements = await page.$$(selector);
    for (const el of elements) {
      try {
        await el.click({ delay: 50 });
        await page.waitForTimeout(500);
      } catch (_) {
        // ignore non-clickable
      }
    }
  }

  return Array.from(routes);
}

module.exports = { discoverUIRoutes };
